# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import arrow
import json

from utils import logger


def validate_request(params, reqparse, area='all'):
    """Validate request
    :param list params: list of required parameters, like [('p', int), ]
    :return: (True, dict) or (False, err_msg)
    """

    default_params = []

    total_params = list(set(params) | set(default_params))

    _json = {}
    parser = reqparse.RequestParser()
    for p, t in total_params:
        if t is int:
            parser.add_argument(p, type=int)
        elif t is list:
            parser.add_argument(p,
                                location='json',
                                type=list,
                                case_sensitive=True)
        elif t is dict:
            parser.add_argument(p, type=dict, case_sensitive=True)
        else:
            parser.add_argument(p, case_sensitive=True)

    args = parser.parse_args()
    for p, _ in total_params:
        if args[p] is not None:
            _json[p] = args[p]
    if not _json:
        return 40005, 'params_empty'
    for key, _ in params:
        if (_json.get(key, None) is None) and (area == 'all'):
            return 40002, 'missing_' + key
    for key in _json.keys():
        pre = preprocessors.get(key, None)
        if pre:
            _json[key] = pre(_json[key])
            if _json[key] is None:
                return 40014, 'invalid_' + key
    return 0, _json


def resp(code, msg, data={}):
    """
    Arguments:
    - `code`:
    - `msg`:
    """
    if data == '':
        data = {}

    ilog, _wlog, elog = logger.loggers()
    _log = ilog if code == 0 else elog
    _log('request_result', {'code': code,
                            'msg': msg,
                            'data': data})
    return {'code': code, 'msg': msg, 'data': data}


def resp_str(code, msg, data={}):
    """
    Arguments:
    - `code`:
    - `msg`:
    """
    if data == '':
        data = {}

    return json.dumps({'code': code, 'msg': msg, 'data': data})


def resp_bro(code, msg, data={}):
    bd = {'code': code, 'msg': msg, 'data': data}
    return bd, 200, {'Access-Control-Allow-Origin': '*'}


preprocessors = {}


def ts2human(ts):
    p = arrow.utcnow()
    th = arrow.Arrow.utcfromtimestamp(ts)
    return th.humanize(p, locale='zh')
