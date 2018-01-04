# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from flask import Blueprint, render_template, request
import json
from math import ceil

from bigbro.bigbro_cache import BigbroCache
from bigbro.bigbro_resource import news_keys, movie_keys, \
    project_keys, about_keys, webroll_keys

web_api = Blueprint('web_api', __name__, template_folder='templates')


@web_api.route('/', methods=['GET'])
def index():

    return render_template('index.html')


@web_api.route('/resources/news', methods=['GET'])
def news_list():

    pg = int(request.args.get('pg', 1))
    num = int(request.args.get('num', 6))

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

    tpg = int(ceil(len(rst)/6.0))

    return json.dumps({'news_li': rst[start_:end_],
                       'total_pg': tpg,
                       'pg': pg})


@web_api.route('/resources/news/<news_id>', methods=['GET'])
def news_unit(news_id):

    bb_cli = BigbroCache()
    res_type = 'news'

    n_ids = bb_cli.get_resource_list(res_type=res_type)

    rst = {}
    this_ix = n_ids.index(news_id)
    rst['pre_id'] = n_ids[this_ix-1] if this_ix > 0 else ''
    rst['next_id'] = n_ids[this_ix+1] if this_ix < len(n_ids) - 1 else ''

    if rst['next_id']:
        next_nc = bb_cli.get_resource(res_type, rst['next_id'])
        if next_nc['online'] == 'off':
            rst['next_id'] = ''

    nc = bb_cli.get_resource(res_type=res_type, res_id=news_id)
    if not nc:
        rst['cnt'] = '<h1>nothing</h1>'
        rst['ntitle'] = 'nothing'
        rst['nsubtitle'] = 'nothing'
    else:
        for k in news_keys:
            rst[k] = nc['content'][k]

    return json.dumps(rst)


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
#     for b_id in b_li:

#         slz = {}
#         bc = bb_cli.get_resource(res_type=res_type, res_id=b_id)
#         if not bc or bc['online'] != 'on':
#             continue

#         slz['banner_id'] = bc['res_id']
#         for k in banner_keys:
#             slz[k] = bc['content'][k]

#         rst.append(slz)

    for mid in b_li:
        slz = {}
        mc = bb_cli.get_resource(res_type='movie', res_id=mid)
        if not mc or mc['online'] != 'on':
            continue

        slz['movie_id'] = mc['res_id']
        slz['mcover'] = mc['content']['mcover']
        slz['title'] = mc['content']['title']
        slz['description'] = mc['content']['description']
        slz['director'] = mc['content']['director']
        slz['writer'] = mc['content']['writer']
        slz['producer'] = mc['content']['producer']

        rst.append(slz)

    return json.dumps({'banner_li': rst[start_:end_]})


@web_api.route('/resources/movie', methods=['GET'])
def movie_list():

    pg = int(request.args.get('pg', 1))
    num = int(request.args.get('num', 10))

    res_type = 'movie'

    bb_cli = BigbroCache()

    start_ = (pg - 1) * num
    end_ = start_ + num

    m_li = bb_cli.get_resource_list(res_type=res_type)

    rst = []
    for m_id in m_li:

        slz = {}
        mc = bb_cli.get_resource(res_type=res_type, res_id=m_id)
        if not mc or mc['online'] != 'on':
            continue

        slz['movie_id'] = mc['res_id']
        slz['title'] = mc['content']['title']
        slz['description'] = mc['content']['description']
        slz['poster'] = mc['content']['pmajor']
        slz['release_date'] = mc['content']['release_date']
        slz['mcover'] = mc['content']['mcover']

        rst.append(slz)

    rst.sort(key=lambda m: m['release_date'], reverse=True)

    return json.dumps({'movie_li': rst[start_:end_]})


@web_api.route('/resources/movie/<movie_id>', methods=['GET'])
def movie_unit(movie_id):

    bb_cli = BigbroCache()
    res_type = 'movie'

    m_ids = bb_cli.get_resource_list(res_type=res_type)

    rst = {}
    this_ix = m_ids.index(movie_id)
    rst['pre_id'] = m_ids[this_ix-1] if this_ix > 0 else ''
    rst['next_id'] = m_ids[this_ix+1] if this_ix < len(m_ids) - 1 else ''

    if rst['next_id']:
        next_mc = bb_cli.get_resource(res_type, rst['next_id'])
        if next_mc['online'] == 'off':
            rst['next_id'] = ''

    mc = bb_cli.get_resource(res_type=res_type, res_id=movie_id)
    if not mc:
        rst['title'] = 'nothing'
    else:
        for k in movie_keys:
            rst[k] = mc['content'].get(k, '')

    return json.dumps(rst)


@web_api.route('/resources/movie_recommend', methods=['GET'])
def movie_recommend():

    bb_cli = BigbroCache()
    res_type = 'movie'

    mid = bb_cli.get_recommend_movie()
    if not mid:
        return '{}'

    mc = bb_cli.get_resource(res_type=res_type, res_id=mid)
    if not mc or mc['online'] == 'off':
        return '{}'

    return json.dumps({'title': mc['content']['title'],
                       'director': mc['content']['director'],
                       'writer': mc['content']['writer'],
                       'poster': mc['content']['pmajor'],
                       'release_date': mc['content']['release_date'],
                       'release_vision': mc['content']['release_vision'],
                       'stars': mc['content']['stars'],
                       'lang': mc['content']['lang'],
                       'duration': mc['content']['duration'],
                       'country': mc['content']['country'],
                       'genre': mc['content']['genre'],
                       'producer': mc['content']['producer'],
                       'movie_id': mc['res_id']})


@web_api.route('/resources/project', methods=['GET'])
def project_list():

    pg = int(request.args.get('pg', 1))
    num = int(request.args.get('num', 6))

    res_type = 'project'

    bb_cli = BigbroCache()

    start_ = (pg - 1) * num
    end_ = start_ + num

    p_li = bb_cli.get_resource_list(res_type=res_type)

    rst = []
    for p_id in p_li:

        slz = {}
        pc = bb_cli.get_resource(res_type=res_type, res_id=p_id)
        if not pc or pc['online'] != 'on':
            continue

        slz['project_id'] = pc['res_id']
        slz['pdate'] = pc['content']['pdate']
        slz['ptitle'] = pc['content']['ptitle']
        slz['psubtitle'] = pc['content']['psubtitle']
        slz['pcover'] = pc['content']['pcover']

        rst.append(slz)

    tpg = int(ceil(len(rst)/6.0))

    return json.dumps({'project_li': rst[start_:end_],
                       'total_pg': tpg,
                       'pg': pg})


@web_api.route('/resources/project/<project_id>', methods=['GET'])
def project_unit(project_id):

    bb_cli = BigbroCache()
    res_type = 'project'

    p_ids = bb_cli.get_resource_list(res_type=res_type)

    rst = {}
    this_ix = p_ids.index(project_id)
    rst['pre_id'] = p_ids[this_ix-1] if this_ix > 0 else ''
    rst['next_id'] = p_ids[this_ix+1] if this_ix < len(p_ids) - 1 else ''

    if rst['next_id']:
        next_pc = bb_cli.get_resource(res_type, rst['next_id'])
        if next_pc['online'] == 'off':
            rst['next_id'] = ''

    pc = bb_cli.get_resource(res_type=res_type, res_id=project_id)
    if not pc:
        rst['cnt'] = '<h1>nothing</h1>'
        rst['ptitle'] = 'nothing'
        rst['psubtitle'] = 'nothing'
    else:
        for k in project_keys:
            rst[k] = pc['content'][k]

    return json.dumps(rst)


@web_api.route('/resources/about_me', methods=['GET'])
def about_me():

    bb_cli = BigbroCache()
    res_type = 'about'

    a_ids = bb_cli.get_resource_list(res_type=res_type)

    rst = {}
    if a_ids:
        ac = bb_cli.get_resource(res_type=res_type, res_id=a_ids[0])
        for k in about_keys:
            rst[k] = ac['content'][k]

    return json.dumps(rst)


@web_api.route('/resources/friend', methods=['GET'])
def friend_list():

    # pg = int(request.args.get('pg', 1))
    # num = int(request.args.get('num', 10))

    res_type = 'webroll'

    bb_cli = BigbroCache()

    # start_ = (pg - 1) * num
    # end_ = start_ + num

    r_li = bb_cli.get_resource_list(res_type=res_type)

    rst = []
    for r_id in r_li:

        slz = {}
        rc = bb_cli.get_resource(res_type=res_type, res_id=r_id)
        if not rc or rc['online'] != 'on':
            continue

        # slz['friend_id'] = rc['res_id']
        for k in webroll_keys:
            slz[k] = rc['content'][k]

        rst.append(slz)

    rst.sort(key=lambda r: r['rrank'])

    return json.dumps({'friend_li': rst})
