#!/bin/bash 

if [[ $1 == "" || $2 == "" ]];then echo "Please enter 2 arguments";exit 1;fi

f1=$(echo $1)
f2=$(echo $2)
awk -F= '{print $1}' $f1 > s1  
awk -F= '{print $1}' $f2 > s2
sed -i -e '/^$/ d' s1  
sed -i -e '/^$/ d' s2
sed -i -e '/^#/ d' s1
#sed -i -e '/^#/ d' s2
sed -i -e "s///g" s1
for i in `cat s2`;do grep "^$i$" s1;done > com.txt
grep -v -f s2 s1 > com2.txt
for i in `cat com.txt`;do grep "^$i" $f2;done > comm.txt
for i in `cat com2.txt`;do egrep "^$i" $f1;done > com3.txt
echo -e "\n\n  #####  From file $f1 ##### \n\n" > com4.txt
cat com3.txt | egrep -v "^$|^\s+$" >> com4.txt
while read -r line
do
    name="$line"
    #echo "Name read from file - $name"
    ins_line=$(egrep -B1 "$line" $f1 | egrep "^#" | head -1)
    #echo $ins_line
    if [[ $ins_line != "" ]]; then echo "matching: $ins_line";sed -i -e "/$line/i $ins_line" com4.txt;fi
done < com4.txt
sed -i -e 's///g' com4.txt
sed -i -e "s/^#/\n&/g" com4.txt
cat $f2 com4.txt | sed 's///g' > final_result.properties
cat final_result.properties

rm -rf s1 s2 com.txt com2.txt comm.txt com3.txt com4.txt
