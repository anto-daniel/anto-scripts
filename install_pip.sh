#!/bin/bash 

curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
st=$(echo $?)
if [[ $st -ne 0 ]]
then
	echo "Download Failed"
	exit 1
else
	python get-pip.py
fi
