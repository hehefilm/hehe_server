# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import os


RUNDIR = os.path.dirname(os.path.realpath(__file__))
HOME_STAT_PATH = '%s/rundata/home_stat.json' % RUNDIR

# mysql
SQLALCHEMY_DATABASE_URI = 'sqlite:////%s/rundata/tmp.db' % RUNDIR


SESSION_SECRET_KEY = 'helloworld'
USER_ID_KEY = 'HELLOWORLD'


SENSITIVE_WORD_KEY = ''


# redis
CACHE_REDIS_HOST = '127.0.0.1'
CACHE_REDIS_PORT = 6379
CACHE_REDIS_IDX = 1
CACHE_REDIS_PWD = 'helloworld'


STAGING_DEBUG = True


# aliyun
SLB_USE = False


# qiniu
QN_ACCESS_KEY = ''
QN_SECRET_KEY = ''
QN_UPLOAD_TOKEN_EXPIRE = 3600
QN_PUBLIC_BUCKET_NAME = ''
QN_PUBLIC_BUCKET_DOMAIN = ''


# ip
SERVER_IP = '127.0.0.1'


# bb
HEHE_BB_IPS = []
HEHE_BB_MANAGERS = ''


app_log = '%s/logs' % RUNDIR
# logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(levelname)s][%(asctime)s]%(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
        'raw': {
            'format': '%(message)s'
        }
    },
    'handlers': {
        'file_request': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'formatter': 'verbose',
            'filename': os.path.join(app_log, 'heheserver.log'),
            'when': 'h'
        },
        'file_request_err': {
            'level': 'ERROR',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'formatter': 'verbose',
            'filename': os.path.join(app_log, 'heheserver.log.err'),
            'when': 'h'
        }
    },
    'loggers': {
        'heheserver': {
            'handlers': ['file_request', 'file_request_err'],
            'level': 'INFO',
            'propagate': True
        }
    }
}

try:
    from local_settings import *
except ImportError:
    pass
