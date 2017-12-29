# -*- utf-8 -*-
'''
Created on 2017-12-4

@author: wubo
'''

import os

from settings import RUNDIR

banner_keys = ['type', 'bcover', 'btitle', 'bkey', 'bdesc']
news_keys = ['ntitle', 'ndate', 'nsubtitle', 'ndetail', 'ncover']
movie_keys = ['title', 'director', 'stars', 'writer', 'genre', 'duration',
              'posters', 'description', 'videos', 'clips', 'release_date',
              'type', 'store', 'lang', 'country', 'mknown', 'release_vision',
              'mcover', 'producer', 'pmajor']
project_keys = ['ptitle', 'pdate', 'psubtitle', 'pdetail', 'pcover']
about_keys = ['adetail']
webroll_keys = ['rlogo', 'rlink']


def delete_resource(res_key):

    if res_key:
        os.remove(os.path.join(RUNDIR, res_key[1:]))
