# -*- coding: utf-8 -*-
'''
Created on 2018-2-2

@author: wubo
'''

import json

from bigbro.models import Resources
from bigbro.bigbro_cache import BigbroCache


def update_from_cache():

    bc_cli = BigbroCache()

    for r in Resources.query.yield_per(10):
        if r.deleted:
            continue
        bc = bc_cli.get_resource(res_type=r.res_tp, res_id=r.res_id)
        if not bc:
            continue
        r.content = json.dumps(bc['content'])
        r.update_bb = bc['bb']
        r.update()
        print r.id
