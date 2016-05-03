#!/bin/bash 

f1=$(echo $1)
f2=$(echo $2)
awk -F= '{print $1}' $f1 > s1 ### taking LHS of file1
awk -F= '{print $1}' $f2 > s2 ### taking LHS of file2
sed -i -e '/^$/ d' s1 ### removing empty lines in file1
sed -i -e '/^$/ d' s2 ### removing empty lines in file2
sed -i -e '/^#/ d' s1 ### Removing commented lines in file1
sed -i -e '/^#/ d' s2  ### Removing commented lines in file2
sed -i -e "s/^M//g" s1 ### Removinf control characters in file1
for i in `cat s2`;do grep "^$i$" s1;done > com.txt
grep -v -f s2 s1 > com2.txt
for i in `cat com.txt`;do grep "^$i" $f2;done > comm.txt
for i in `cat com2.txt`;do egrep "^$i" $f1;done > com3.txt
cat com3.txt | egrep -v "^$|^\s+$" > com4.txt
cat $f2 com4.txt | sed 's///g'> final_result.txt
cat final_result.txt

