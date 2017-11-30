# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import random
import string


def random_string(size):
    """
    :param size: String length

    return a string which length is size
    """

    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits

    return ''.join(random.choice(chars) for _ in range(size))


def random_int(start, end):
    return random.randint(start, end)
