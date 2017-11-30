# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import multiprocessing
# import socket
# import os

bind = '127.0.0.1:5050'

workers = multiprocessing.cpu_count() * 2 + 1

worker_class = 'gevent'

pidfile = '/tmp/hehe_gunicorn.pid'

accesslog = 'logs/hehe_access.log'
access_log_format = ('%(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s ' +
                     '\"%(f)s\" \"%(a)s\" %(L)s %({X-Forwarded-For}i)s')

errorlog = 'logs/hehe_error.log'
