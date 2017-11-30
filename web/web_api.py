# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

from flask import Blueprint, render_template

web_api = Blueprint('web_api', __name__, template_folder='templates')


@web_api.route('/', methods=['GET'])
def index():

    return render_template('index.html')
