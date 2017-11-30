# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import redis
from flask.ext.sqlalchemy import SQLAlchemy
import settings


db = SQLAlchemy()

rds = None
bb_rds = None

redis_uri = ('redis://:' + settings.CACHE_REDIS_PWD +
             '@' + settings.CACHE_REDIS_HOST + ':' +
             str(settings.CACHE_REDIS_PORT) + '/0')


def get_create_table(table):
    from sqlalchemy.schema import CreateTable
    from sqlalchemy import create_engine
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    return CreateTable(table).compile(engine)


def get_redis_client():
    global rds
    if not rds:
        rds = redis.StrictRedis(host=settings.CACHE_REDIS_HOST,
                                port=settings.CACHE_REDIS_PORT,
                                password=settings.CACHE_REDIS_PWD,
                                db=settings.CACHE_REDIS_IDX)
    return rds


def get_bb_redis_client():
    global bb_rds
    if not bb_rds:
        bb_rds = redis.StrictRedis(host=settings.CACHE_REDIS_HOST,
                                   port=settings.CACHE_REDIS_PORT,
                                   password=settings.CACHE_REDIS_PWD,
                                   db=2)
    return bb_rds
