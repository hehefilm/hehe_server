# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from functools import wraps

from flask import request
from flask_restful import reqparse

from utils.form import resp, validate_request
from utils.ip_util import get_client_ip


def validate(params, area='all'):
    """Wrapper to validate parameters

    The possibly massaged result will be saved in request.obj

    :param params: list of required parameter and type pairs
    """
    assert isinstance(params, list)

    def wrapper(f):

        @wraps(f)
        def decorated_function(*args, **kwargs):
            code, obj = validate_request(params, reqparse, area=area)
            if code > 0:
                return resp(code, obj)

            request.obj = obj
            return f(*args, **kwargs)
        return decorated_function
    return wrapper


def force_params(params):

    def wrapper(f):

        @wraps(f)
        def decorated_function(*args, **kwargs):
            for k in params:
                if k not in request.obj:
                    return resp(40002, 'missing_' + k, '')
            return f(*args, **kwargs)
        return decorated_function
    return wrapper


def ip_required(ip_list):

    def wapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if get_client_ip(request) not in ip_list:
                return 'Bad Request'
            return f(*args, **kwargs)
        return decorated_function
    return wapper
