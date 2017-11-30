# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from functools import wraps
from flask import session, request
from utils.ip_util import get_client_ip
from bigbro.bigbro_cache import BigbroCache
from settings import HEHE_BB_IPS


def login_required(f):

    @wraps(f)
    def decorate_function(*args, **kargs):

        username = session.get('username', None)
        if not username:
            return 'login_first'

        sign_info = BigbroCache().get_sign_info(username)
        if not sign_info:
            return 'login_first'

        if sign_info['bb_ip'] != get_client_ip(request) or \
                sign_info['bb_agent'] != request.user_agent.string:
            return 'thx_for_request_1'

        request.username = username

        return f(*args, **kargs)
    return decorate_function


def bb_required(bbs):

    def wrapper(f):

        @wraps(f)
        def decorate_function(*args, **kargs):

            if session.get('username') not in bbs:
                return 'thx_for_request_2'

            return f(*args, **kargs)
        return decorate_function
    return wrapper


def ip_required(f):

    @wraps(f)
    def decorate_function(*args, **kargs):

        if get_client_ip(request) not in HEHE_BB_IPS:
            return 'thx_for_request_0'

        return f(*args, **kargs)
    return decorate_function
