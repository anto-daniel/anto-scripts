#!/bin/bash

buildurl=$1
builddir="/tmp/builddir"

mkdir -p $builddir
function validate_url() {
    if [[ `wget -S --spider $buildurl 2>&1 | grep 'HTTP/1.1 200 OK'` ]]
    then
        echo -e "\nBuild URL:'$buildurl' is valid...\n"
    else
        echo -e "\nInvalid $buildurl. Exiting from the program....\n"
        exit 1
    fi
}

function extract_url() {
    wget -r --no-parent --no-directories --reject index.html* $buildurl -P $builddir/
}

function extract_karaf() {
    cd $builddir
    karaf_dir=$builddir/karaf_apc
    karaf_file=$(ls -1 | grep karaf | grep -v exporter)
    if [[ $(echo $karaf_file | egrep "tar.gz") ]]
    then
        #echo "Its karaf archive file"
        #echo $karaf_file
        echo "Finding the karaf apc path"
    else
        echo "karaf is not archive file"
        exit 1
    fi
    mkdir -p $karaf_dir 
    sp_path=$(tar tf $karaf_file | grep "\/server.properties" 2>&1)
    tar xvzf $karaf_file $sp_path -C $karaf_dir > /dev/null 2>&1
    mv etc $karaf_dir
    cd $karaf_dir
    cwd=$(find . -name "server.properties" 2>&1)
    ppwd="$(pwd)/$cwd"
    apc_path=$(echo "$ppwd" | sed 's/\.\///')
    echo -e "\nKARAF APC PATH => $apc_path \n"
}

function extract_nfs() {
    cd $builddir
    nfs_dir=$builddir/karaf_nfs
    karaf_file=$(ls -1 | grep karaf | grep exporter)
    if [[ $(echo $karaf_file | egrep "tar.gz") ]]
    then
        #echo "Its nfs archive file"
        #echo $karaf_file
        echo "Finding the karaf NFS path"
    else
        echo "karaf nfs is not archive file"
        exit 1
    fi
    mkdir -p $nfs_dir
    sp_path=$(tar tf $karaf_file | grep "\/server.properties" 2>&1)
    tar xvzf $karaf_file $sp_path -C $nfs_dir > /dev/null 2>&1
    mv etc $nfs_dir
    cd $nfs_dir
    cwd=$(find . -name "server.properties" 2>&1)
    ppwd="$(pwd)/$cwd"
    apc_path=$(echo "$ppwd" | sed 's/\.\///')
    echo -e "\nKARAF NFS PATH => $apc_path \n"
}

function extract_hazelcast() {
    cd $builddir
    hz_dir=$builddir/hazelcast
    hazel_archive=$(ls -1 | egrep "alcatraz_cache.*.zip")
    #echo "$hazel_archive"
    hz_archive_path=$(unzip -l $hazel_archive | grep server.properties | awk '{print $4}' 2>&1)
    mkdir -p $hz_dir 
    unzip -j $hazel_archive $hz_archive_path -d $hz_dir > /dev/null 2>&1
    if [[ $(ls $hz_dir/server.properties) ]]
    then
        echo -e "\n HAZELCAST BUILD Path => $(ls $hz_dir/server.properties)"
    else
        echo "hazelcast build path"
        find $hz_dir -name "server.properties"
    fi
        
}

function extract_storm() {
    cd $builddir
    stm_dir=$builddir/storm
    stm_archive=$(ls -1 | egrep "storm.*.zip")
    #echo "$stm_archive"
    stm_archive_path=$(unzip -l $stm_archive | grep server.properties | awk '{print $4}' 2>&1)
    mkdir -p $stm_dir 
    unzip -j $stm_archive $stm_archive_path -d $stm_dir > /dev/null 2>&1
    if [[ $(ls $stm_dir/server.properties) ]]
    then
        echo -e "\n STORM BUILD Path => $(ls $stm_dir/server.properties)"
    else
        echo "hazelcast build path"
        find $hz_dir -name "server.properties"
    fi
        
}




validate_url
extract_url
extract_karaf
extract_nfs
extract_hazelcast
extract_storm

#rm -rf /tmp/*

