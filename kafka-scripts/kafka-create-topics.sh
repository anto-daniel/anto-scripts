#!/bin/bash


export KAFKA_HOME=/apps/kafka
export PATH=$PATH:$KAFKA_HOME/bin
zkhosts=192.168.0.5,192.168.0.6,192.168.0.7
zkport=2181
topics=(topic1 topic2 topic3)
zks=$(echo $zkhosts | sed "s/,/:$zkport,/g;s/$/:$zkport/g")

for topic in ${topics[@]}
do
    $KAFKA_HOME/bin/kafka-topics.sh --zookeeper $zkhost:$port --create --topic $topic --partitions 16 --replication-factor 3
done
