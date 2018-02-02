#! /usr/bin/env python
# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import sys
from flask import Flask, jsonify, request
from flask_restful import Api
from werkzeug.exceptions import default_exceptions
from werkzeug.contrib.fixers import ProxyFix

from utils.database import db
from utils.ip_util import get_client_ip
from utils import logger

from web.web_api import web_api
from bigbro.bigbro_api import bigbro_api
from bigbro import bigbro_update_util

import settings


def make_json_error(ex):
    response = jsonify({'code': 500, 'msg': str(ex), 'data': None})
    return response


def create_app():

    app = Flask(__name__)
    for code in default_exceptions.iterkeys():
        app.error_handler_spec[None][code] = make_json_error

    app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI

    app.secret_key = settings.SESSION_SECRET_KEY

    db.app = app
    db.init_app(app)

    return app


def get_rate_limit_key():
    return get_client_ip(request)


def request_log():
    data = ''
    if request.method in ['POST', 'PUT', 'PATCH']:
        data = request.get_json(force=True, silent=True)
    if request.method != 'HEAD':
        ilog, _, _ = logger.loggers()
        ilog('request_info', {'method': request.method,
                              'url': request.url,
                              'data': data})


def check_token():

    pass


app = create_app()


app.wsgi_app = ProxyFix(app.wsgi_app)
app.before_request(request_log)
# app.before_request(check_token)

app.register_blueprint(web_api)
app.register_blueprint(bigbro_api)
api = Api(app)


if __name__ == '__main__':

    port = 5050

    if len(sys.argv) > 1:
        local_cmd = sys.argv[1]
        if local_cmd == 'initdb':
            db.create_all()
            sys.exit(0)
        elif local_cmd == 'updatefromcache':
            bigbro_update_util.update_from_cache()
            sys.exit(0)
        else:
            port = int(sys.argv[1])

    app.run(host='0.0.0.0', port=port, debug=settings.STAGING_DEBUG)
