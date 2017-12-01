# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import json

from utils.database import get_bb_redis_client


class BigbroCache(object):

    SIGN_TOKEN_SECONDS = 3600

    def __init__(self):
        self.rds_cli = get_bb_redis_client()

    @staticmethod
    def get_manager_sign_key(username):
        return 'hehe.manager.sign:{}'.format(username)

    @staticmethod
    def get_resource_list_key(res_type):
        """
        :param res_type: banner, news, movies
        """
        return 'hehe.{}.list'.format(res_type)

    @staticmethod
    def get_resource_key(res_type, res_id):
        """
        :param res_type: banner, news, movies
        """
        return 'hehe.{0}:{1}'.format(res_type, res_id)

    def set_sign_info(self, username, bb_ip, bb_agent):
        ckey = BigbroCache.get_manager_sign_key(username)
        self.rds_cli.set(ckey, json.dumps({'username': username,
                                           'bb_ip': bb_ip,
                                           'bb_agent': bb_agent}))
        self.rds_cli.expire(ckey, self.SIGN_TOKEN_SECONDS)

    def get_sign_info(self, username):
        ckey = BigbroCache.get_manager_sign_key(username)
        rst = self.rds_cli.get(ckey)
        if rst:
            self.rds_cli.expire(ckey, self.SIGN_TOKEN_SECONDS)
            return json.loads(rst)
        return {}

    def is_online(self, username):
        ckey = BigbroCache.get_manager_sign_key(username)
        return True if self.rds_cli.get(ckey) else False

    def update_resource(self, res):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_key(res_type=res['res_tp'],
                                            res_id=res['res_id'])
        self.rds_cli.set(ckey, json.dumps(res))

    def get_resource(self, res_type, res_id):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_key(res_type, res_id)
        rst = self.rds_cli.get(ckey)
        return json.loads(rst) if rst else {}

    def top_resource(self, res_type, res_id):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_list_key(res_type)
        self.rds_cli.lrem(ckey, 0, res_id)
        self.rds_cli.lpush(ckey, res_id)

    def add_resource_id(self, res_type, res_id):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_list_key(res_type)
        self.rds_cli.lpush(ckey, res_id)

    def rem_resource_id(self, res_type, res_id):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_list_key(res_type)
        self.rds_cli.lrem(ckey, 0, res_id)

        rkey = BigbroCache.get_resource_key(res_type, res_id)
        self.rds_cli.delete(rkey)

    def get_resource_list(self, res_type, start=0, end=-1):
        """
        :param res_type: banner, news, movies
        """
        ckey = BigbroCache.get_resource_list_key(res_type)
        return self.rds_cli.lrange(ckey, start, end)

    def get_resource_len(self, res_type):
        """
        :param res_type: banner, news, movies
        """

        ckey = BigbroCache.get_resource_list_key(res_type)
        return self.rds_cli.llen(ckey)

    def set_signup_time(self, start_time, end_time):

        st = {'start': start_time, 'end': end_time}
        self.rds_cli.set(BigbroCache.get_signup_time_key(), json.dumps(st))

    def get_signup_time(self):

        rst = self.rds_cli.get(BigbroCache.get_signup_time_key())
        return json.loads(rst) if rst else {}