#!/bin/bash
# Maintainer: Anto Daniel
#

buildurl=$1  ####  Example build url:  http://spider/data/ftbuilds/Alcatraz/feature-demo-integration/1.0.0-9913-gae2b77a/
if [ ! $(echo $buildurl | grep "/$") ]
then
    buildurl=$(echo $buildurl | sed 's/$/\//') ###    echo -ne "\nurl does not ends with /\n"
fi
buildnum=$(echo $buildurl |  awk -F'/' '{print $(NF-1)}')
envname=$2
builddir="/tmp/$envname/build"
finalbuild="/tmp/$envname/$buildnum"

echo -ne "\nBuild Number: $buildnum"
mkdir -p $builddir $finalbuild

if [[ $buildurl == "" || $envname == "" ]]
then
    echo "Usage: ./generic.sh <buildurl> <environment name>"
    exit 1
fi

function validate_url() {
    echo -ne "\nValidating BuildURL: $buildurl\n"
    if [[ `wget -S --spider $buildurl 2>&1 | grep 'HTTP/1.1 200 OK'` ]]
    then
        echo -ne "url is valid..\n"
    else
        echo -e "Invalid $buildurl. Exiting from the program....\n"
        exit 1
    fi
}

function extract_url() {
    echo -ne "\nExtracting build in $builddir ...\n"
    wget -r --no-parent --no-directories --reject index.html* $buildurl -P $builddir/ > /dev/null 2>&1
    if [ $? -ne 0 ]
	then
		echo -e "\nDownloading Files from build url failed\n"
		exit 1
	fi
    echo -ne "Extraction Done.\n"
}

function extract_karaf() {
    echo -ne "\n\nStarting Karaf APC\n"
    cd $builddir
    karaf_dir=$builddir/karaf_apc && mkdir -p $karaf_dir
    final_karaf=$finalbuild/build/karaf && mkdir -p $final_karaf
    karaf_file=$(ls -1 | egrep "karaf.*.tar.gz" | grep -v exporter | head -1)
    if [[ $(echo $karaf_file | egrep "tar.gz") ]]
    then
        echo -ne "Found karaf archive: $karaf_file\n"
    else
        echo -ne "karaf is not archive file: $karaf_file\n"
        return 1
    fi
    sp_dir=$(tar tf $karaf_file | grep "\/server.properties" | sed -e 's/\/server\.properties//g' 2>&1)
    echo -ne "Extracting Properties files in $karaf_dir\n"
    tar xvzf $karaf_file -C ${karaf_dir} --wildcards "${sp_dir}/*.properties" > /dev/null 2>&1
    if [ $? -ne 0 ]
	then
		echo -ne "Error while archiving karaf \n"
		return 1
	fi
    echo -ne "Copying Properties to $final_karaf\n"
    cp -rf ${karaf_dir}/${sp_dir}/*.properties $final_karaf
    if [ $? -eq 0 ]
	then
		echo -ne "Karaf APC done\n"
	else
		echo -ne "Karaf: Error While copying\n"
	fi 
}

function extract_nfs() {
    echo -ne "\nStarting Karaf NFS\n"
    cd $builddir
    nfs_dir=$builddir/karaf_nfs && mkdir -p $nfs_dir
    final_nfs=$finalbuild/build/karaf_nfs && mkdir -p $final_nfs
    nfs_file=$(ls -1 | egrep "karaf.*.tar.gz" | grep exporter | head -1)
    if [[ $(echo $nfs_file | egrep "tar.gz$") ]]
    then
        echo -ne "Found the karaf NFS archive: $nfs_file\n"
    else
        echo -ne "karaf nfs is not archive file: $nfs_file\n"
        return 1
    fi
    sp_dir=$(tar tf $nfs_file | grep "\/server.properties" | sed -e 's/\/server\.properties//g' 2>&1)
    echo -ne "Extracting Properties files in $nfs_dir\n"
    tar xvzf $nfs_file -C ${nfs_dir} --wildcards "${sp_dir}/*.properties" > /dev/null 2>&1
    if [ $? -ne 0 ]
	then
		echo -e "Error while archiving karaf nfs \n"
		return 1
	fi
	echo -ne "Copying Properties to $final_nfs\n"
    cp -rf ${nfs_dir}/${sp_dir}/*.properties $final_nfs
    if [ $? -eq 0 ]
	then 
		echo -ne "Karaf NFS done\n"
	else
		echo -ne "Karaf NFS: Error While copying\n"
	fi 
}

function extract_hazelcast() {
    echo -ne "\nStarting Hazelcast\n"
    cd $builddir
    final_hz=$finalbuild/build/hazel && mkdir -p $final_hz && rm -rf $final_hz/*
    hazel_archive=$(ls -1 | egrep "alcatraz_cache.*.zip$" | head -1)
    unzip -j $hazel_archive "*.properties" -d $final_hz > /dev/null 2>&1
    if [ $? -eq 0 ]
	then
		echo -ne "Hazel done\n"
	else 
		echo -ne "Hazel: Error While archiving\n"
	fi 
}

function extract_storm() {
    echo -ne "\nStarting Storm\n"
    cd $builddir
    final_stm=$finalbuild/build/storm && mkdir -p $final_stm && rm -rf $final_stm/*
    stm_archive=$(ls -1 | egrep "storm.*.zip$" | head -1)
    unzip -j $stm_archive "*.properties" -d $final_stm > /dev/null 2>&1
    if [ $? -eq 0 ]
	then
		echo -ne "Storm done\n"
	else 
		echo -ne "Storm: Error While archiving\n"
	fi 
}

function copy_karaf_production() {
    karaf_build_dir="${finalbuild}/production/karaf" && mkdir -p ${karaf_build_dir}
    karaf_prod_dir="/etc/puppet/environments/production/modules/karaf_birthing/templates"
    cd $karaf_prod_dir && cp -rf *.properties.erb $karaf_build_dir
    if [ $? -ne 0 ];then echo -ne "\n Property erb files missing in $karaf_prod_dir\n";return 1;fi
    then 
        echo -ne "\n Property erb files missing in $karaf_prod_dir\n"
        return 1
    fi
    cd $karaf_build_dir
    for file in $(ls -1 | egrep  ".*.properties.erb$")
    do
        mv $file $(basename $file .erb)
    done
    echo -ne "\nKaraf APC: Copied Prod Properties files to $karaf_build_dir\n"
}

function copy_nfs_production() {
    nfs_build_dir="${finalbuild}/production/karaf_nfs" && mkdir -p ${nfs_build_dir}
    nfs_prod_dir="/etc/puppet/environments/production/modules/karaf_nfs_birthing/templates"
    cd $nfs_prod_dir && cp -rf *.properties.erb $nfs_build_dir
    cd $nfs_build_dir
    for file in $(ls -1 | egrep  ".*.properties.erb$")
    do
        mv $file $(basename $file .erb)
    done
    echo -ne "\nKaraf NFS: Copied Prod Properties files to $nfs_build_dir\n"
}

function copy_hz_production() {
    hz_build_dir="${finalbuild}/production/hazel" && mkdir -p ${hz_build_dir}
    hz_prod_dir="/etc/puppet/environments/production/modules/hazelcast_birthing/templates"
    cd $hz_prod_dir && cp -rf *.properties.erb $hz_build_dir
    if [ $? -ne 0 ];then echo -ne "\nProperty erb files missing in $hz_prod_dir";return 1;fi
    then 
        echo -ne "\nProperty erb files missing in $hz_prod_dir"
        return 1
    fi
    cd $hz_build_dir
    for file in $(ls -1 | egrep  ".*.properties.erb$")
    do
        mv $file $(basename $file .erb)
    done
    echo -ne "\nHazelcast: Copied Prod Properties files to $hz_build_dir\n"
}

function copy_stm_production() {
    stm_build_dir="${finalbuild}/production/storm" && mkdir -p ${stm_build_dir}
    stm_prod_dir="/etc/puppet/environments/production/modules/storm_birthing/templates"
    cd $stm_prod_dir && cp -rf *.properties.erb $stm_build_dir
    if [ $? -ne 0 ];then echo -ne "\n Property erb files missing in $stm_prod_dir\n";return 1;fi
    then 
        echo -ne "\n Property erb files missing in $stm_prod_dir\n"
        return 1
    fi
    cd $stm_build_dir
    for file in $(ls -1 | egrep  ".*.properties.erb$")
    do
        mv $file $(basename $file .erb)
    done
    echo -ne "\nStorm: Copied Prod Properties files to $stm_build_dir\n"
}


validate_url
extract_url
extract_karaf
extract_nfs
extract_hazelcast
extract_storm

copy_karaf_production
copy_nfs_production
copy_hz_production
copy_stm_production


echo -ne "\nRemoving tmp build files\n" && rm -rf $builddir/*
echo -ne "\nCreating Merged directories in $finalbuild\n"
mkdir -p $finalbuild/merged/{hazel,karaf,karaf_nfs,storm}
tree $finalbuild
