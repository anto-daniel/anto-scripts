#!/bin/bash

hostfile=${1}
commands_list=${2}
user=apxxxx
pass=xxxxx
if [[ $hostfile == "" || $commands_list == "" ]]
then
    echo "Usage: ./run_cmd.sh <host list file> <commands list file>"
    exit 1
fi

while read host
do
        echo -ne "\n$host\n"
        while read -r cmd
        do
            sshpass -p $pass ssh -n -o StrictHostKeyChecking=no $host  "$cmd" 
        done < $commands_list
done < $hostfile
