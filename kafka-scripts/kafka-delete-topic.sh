#!/bin/bash

zk_bin=/apps/zookeeper/bin
if [ $# -ne 1 ]; then echo topic name in 1st arg;exit 1;fi
topic=$1

echo "rmr /brokers/topics/$topic" | $zk_bin/zkCli.sh
if [ $? -ne 0 ]; then echo unable to delete topic;exit 1;fi
echo "Succesfully deleted the topic $topic"
