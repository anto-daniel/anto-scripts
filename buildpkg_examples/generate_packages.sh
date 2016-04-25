#!/bin/bash 

package=$1
apt-get clean && apt-get update 
apt-get install -y --force-yes --download-only ${package}
cd /var/cache/apt/archives && tar cvzf ${package}.tar.gz *.deb
cp ${package}.tar.gz ~/
apt-get clean
cd && ls ${package}.tar.gz && echo -ne "\n $package successfully downloaded and zipp'd the packages \n" 


#bash install_packages.sh ${package}.tar.gz
