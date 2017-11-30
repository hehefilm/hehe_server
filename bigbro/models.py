# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import time

from utils.database import db


class Resources(db.Model):

    TYPE_BANNER = 'banner'
    TYPE_NEWS = 'news'
    TYPE_MOVIE = 'movie'
    TYPE_PROJECT = 'project'

    id = db.Column(db.BigInteger, primary_key=True)
    res_id = db.Column(db.String(32), index=True)
    res_tp = db.Column(db.String(16))
    content = db.Column(db.Text)
    created = db.Column(db.Integer)
    create_bb = db.Column(db.String(20))
    updated = db.Column(db.Integer)
    update_bb = db.Column(db.String(20))
    deleted = db.Column(db.Integer, default=0)

    def __init__(self):
        self.created = int(time.time())
        self.updated = self.created

    @staticmethod
    def create(res_tp, content, create_bb, res_id=None):
        r = Resources()
        r.res_tp = res_tp
        r.content = content
        r.create_bb = create_bb
        r.update_bb = create_bb

        r.res_id = res_id if res_id else '{0}_{1}'.format(r.res_tp, r.created)

        db.session.add(r)
        db.session.commit()

        return r

    def update(self):
        self.updated = int(time.time())
        db.session.commit()

    @staticmethod
    def bb_delete(res_tp, res_id, update_bb):
        now_ts = int(time.time())
        Resources.query.filter(Resources.res_id == res_id,
                               Resources.res_tp == res_tp).\
            update({'deleted': now_ts,
                    'updated': now_ts,
                    'update_bb': update_bb}, synchronize_session=False)

        db.session.commit()
