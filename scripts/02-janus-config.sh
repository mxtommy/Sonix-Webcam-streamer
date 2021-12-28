#!/bin/bash

cp ../conf/janus.plugin.streaming.h264.jcfg /etc/janus/janus.plugin.streaming.jcfg
cp ../conf/janus.jcfg /etc/janus/janus.jcfg

service janus restart