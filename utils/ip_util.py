# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from settings import SLB_USE


def get_client_ip(request):

    if SLB_USE:
        addr_str = request.headers.get('X-Forwarded-For')
        if addr_str:
            return addr_str.split(',')[0]

    return request.remote_addr
