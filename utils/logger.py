# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import logging.config
import json
import settings


_logger = None


def init():
    global _logger
    logging.config.dictConfig(settings.LOGGING)
    _logger = get_loggers(logging.getLogger('heheserver'))


def fmt_msg_for_log(msg):
    """

    Arguments:
    - `msg`:
    """
    if isinstance(msg, str):
        return '[info=%s]' % msg
    elif isinstance(msg, dict):
        return '[%s]' % ']['.join('%s=%s' % (k,
                                             isinstance(v, str) and
                                             v or json.dumps(v))
                                  for k, v in msg.iteritems())
    else:
        return '[info=%s]' % json.dumps(msg)


def get_loggers(logger):
    """

    Arguments:
    - `logger`:
    """

    return map(lambda lg: lambda l, path='':
               (lg('[logtype=%s]%s' % (l, fmt_msg_for_log(path))), l)[1],
               map(lambda a: getattr(logger, a),
                   ('info', 'warning', 'error')))


def loggers():
    global _logger
    if not _logger:
        init()
    return _logger
