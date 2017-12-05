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
        cnt = {'type': request.form['type'],
               'bcover': request.form['bcover'],
               'btitle': request.form['btitle'],
               'bkey': request.form['bkey'],
               'bdesc': request.form['bdesc']}

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
        slz = {}
        bc = bb_cli.get_resource(res_type=rtp, res_id=b_id)
        if not bc:
            continue

        slz['res_id'] = bc['res_id']
        slz['type'] = bc['content']['type']
        slz['bcover'] = bc['content']['bcover']
        slz['btitle'] = bc['content']['btitle']
        slz['bkey'] = bc['content']['bkey']
        slz['bdesc'] = bc['content']['bdesc']
        slz['bb'] = bc['bb']
        slz['created'] = timestamp_to_strftime(bc['created'])
        slz['online'] = bc['online']

        rst.append(slz)

    return render_template('hh_banners.html',
                           banners=rst,
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

    if act in ['on', 'off']:
        bc = bb_cli.get_resource(res_type=rtp, res_id=bid)
        if not bc:
            return 'thx_for_request'

        bc['online'] = act
        bb_cli.update_resource(bc)

    if act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=bid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=bid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=bid,
                            update_bb=request.username)

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
        slz['bkey'] = bc['content']['bkey']
        slz['btitle'] = bc['content']['btitle']
        slz['bcover'] = bc['content']['bcover']
        slz['bdesc'] = bc['content']['bdesc']

        return render_template('banner_edit.html',
                               b=slz)

    pre_cover = bc['content']['bcover']

    bc['content']['btitle'] = request.form['btitle']
    bc['content']['bkey'] = request.form['bkey']
    bc['content']['bcover'] = request.form['bcover']
    bc['content']['bdesc'] = request.form['bdesc']
    bc['content']['type'] = request.form['type']
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
        cnt = {'ntitle': request.form['ntitle'],
               'ndate': request.form['ndate'],
               'nsubtitle': request.form['nsubtitle'],
               'ndetail': request.form['ndetail'],
               'ncover': request.form['ncover']}

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
        slz['ndate'] = nc['content']['ndate']
        slz['ntitle'] = nc['content']['ntitle']
        slz['nsubtitle'] = nc['content']['nsubtitle']
        slz['bb'] = nc['bb']
        slz['created'] = timestamp_to_strftime(nc['created'])
        slz['online'] = nc['online']
        slz['ndetail'] = nc['content']['ndetail']
        slz['ncover'] = nc['content']['ncover']

        rst.append(slz)

    return render_template('hh_news.html',
                           news=rst,
                           news_total=news_total,
                           total_pg=total_pg,
                           pg=pg)


@bigbro_api.route('/hehebb/news_unit', methods=['POST'])
@login_required
def news_unit():

    act = request.form.get('act')
    nid = request.form.get('nid')
    rtp = 'news'

    if not (act and nid):
        return 'thx_for_request_0'

    bb_cli = BigbroCache()

    if act in ['on', 'off']:
        nc = bb_cli.get_resource(res_type=rtp, res_id=nid)
        if not nc:
            return 'thx_for_request'

        nc['online'] = act
        bb_cli.update_resource(nc)

    if act == 'fst':
        bb_cli.top_resource(res_type=rtp, res_id=nid)
    elif act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=nid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=nid,
                            update_bb=request.username)

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
        slz['ndate'] = nc['content']['ndate']
        slz['ntitle'] = nc['content']['ntitle']
        slz['nsubtitle'] = nc['content']['nsubtitle']
        slz['ndetail'] = nc['content']['ndetail']
        slz['ncover'] = nc['content']['ncover']

        return render_template('news_edit.html',
                               news=slz)

    pre_cover = nc['content']['ncover']

    cnt = {'ntitle': request.form['ntitle'],
           'ndate': request.form['ndate'],
           'nsubtitle': request.form['nsubtitle'],
           'ndetail': request.form['ndetail'],
           'ncover': request.form['ncover']}

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

    rst = []
    for k in request.form:
        slz = {k: request.form[k]}
        rst.append(slz)
    return json.dumps(rst)

    if request.method == 'POST':
        cnt = {'title': request.form['title'],
               'director': request.form['director'],
               'stars': request.form['stars'],
               'actors': request.form.get('actors', ''),
               'writer': request.form['writer'],
               'genre': request.form['genre'],
               'duration': request.form['duration'],
               'poster': request.form['poster'],
               'description': request.form['description'],
               'videos': request.form['videos'],
               'clips': request.form.getlist('clips'),
               'release_date': request.form['release_date'],
               'type': request.form['type']}

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

    v_ids = bb_cli.get_resource_list(res_type=rtp,
                                     start=start_,
                                     end=end_)

    rst = []
    for v_id in v_ids:
        slz = {}
        vc = bb_cli.get_resource(res_type=rtp, res_id=v_id)
        if not vc:
            continue

        rst.append(slz)

    return render_template('hh_movies.html',
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

    if act in ['on', 'off']:
        vc = bb_cli.get_resource(res_type=rtp, res_id=mid)
        if not vc:
            return 'thx_for_request'

        vc['online'] = act
        bb_cli.update_resource(vc)

        return 'ok'

    if act == 'del':
        bb_cli.rem_resource_id(res_type=rtp, res_id=mid)
        Resources.bb_delete(res_tp=rtp,
                            res_id=mid,
                            update_bb=request.username)

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
        slz['type'] = mc['content']['type']
        slz['title'] = mc['content']['title']
        slz['director'] = mc['content']['director']
        slz['writer'] = mc['content']['writer']
        slz['stars'] = mc['content']['stars']
        slz['genre'] = mc['content']['genre']
        slz['poster'] = mc['content']['poster']
        slz['clips'] = mc['content']['clips']
        slz['release_date'] = mc['content']['release_date']
        slz['duration'] = mc['content']['duration']
        slz['videos'] = mc['content']['videos']
        slz['description'] = mc['content']['description']

        return render_template('movie_edit.html',
                               news=slz)

    pre_poster = mc['content']['poster']

    cnt = {'title': request.form['title'],
           'director': request.form['director'],
           'stars': request.form['stars'],
           'actors': request.form.get('actors', ''),
           'writer': request.form['writer'],
           'genre': request.form['genre'],
           'duration': request.form['duration'],
           'poster': request.form['poster'],
           'description': request.form['description'],
           'videos': request.form['videos'],
           'clips': request.form.getlist('clips[]'),
           'release_date': request.form['release_date'],
           'type': request.form['type']}

    mc['content'] = cnt
    mc['bb'] = request.username
    bb_cli.update_resource(mc)

    if pre_poster and pre_poster != mc['content']['poster']:
        delete_resource(pre_poster)

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

    if tp == 'banner-cover-pic':

        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/banner',
                              t.strftime('%Y%m%d'))
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

    if tp == 'movie-cover-pic':

        f_path = os.path.join(RUNDIR,
                              'static/uploads/covers/movie',
                              t.strftime('%Y%m%d'))
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

    if tp == 'movie-clip-pic':

        f_path = os.path.join(RUNDIR,
                              'static/uploads/clips',
                              t.strftime('%Y%m%d'))
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

    return json.dumps({'state': 'ERROR', 'msg': 'thx'})


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
