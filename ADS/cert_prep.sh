#!/bin/bash


user=$1
hostconfig=$2
ssh_args="-o StrictHostKeyChecking=no -o CheckHostIP=no -o ConnectTimeout=5"
#cmd="echo $passwd | sudo -S puppet agent -t --environment=QA --debug"
cmd="hostname"

if test -z $1 || test -z $2  
then
    echo "ERROR: Argument is missing"
    echo -e "Usage: ./cert_prep.sh <user> <hostconfig>"
    exit 1
fi

echo -e "Enter the password for $user:"
read -s passwd

function file_validate() {
    
    if [ ! -f $hostconfig ]
    then
        echo "ERROR: 2nd Argument is not a config file name"
        exit 1
    fi
}

function check_sshpass() {
    cmd_chk=$(dpkg -l | grep sshpass)
    if [ $? -ne 0 ]; then
        apt-get update && apt-get install sshpass -y &>>$log
    fi
}

ping_check() {
    host=$1
    if [[ $(ping -c 1 $host) ]]
    then
        echo "$host reachable"
    else
        echo "$host not reachable"
    fi
}

mdb_hosts=$(grep mdbdata $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g') 
mdbconf_hosts=$(grep mdbconf $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g') 
ess_hosts=$(grep essdata $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g') 
essr_hosts=$(grep essreports $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g') 
haz_hosts=$(grep hazelcast $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g')
karaf_hosts=$(grep karaf $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g')
stm_hosts=$(grep storm $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g')
nfs_hosts=$(grep karaf_nfs $hostconfig | awk -F= '{print $2}' | sed 's/,/\ /g')
pfile=/etc/puppet/puppet.conf
log=/var/log/puppet_script.log


function agent_install() {
    hosts="$1"
    #pconf_cmd="echo $passwd | sudo -S sed -i '/^server/ s/=.*/=puppet.actiance.local/' $pfile"
    for host in $hosts
    do
        if ! ping -c 1 $host &>/dev/null;then echo -e "INFO: $host:PING:FAILURE";continue;fi
        echo -e "INFO: $host:PING:SUCCESS"
        echo -e "INFO: Gonna deploy mcollective in agent node $host"
        #echo -e "sshpass -p $passwd ssh $ssh_args -l $user $host \"$cmd\""
        #sshpass -p $passwd ssh $ssh_args -l $user $host "$pconf_cmd" &>>$log
        sshpass -p $passwd ssh $ssh_args -l $user $host "$cmd" &>>$log
        if [ $? -ne 0 ];then 
            echo -e "ERROR: Puppet run not successfull. Caught with errors\n"
        else
            echo -e "INFO: Puppet run on mcollective is successfull\n"
        fi
    done

}

file_validate
check_sshpass
agent_install "$mdb_hosts $mdbconf_hosts $ess_hosts $essr_host $haz_hosts $karaf_hosts $stm_hosts $nfs_hosts"
echo -e "\nList of hosts which has successfull handshake with puppet master\n"
puppet cert list --all | awk '{print $2}'
