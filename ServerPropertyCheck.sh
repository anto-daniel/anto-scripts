#!/bin/bash 

hosts=$1
user=sysops
pass=alcatraz1400

if [[ $hosts == "" ]]
then
   echo "Usage: Please enter host file in first arg"
   exit 1
fi
if [[ ! -f $hosts ]]
then
   echo "Give file like hosts.txt in first arg"
   exit 1
fi

   echo -e "\nChecking all hosts are reachable from hosts file\n"
for i in `cat $hosts`
do
   fping $i
done

karaf_hosts=`grep karaf $hosts` 
nfs_hosts=`grep nfs $hosts`
stm_hosts=`grep stm $hosts`
haz_hosts=`grep haz $hosts`

for i in $karaf_hosts
do 
   echo -e "\n Checking hosts reachablility from $i which is mentioned in server.properties \n"
   sshpass -p $pass ssh -o StrictHostKeyChecking=no -o ConnectTimeout=4 $user@$i "egrep \"server.primary.es.host.ip|server.primary.object.store.host.url|alcatraz.hazelcast.hosts|export.monitor.zkservers|server.metrics.es.host.ip|app.dashboard.url.report.user|app.dashboard.url.supervision.user\" /home/$user/apps/karaf/etc/actiance/apc-system/apc-config/server.properties | egrep -v \"^#\" | awk -F'=' '{print \$2}'  " > kh.txt
   fping `cat kh.txt | sed 's/,/\n/g' | egrep -o "fab-[a-z0-9].*h[12]"`
done

for i in $nfs_hosts
do 
   echo -e "\n Checking hosts reachablility from $i which is mentioned in server.properties \n"
   sshpass -p $pass ssh -o StrictHostKeyChecking=no -o ConnectTimeout=4 $user@$i "egrep \"server.primary.object.store.host.url|alcatraz.hazelcast.hosts|export.monitor.zkservers\" /home/$user/apps/karaf_NFS/etc/actiance/apc-system/apc-config/server.properties | egrep -v \"^#\" | awk -F'=' '{print \$2}' " > nh.txt
   fping `cat nh.txt | sed 's/,/\n/g' | egrep -o "fab-[a-z0-9].*h[12]"`
done


for i in $haz_hosts
do 
   echo -e "\n Checking hosts reachablility from $i which is mentioned in server.properties \n"
   sshpass -p $pass ssh -o StrictHostKeyChecking=no -o ConnectTimeout=4 $user@$i " egrep \"alcatraz.hazelcast.hosts|server.primary.es.host.ip\" /home/$user/apps/alcatraz_cache-1.0/conf/server.properties | egrep -v \"^#\" | awk -F'=' '{print \$2}'"  > zh.txt
   fping `cat zh.txt | sed 's/,/\n/g' | egrep -o "fab-[a-z0-9].*h[12]"`
done




for i in $stm_hosts
do 

   echo -e "\n Checking hosts reachablility from $i which is mentioned in server.properties \n"
   sshpass -p $pass ssh -o StrictHostKeyChecking=no -o ConnectTimeout=4 $user@$i " egrep \"server.primary.es.host.ip|server.primary.object.store.host.url|alcatraz.hazelcast.hosts|brokers=|zservers=|server.metrics.es.host.ip\" /home/$user/apps/storm-0.9.0.1/bin/server.properties | egrep -v \"^#\" | awk -F'=' '{print \$2}'"  > hh.txt
   fping `cat hh.txt | sed 's/,/\n/g' | egrep -o "fab-[a-z0-9].*h[12]"`
done




rm -rf kh.txt hh.txt nh.txt zh.txt

