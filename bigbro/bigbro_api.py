# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from math import ceil
from hashlib import sha1

from flask import Blueprint, render_template, request, session
import json
import re
import os
from datetime import datetime

from settings import HEHE_BB_MANAGERS, RUNDIR
from bigbro_decorator import login_required, ip_required
from bigbro.bigbro_cache import BigbroCache
from bigbro.models import Resources
from bigbro.bigbro_resource import delete_resource
from bigbro.bigbro_resource import banner_keys, news_keys, movie_keys, \
    project_keys, about_keys, webroll_keys
from utils.date_util import timestamp_to_strftime
from utils.random_utils import random_string
from utils.ip_util import get_client_ip


bigbro_api = Blueprint('bigbro_api', __name__, template_folder='templates')


@bigbro_api.route('/hehebb/login', methods=['GET', 'POST'])
@ip_required
def login():

    if request.method == 'GET':
        return render_template('hh_login.html')

    username = request.form.get('username', None)
    password = request.form.get('password', None)
    if not username or not password:
        return render_template('hh_login.html')

    bbs = HEHE_BB_MANAGERS

    if username not in bbs:
        return render_template('hh_login.html')

    if bbs[username] != sha1(password).hexdigest():
        return render_template('hh_login.html')

    session['username'] = username

    BigbroCache().set_sign_info(username=username,
                                bb_ip=get_client_ip(request),
                                bb_agent=request.user_agent.string)

    return render_template('hh_home.html')


@bigbro_api.route('/hehebb/logout', methods=['GET', 'POST'])
def logout():

    session['username'] = None

    return render_template('hh_login.html')


@bigbro_api.route('/hehebb/home', methods=['GET'])
@login_required
def home():

    return render_template('hh_home.html')


@bigbro_api.route('/hehebb/banners', methods=['GET', 'POST'])
@login_required
def banners():

    bb_cli = BigbroCache()
    rtp = 'banner'

    if request.method == 'POST':
        cnt = {}
        for k in banner_keys:
            cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'online': 'off',
                                'bb': request.username,
                                'content': cnt,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        return render_template('banner_create.html')

    pg = int(request.args.get('pg', 1))

    start_ = (pg - 1) * 20
    end_ = start_ + 20 - 1

    banner_total = bb_cli.get_resource_len(res_type=rtp)
    total_pg = int(ceil(banner_total/20.0))

    b_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for b_id in b_ids:
        # slz = {}
        # bc = bb_cli.get_resource(res_type=rtp, res_id=b_id)
        # if not bc:
        #    continue

        # slz['res_id'] = bc['res_id']
        # slz['bb'] = bc['bb']
        # slz['created'] = timestamp_to_strftime(bc['created'])
        # slz['online'] = bc['online']
        # for k in banner_keys:
        #    slz[k] = bc['content'][k]

        # rst.append(slz)

        slz = {}
        mc = bb_cli.get_resource(res_type='movie', res_id=b_id)
        if not mc:
            continue

        slz['res_id'] = mc['res_id']
        slz['bb'] = mc['bb']
        slz['created'] = timestamp_to_strftime(mc['created'])
        slz['online'] = mc['online']
        slz['res_tp'] = mc['res_tp']
        for k in movie_keys:
            slz[k] = mc['content'].get(k, '')

        rst.append(slz)

    return render_template('banner_movies_v11.html',
                           movies=rst,
                           banner_total=banner_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/banner', methods=['POST'])
@login_required
def banner():

    act = request.form.get('act')
    bid = request.form.get('bid')
    rtp = 'banner'

    if not (act and bid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()
    bc = bb_cli.get_resource(res_type=rtp, res_id=bid)
    if not bc:
        return 'thx_for_request'

    if act in ['on', 'off']:
        bc['online'] = act
        bb_cli.update_resource(bc)
    elif act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=bid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=bid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=bid,
                            update_bb=request.username)
        if bc['content']['bcover']:
            delete_resource(bc['content']['bcover'])

    return 'ok'


@bigbro_api.route('/hehebb/banner_create', methods=['GET', 'POST'])
@login_required
def banner_create():

    if request.method == 'GET':
        return render_template('banner_create.html')

    return 'ok'


@bigbro_api.route('/hehebb/banner_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def banner_edit(res_id):

    res_tp = 'banner'

    bb_cli = BigbroCache()
    bc = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = bc['res_id']
        for k in banner_keys:
            slz[k] = bc['content'][k]

        return render_template('banner_edit.html',
                               b=slz)

    pre_cover = bc['content']['bcover']

    for k in banner_keys:
        bc['content'][k] = request.form[k]
    bc['bb'] = request.username

    if pre_cover and pre_cover != bc['content']['bcover']:
        delete_resource(pre_cover)

    bb_cli.update_resource(bc)

    return render_template('banner_create.html')


@bigbro_api.route('/hehebb/news', methods=['GET', 'POST'])
@login_required
def news():

    bb_cli = BigbroCache()
    rtp = 'news'

    if request.method == 'POST':
        cnt = {}
        for k in news_keys:
            cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'content': cnt,
                                'online': 'off',
                                'bb': r.create_bb,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        return render_template('news_create.html')

    pg = int(request.args.get('pg', 1))

    start_ = (pg - 1) * 10
    end_ = start_ + 10 - 1

    news_total = bb_cli.get_resource_len(res_type=rtp)
    total_pg = int(ceil(news_total/10.0))

    n_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for n_id in n_ids:
        slz = {}
        nc = bb_cli.get_resource(res_type=rtp, res_id=n_id)
        if not nc:
            continue

        slz['res_id'] = nc['res_id']
        slz['bb'] = nc['bb']
        slz['created'] = timestamp_to_strftime(nc['created'])
        slz['online'] = nc['online']
        for k in news_keys:
            slz[k] = nc['content'][k]

        rst.append(slz)

    return render_template('hh_news_v11.html',
                           news=rst,
                           news_total=news_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/projects', methods=['GET', 'POST'])
@login_required
def projects():

    bb_cli = BigbroCache()
    rtp = 'project'

    if request.method == 'POST':
        cnt = {}
        for k in project_keys:
            cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'content': cnt,
                                'online': 'off',
                                'bb': r.create_bb,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        return render_template('project_create.html')

    pg = int(request.args.get('pg', 1))

    start_ = (pg - 1) * 10
    end_ = start_ + 10 - 1

    project_total = bb_cli.get_resource_len(res_type=rtp)
    total_pg = int(ceil(project_total/10.0))

    p_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for p_id in p_ids:
        slz = {}
        pc = bb_cli.get_resource(res_type=rtp, res_id=p_id)
        if not pc:
            continue

        slz['res_id'] = pc['res_id']
        slz['bb'] = pc['bb']
        slz['created'] = timestamp_to_strftime(pc['created'])
        slz['online'] = pc['online']
        slz['res_tp'] = ''
        for k in project_keys:
            slz[k] = pc['content'][k]

        rst.append(slz)

    return render_template('hh_projects_v11.html',
                           projects=rst,
                           project_total=project_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/project_create', methods=['GET', 'POST'])
@login_required
def project_create():

    if request.method == 'GET':
        return render_template('project_create.html')

    return 'ok'


@bigbro_api.route('/hehebb/project_unit', methods=['POST'])
@login_required
def project_unit():

    act = request.form.get('act')
    proid = request.form.get('proid')
    rtp = 'project'

    if not (act and proid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()
    pc = bb_cli.get_resource(res_type=rtp, res_id=proid)
    if not pc:
        return 'thx_for_request'

    if act in ['on', 'off']:
        pc['online'] = act
        bb_cli.update_resource(pc)
    elif act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=proid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=proid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=proid,
                            update_bb=request.username)
        if pc['content']['pcover']:
            delete_resource(pc['content']['pcover'])

    return 'ok'


@bigbro_api.route('/hehebb/project_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def project_edit(res_id):

    res_tp = 'project'

    bb_cli = BigbroCache()
    pc = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = pc['res_id']
        for k in project_keys:
            slz[k] = pc['content'][k]

        return render_template('project_edit.html',
                               project=slz)

    pre_cover = pc['content']['pcover']

    cnt = {}
    for k in project_keys:
        cnt[k] = request.form[k]

    pc['content'] = cnt
    pc['bb'] = request.username
    bb_cli.update_resource(pc)

    if pre_cover and pre_cover != pc['content']['pcover']:
        delete_resource(pre_cover)

    return render_template('project_create.html')


@bigbro_api.route('/hehebb/news_unit', methods=['POST'])
@login_required
def news_unit():

    act = request.form.get('act')
    nid = request.form.get('nid')
    rtp = 'news'

    if not (act and nid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()
    nc = bb_cli.get_resource(res_type=rtp, res_id=nid)
    if not nc:
        return 'thx_for_request'

    if act in ['on', 'off']:
        nc['online'] = act
        bb_cli.update_resource(nc)
    elif act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=nid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=nid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=nid,
                            update_bb=request.username)
        if nc['content']['ncover']:
            delete_resource(nc['content']['ncover'])

    return 'ok'


@bigbro_api.route('/hehebb/news_create', methods=['GET', 'POST'])
@login_required
def news_create():

    if request.method == 'GET':
        return render_template('news_create.html')

    return 'ok'


@bigbro_api.route('/hehebb/news_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def news_edit(res_id):

    res_tp = 'news'

    bb_cli = BigbroCache()
    nc = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = nc['res_id']
        for k in news_keys:
            slz[k] = nc['content'][k]

        return render_template('news_edit.html',
                               news=slz)

    pre_cover = nc['content']['ncover']

    cnt = {}
    for k in news_keys:
        cnt[k] = request.form[k]

    nc['content'] = cnt
    nc['bb'] = request.username
    bb_cli.update_resource(nc)

    if pre_cover and pre_cover != nc['content']['ncover']:
        delete_resource(pre_cover)

    return render_template('news_create.html')


@bigbro_api.route('/hehebb/movies', methods=['GET', 'POST'])
@login_required
def movies():

    bb_cli = BigbroCache()
    rtp = 'movie'

    if request.method == 'POST':
        cnt = {}
        for k in movie_keys:
            if k == 'clips':
                cnt[k] = request.form.getlist('clips[]')
            elif k == 'posters':
                cnt[k] = request.form.getlist('posters[]')
            elif k == 'videos':
                v_links = request.form.getlist('vdo_links[]')
                v_covers = request.form.getlist('vdo_covers[]')
                v_titles = request.form.getlist('vdo_titles[]')
                cnt[k] = []
                for l, c, t in zip(v_links, v_covers, v_titles):
                    cnt[k].append({'vlink': l, 'vcover': c, 'vtitle': t})
            else:
                cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'online': 'off',
                                'bb': request.username,
                                'content': cnt,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        return render_template('movie_create.html')

    pg = int(request.args.get('pg', 1))

    start_ = (pg - 1) * 20
    end_ = start_ + 20 - 1

    movie_total = bb_cli.get_resource_len(res_type=rtp)
    total_pg = int(ceil(movie_total/20.0))

    m_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for m_id in m_ids:
        slz = {}
        mc = bb_cli.get_resource(res_type=rtp, res_id=m_id)
        if not mc:
            continue

        slz['res_id'] = mc['res_id']
        slz['bb'] = mc['bb']
        slz['created'] = timestamp_to_strftime(mc['created'])
        slz['online'] = mc['online']
        slz['res_tp'] = mc['res_tp']
        for k in movie_keys:
            slz[k] = mc['content'].get(k, '')

        rst.append(slz)

    return render_template('hh_movies_v11.html',
                           movies=rst,
                           movie_total=movie_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/movie_recommend', methods=['GET'])
@login_required
def movie_recommend():

    bb_cli = BigbroCache()
    rtp = 'movie'

    pg = int(request.args.get('pg', 1))

    movie_total = 0
    total_pg = 0

    m_id = bb_cli.get_recommend_movie()

    rst = []
    if m_id:
        movie_total = 1
        total_pg = 1
        mc = bb_cli.get_resource(res_type=rtp, res_id=m_id)
        if mc and mc['online'] == 'on':
            slz = {}

            slz['res_id'] = mc['res_id']
            slz['bb'] = mc['bb']
            slz['created'] = timestamp_to_strftime(mc['created'])
            slz['online'] = mc['online']
            for k in movie_keys:
                slz[k] = mc['content'].get(k, '')

            slz['videos'] = mc['content']['videos']

            rst.append(slz)

    return render_template('movie_recommend.html',
                           movies=rst,
                           movie_total=movie_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/movie', methods=['POST'])
@login_required
def movie():

    act = request.form.get('act')
    mid = request.form.get('mid')
    rtp = 'movie'

    if not (act and mid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()
    mc = bb_cli.get_resource(res_type=rtp, res_id=mid)
    if not mc:
        return 'thx_for_request'

    if act in ['on', 'off']:
        mc['online'] = act
        bb_cli.update_resource(mc)
    elif act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=mid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=mid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=mid,
                            update_bb=request.username)
        if mc['content']['posters']:
            for p in mc['content']['posters']:
                delete_resource(p)
        if mc['content']['clips']:
            for c in mc['content']['clips']:
                delete_resource(c)
        if mc['content']['mcover']:
            delete_resource(mc['content']['mcover'])
        if mc['content']['videos']:
            for v in mc['content']['videos']:
                delete_resource(v['vcover'])
    elif act == 'rcmd-on':
        bb_cli.set_recommend_movie(movie_id=mid)
    elif act == 'rcmd-off':
        bb_cli.del_recommend_movie()
    elif act == 'banner-on':
        bb_cli.add_resource_id(res_type='banner', res_id=mid)
    elif act == 'banner-off':
        bb_cli.rem_resource_id(res_type='banner', res_id=mid)

    return 'ok'


@bigbro_api.route('/hehebb/movie_create', methods=['GET', 'POST'])
@login_required
def movie_create():

    if request.method == 'GET':
        return render_template('movie_create.html')

    return 'ok'


@bigbro_api.route('/hehebb/movie_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def movie_edit(res_id):

    res_tp = 'movie'

    bb_cli = BigbroCache()
    mc = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = mc['res_id']
        for k in movie_keys:
            slz[k] = mc['content'].get(k, '')

        return render_template('movie_edit.html',
                               movie=slz)

    pre_cover = mc['content'].get('mcover', '')

    cnt = {}
    for k in movie_keys:
        if k == 'clips':
            cnt[k] = request.form.getlist('clips[]')
        elif k == 'posters':
            cnt[k] = request.form.getlist('posters[]')
        elif k == 'videos':
            v_links = request.form.getlist('vdo_links[]')
            v_covers = request.form.getlist('vdo_covers[]')
            v_titles = request.form.getlist('vdo_titles[]')
            cnt[k] = []
            for l, c, t in zip(v_links, v_covers, v_titles):
                cnt[k].append({'vlink': l, 'vcover': c, 'vtitle': t})
        else:
            cnt[k] = request.form[k]

    mc['content'] = cnt
    mc['bb'] = request.username
    bb_cli.update_resource(mc)

    if pre_cover and pre_cover != mc['content']['mcover']:
        delete_resource(pre_cover)

    return render_template('movie_create.html')


@bigbro_api.route('/hehebb/ue', methods=['GET', 'POST'])
@login_required
def ue():

    act = request.args.get('action')
    if not act:
        return json.dumps({'state': 'ERROR', 'msg': 'thx_for_request'})

    if act == 'config':
        with open(RUNDIR+'/static/ueditor/php/config.json') as f:
            try:
                conf_ = json.loads(re.sub(r'\/\*.*\*\/', '', f.read()))
            except:
                conf_ = {}

        return json.dumps(conf_)

    t = datetime.now()

    if 'upfile' not in request.files:
        return json.dumps({'state': 'ERROR', 'msg': 'no file'})

    fl = request.files['upfile']
    if fl.filename == '':
        return json.dumps({'state': 'ERROR', 'msg': 'not select'})

    if act == 'uploadimage':

        f_path = os.path.join(RUNDIR,
                              'static/uploads/images',
                              t.strftime('%Y%m%d'))
        if not os.path.exists(f_path):
            os.makedirs(f_path)

        fn = '{0}/{1}.{2}'.format(f_path,
                                  random_string(10),
                                  fl.filename.rsplit('.', 1)[1].lower())
        fl.save(fn)

        d_path = '/' + fn.split('/', 4)[-1]
        l_name = fn.rsplit('/', 1)[1]

        return json.dumps({'state': 'SUCCESS',
                           'url': d_path,
                           'title': l_name,
                           'original': fl.filename,
                           'msg': 'ok'})

    if act == 'uploadvideo':

        f_path = os.path.join(RUNDIR,
                              'static/uploads/videos',
                              t.strftime('%Y%m%d'))
        if not os.path.exists(f_path):
            os.makedirs(f_path)

        fn = '{0}/{1}.{2}'.format(f_path,
                                  random_string(10),
                                  fl.filename.rsplit('.', 1)[1].lower())
        fl.save(fn)

        d_path = '/' + fn.split('/', 4)[-1]
        l_name = fn.rsplit('/', 1)[1]

        return json.dumps({'state': 'SUCCESS',
                           'url': d_path,
                           'title': l_name,
                           'original': fl.filename})

    return json.dumps({'state': 'ERROR', 'msg': 'thx'})


@bigbro_api.route('/hehebb/covers', methods=['POST'])
@login_required
def covers():

    tp = request.args.get('tp')
    if not tp:
        return json.dumps({'state': 'ERROR', 'msg': 'thx_for_request'})

    if 'upfile' not in request.files:
        return json.dumps({'state': 'ERROR', 'msg': 'no file'})

    fl = request.files['upfile']
    if fl.filename == '':
        return json.dumps({'state': 'ERROR', 'msg': 'not select'})

    t = datetime.now()

    if tp == 'news-cover-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/news',
                              t.strftime('%Y%m%d'))
    elif tp == 'banner-cover-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/banner',
                              t.strftime('%Y%m%d'))
    elif tp == 'movie-cover-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/movie',
                              t.strftime('%Y%m%d'))
    elif tp == 'project-cover-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/project',
                              t.strftime('%Y%m%d'))
    elif tp == 'movie-video-cover':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/video',
                              t.strftime('%Y%m%d'))
    elif tp == 'movie-clip-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/clips',
                              t.strftime('%Y%m%d'))
    elif tp == 'movie-poster-pic':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/posters',
                              t.strftime('%Y%m%d'))
    elif tp == 'movie-major-poster':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/posters',
                              t.strftime('%Y%m%d'))
    elif tp == 'web-roll-logo':
        f_path = os.path.join(RUNDIR,
                              'static/uploads/logos',
                              t.strftime('%Y%m%d'))
    else:
        f_path = ''

    if not f_path:
        return json.dumps({'state': 'ERROR', 'msg': 'thx'})

    if not os.path.exists(f_path):
        os.makedirs(f_path)

    fn = '{0}/{1}.{2}'.format(f_path,
                              random_string(10),
                              fl.filename.rsplit('.', 1)[1].lower())
    fl.save(fn)

    d_path = '/' + fn.split('/', 4)[-1]

    return json.dumps({'state': 'SUCCESS',
                       'key': d_path,
                       'msg': 'ok',
                       'tp': tp})


@bigbro_api.route('/hehebb/remove_resource', methods=['POST'])
@login_required
def remove_resource():

    res_key = request.form['key']
    try:
        delete_resource(res_key)
        rst = 'ok'
    except Exception as e:
        rst = str(e)
    finally:
        return rst


@bigbro_api.route('/hehebb/about_me', methods=['GET', 'POST'])
@login_required
def about_me():

    rtp = 'about'
    bb_cli = BigbroCache()

    if request.method == 'POST':
        cnt = {}
        for k in about_keys:
            cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'content': cnt,
                                'bb': r.create_bb,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        a = {'res_id': r.res_id,
             'bb': r.create_bb,
             'created': timestamp_to_strftime(r.created),
             'adetail': cnt['adetail']}

        return render_template('hh_about.html',
                               about=a)

    a_li = bb_cli.get_resource_list(res_type=rtp)
    if not a_li:
        return render_template('about_edit.html', about={})

    ac = bb_cli.get_resource(res_type=rtp, res_id=a_li[0])
    rst = {'res_id': ac['res_id'],
           'bb': ac['bb'],
           'created': timestamp_to_strftime(ac['created']),
           'adetail': ac['content']['adetail']}

    return render_template('hh_about.html', about=rst)


@bigbro_api.route('/hehebb/about_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def about_edit(res_id):

    res_tp = 'about'

    bb_cli = BigbroCache()
    ac = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = ac['res_id']
        for k in about_keys:
            slz[k] = ac['content'][k]

        return render_template('about_edit.html',
                               about=slz)

    cnt = {}
    for k in about_keys:
        cnt[k] = request.form[k]

    ac['content'] = cnt
    ac['bb'] = request.username
    bb_cli.update_resource(ac)

    a = {'res_id': ac['res_id'],
         'bb': ac['bb'],
         'created': timestamp_to_strftime(ac['created']),
         'adetail': ac['content']['adetail']}

    return render_template('hh_about.html',
                           about=a)


@bigbro_api.route('/hehebb/webrolls', methods=['GET', 'POST'])
@login_required
def webrolls():

    bb_cli = BigbroCache()
    rtp = 'webroll'

    if request.method == 'POST':
        cnt = {}
        for k in webroll_keys:
            cnt[k] = request.form[k]

        r = Resources.create(res_tp=rtp,
                             content=json.dumps(cnt),
                             create_bb=request.username)

        bb_cli.update_resource({'res_tp': r.res_tp,
                                'res_id': r.res_id,
                                'online': 'off',
                                'bb': request.username,
                                'content': cnt,
                                'created': r.created})
        bb_cli.add_resource_id(res_type=r.res_tp, res_id=r.res_id)

        return render_template('webroll_create.html')

    pg = int(request.args.get('pg', 1))

    start_ = (pg - 1) * 20
    end_ = start_ + 20 - 1

    webroll_total = bb_cli.get_resource_len(res_type=rtp)
    total_pg = int(ceil(webroll_total/20.0))

    r_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for r_id in r_ids:
        slz = {}
        rc = bb_cli.get_resource(res_type=rtp, res_id=r_id)
        if not rc:
            continue

        slz['res_id'] = rc['res_id']
        slz['bb'] = rc['bb']
        slz['created'] = timestamp_to_strftime(rc['created'])
        slz['online'] = rc['online']
        for k in webroll_keys:
            slz[k] = rc['content'][k]

        rst.append(slz)

    return render_template('hh_webrolls.html',
                           webrolls=rst,
                           webroll_total=webroll_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/webroll', methods=['POST'])
@login_required
def webroll():

    act = request.form.get('act')
    rid = request.form.get('rid')
    rtp = 'webroll'

    if not (act and rid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()
    rc = bb_cli.get_resource(res_type=rtp, res_id=rid)
    if not rc:
        return 'thx_for_request'

    if act in ['on', 'off']:
        rc['online'] = act
        bb_cli.update_resource(rc)
    elif act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=rid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=rid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=rid,
                            update_bb=request.username)
        if rc['content']['rlogo']:
            delete_resource(rc['content']['rlogo'])

    return 'ok'


@bigbro_api.route('/hehebb/webroll_create', methods=['GET', 'POST'])
@login_required
def webroll_create():

    if request.method == 'GET':
        return render_template('webroll_create.html')

    return 'ok'


@bigbro_api.route('/hehebb/webroll_edit/<res_id>', methods=['GET', 'POST'])
@login_required
def webroll_edit(res_id):

    res_tp = 'webroll'

    bb_cli = BigbroCache()
    rc = bb_cli.get_resource(res_type=res_tp, res_id=res_id)

    if request.method == 'GET':

        slz = {}
        slz['res_id'] = rc['res_id']
        for k in webroll_keys:
            slz[k] = rc['content'][k]

        return render_template('webroll_edit.html',
                               r=slz)

    pre_logo = rc['content']['rlogo']

    for k in webroll_keys:
        rc['content'][k] = request.form[k]
    rc['bb'] = request.username

    if pre_logo and pre_logo != rc['content']['rlogo']:
        delete_resource(pre_logo)

    bb_cli.update_resource(rc)

    return render_template('webroll_create.html')
