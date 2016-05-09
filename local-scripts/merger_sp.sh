#!/bin/bash 

f1=$(echo $1)
f2=$(echo $2)
awk -F= '{print $1}' $f1 > s1  
awk -F= '{print $1}' $f2 > s2
sed -i -e '/^$/ d' s1  
sed -i -e '/^$/ d' s2
sed -i -e '/^#/ d' s1
sed -i -e '/^#/ d' s2
sed -i -e "s///g" s1
for i in `cat s2`;do grep "$i$" s1;done > com.txt
grep -v -f s2 s1 > com2.txt
for i in `cat com.txt`;do grep "^$i" $f2;done > comm.txt
for i in `cat com2.txt`;do egrep "^$i" $f1;done > com3.txt
echo -e "\n\n  #####  From file $f1 ##### \n\n" > com4.txt
cat com3.txt | egrep -v "^$|^\s+$" >> com4.txt
cat $f2 com4.txt | sed 's///g' > final_result.properties
cat final_result.properties

