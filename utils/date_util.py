# -*- coding: utf-8 -*-
'''
Created on 2017-11-29

@author: wubo
'''

import datetime
import time


def is_same_day(seconds_1, seconds_2):
    """
    return: True if both Seconds are in same day, False otherwise
    """

    day_1 = str(datetime.datetime.fromtimestamp(seconds_1))
    day_2 = str(datetime.datetime.fromtimestamp(seconds_2))

    return day_1[:10] == day_2[:10]


def timestamp_to_strftime(timestamp):
    """
    :param timestamp: INT
    """
    time_tuple = time.localtime(timestamp)
    return time.strftime('%Y-%m-%d %H:%M:%S', time_tuple)


def strftime_to_timestamp(date_str):
    """
    :param string date_str: Like '2016-01-01 00:00:00'

    return timestamp
    """
    struct_ = time.strptime(date_str, '%Y-%m-%d %H:%M:%S')
    return int(time.mktime(struct_))


def make_display_time(timestamp):
    now_ts = time.time()
    date_1 = timestamp_to_strftime(timestamp)
    date_2 = timestamp_to_strftime(now_ts)
    if date_1[:10] == date_2[:10]:
        return date_1[11:]
    if date_1[:7] == date_2[:7]:
        return date_1[5:16]
    if date_1[:4] == date_2[:4]:
        return date_1[5:11]
    return date_1[:11]
