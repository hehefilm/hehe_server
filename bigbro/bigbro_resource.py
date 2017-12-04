# -*- utf-8 -*-
'''
Created on 2017-12-4

@author: wubo
'''

import os

from settings import RUNDIR


def delete_resource(res_key):

    os.remove(os.path.join(RUNDIR, res_key[1:]))
        
