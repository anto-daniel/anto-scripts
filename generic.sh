#!/bin/bash

#echo -e "\nRemoving tmp files . . .\n" && rm -rf /tmp/*
#buildurl=$1  ####  Example build url:  http://spider/data/ftbuilds/Alcatraz/feature-demo-integration/1.0.0-9913-gae2b77a/
buildurl="http://spider/data/ftbuilds/Alcatraz/feature-demo-integration/1.0.0-9913-gae2b77a/"
if [ ! $(echo $buildurl | grep "/$") ]
then
    echo -ne "\nurl does not ends with /\n"
    buildurl=$(echo $buildurl | sed 's/$/\//') 
fi
buildnum=$(echo $buildurl |  awk -F'/' '{print $(NF-1)}')
echo "Build Number: $buildnum"
envname="jpmc"
#envname=$2
builddir="/tmp/$envname/build"
finalbuild="/tmp/$envname/$buildnum"


#if [[ $buildurl == "" || $envname == "" ]]
#then
#    echo "Usage: ./generic.sh <buildurl> <environment name>"
#    exit 1
#fi
mkdir -p $builddir $finalbuild

function validate_url() {
    if [[ `wget -S --spider $buildurl 2>&1 | grep 'HTTP/1.1 200 OK'` ]]
    then
        echo -ne "\nBuild URL:'$buildurl' is valid...\n"
    else
        echo -e "\nInvalid $buildurl. Exiting from the program....\n"
        exit 1
    fi
}

function extract_url() {
    echo -ne "\nExtracting Build URL in $builddir ...\n"
    wget -r --no-parent --no-directories --reject index.html* $buildurl -P $builddir/ > /dev/null 2>&1
    if [ $? -ne 0 ];then echo -e "\nDownloading Files from build url failed\n";exit 1;fi
}

function extract_karaf() {
    echo -ne "\nStarting Karaf APC\n"
    cd $builddir
    karaf_dir=$builddir/karaf_apc && mkdir -p $karaf_dir
    final_karaf=$finalbuild/karaf && mkdir -p $final_karaf
    karaf_file=$(ls -1 | egrep "karaf.*.tar.gz" | grep -v exporter | head -1)
    if [[ $(echo $karaf_file | egrep "tar.gz") ]]
    then
        echo -ne "\nFound karaf archive: $karaf_file\n"
    else
        echo -ne "\nkaraf is not archive file: $karaf_file\n"
        return 1
    fi
    sp_dir=$(tar tf $karaf_file | grep "\/server.properties" | sed -e 's/\/server\.properties//g' 2>&1)
    echo -ne "\nExtracting Properties files in $karaf_dir\n"
    tar xvzf $karaf_file -C ${karaf_dir} --wildcards "${sp_dir}/*.properties" > /dev/null 2>&1
    if [ $? -ne 0 ];then echo -ne "\n Error while archiving karaf \n";return 1;fi
    echo -ne "\nCopying Properties to builddir\n"
    cp -rf ${karaf_dir}/${sp_dir}/*.properties $final_karaf
    if [ $? -eq 0 ];then echo -ne "\nKaraf APC done\n";else echo -ne "\nError While copying\n";fi 
}

function extract_nfs() {
    echo -ne "\nStarting Karaf NFS\n"
    cd $builddir
    nfs_dir=$builddir/karaf_nfs && mkdir -p $nfs_dir
    final_nfs=$finalbuild/karaf_nfs && mkdir -p $final_nfs
    nfs_file=$(ls -1 | egrep "karaf.*.tar.gz" | grep exporter | head -1)
    if [[ $(echo $nfs_file | egrep "tar.gz$") ]]
    then
        echo -ne "\nFound the karaf NFS archive: $nfs_file\n"
    else
        echo -ne "\nkaraf nfs is not archive file: $nfs_file\n"
        return 1
    fi
    sp_dir=$(tar tf $nfs_file | grep "\/server.properties" | sed -e 's/\/server\.properties//g' 2>&1)
    echo -e "\nExtracting Properties files in $nfs_dir"
    tar xvzf $nfs_file -C ${nfs_dir} --wildcards "${sp_dir}/*.properties" > /dev/null 2>&1
    if [ $? -ne 0 ];then echo -e "\n Error while archiving karaf nfs \n";return 1;fi
    echo -e "\nCopying Properties to builddir\n"
    cp -rf ${nfs_dir}/${sp_dir}/*.properties $final_nfs
    if [ $? -eq 0 ];then echo -ne "\nKaraf NFS done\n";else echo -ne "\nKaraf NFS: Error While copying\n";fi 
}

function extract_hazelcast() {
    echo -ne "\nStarting Hazelcast\n"
    cd $builddir
    final_hz=$finalbuild/hazel && mkdir -p $final_hz && rm -rf $final_hz/*
    hazel_archive=$(ls -1 | egrep "alcatraz_cache.*.zip$" | head -1)
    unzip -j $hazel_archive "*.properties" -d $final_hz > /dev/null 2>&1
    if [ $? -eq 0 ];then echo -ne "\nHazel done\n";else echo -ne "\nHazel: Error While archiving\n";fi 
}

function extract_storm() {
    echo -ne "\nStarting Storm\n"
    cd $builddir
    final_stm=$finalbuild/storm && mkdir -p $final_stm && rm -rf $final_stm/*
    stm_archive=$(ls -1 | egrep "storm.*.zip$" | head -1)
    unzip -j $stm_archive "*.properties" -d $final_stm > /dev/null 2>&1
    if [ $? -eq 0 ];then echo -ne "\nStorm done\n";else echo -ne "\nStorm: Error While archiving\n";fi 
}




validate_url
#extract_url
extract_karaf
extract_nfs
extract_hazelcast
extract_storm

#rm -rf /tmp/*

