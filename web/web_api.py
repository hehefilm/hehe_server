# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from flask import Blueprint, render_template, request
import json

from bigbro.bigbro_cache import BigbroCache

web_api = Blueprint('web_api', __name__, template_folder='templates')


@web_api.route('/', methods=['GET'])
def index():

    return render_template('index.html')


@web_api.route('/resources/news', methods=['GET'])
def news_list():

    pg = int(request.args.get('pg', 1))
    num = int(request.args.get('num', 10))

    res_type = 'news'

    bb_cli = BigbroCache()

    start_ = (pg - 1) * num
    end_ = start_ + num

    ne_li = bb_cli.get_resource_list(res_type=res_type)

    rst = []
    for ne_id in ne_li:

        slz = {}
        ne = bb_cli.get_resource(res_type=res_type, res_id=ne_id)
        if not ne or ne['online'] != 'on':
            continue

        slz['news_id'] = ne['res_id']
        slz['ndate'] = ne['content']['ndate']
        slz['ntitle'] = ne['content']['ntitle']
        slz['nsubtitle'] = ne['content']['nsubtitle']
        slz['ncover'] = ne['content']['ncover']

        rst.append(slz)

    return json.dumps(rst[start_:end_])


@web_api.route('/resources/banner', methods=['GET'])
def banner_list():

    pg = int(request.args.get('pg', 1))
    num = int(request.args.get('num', 10))

    res_type = 'banner'

    bb_cli = BigbroCache()

    start_ = (pg - 1) * num
    end_ = start_ + num

    b_li = bb_cli.get_resource_list(res_type=res_type)

    rst = []
    for b_id in b_li:

        slz = {}
        bc = bb_cli.get_resource(res_type=res_type, res_id=b_id)
        if not bc or bc['online'] != 'on':
            continue

        slz['banner_id'] = bc['res_id']
        slz['btitle'] = bc['content']['btitle']
        slz['bkey'] = bc['content']['bkey']
        slz['bcover'] = bc['content']['bcover']
        slz['bdesc'] = bc['content']['bdesc']

        rst.append(slz)

    return json.dumps(rst[start_:end_])
