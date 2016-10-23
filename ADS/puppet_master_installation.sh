#!/bin/bash 

fqdn=$(hostname)
pconf=/etc/puppet/puppet.conf
buildurl=$1
ceph_path=$2
twn_path=$3
builddir=/etc/puppet/environments/production/modules/common_files/files/build
common_dir=/etc/puppet/environments/production/modules/common_files/files
log=/var/log/puppet.log

if [[ $buildurl == "" || $ceph_path == "" || $twn_path == "" ]]; then
    echo -e "Need 1st, 2nd and 3rd argument => buildurl [http://spider/ftpbuild/...]"
    exit 1  
fi

function download_install_puppet_repo() {
    echo "INFO: Installing wget and host command which is needed for the script"
    cmd=$(apt-get update && apt-get install wget bind9-host -y >>$log 2>error)
    if [ $? -ne 0 ] 
    then
        echo -e "ERROR: Issue with apt-get"
        cat error
        exit 1
    else
        echo "INFO: wget and host command installed."
    fi

    echo -e "INFO: Downloading puppet repo deb package.....\n"
    cmd1=$(wget --no-check-certificate https://apt.puppetlabs.com/puppetlabs-release-precise.deb >> $log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Download Puppetlabs Repo Failed..."
        cat error
        exit 1
    else
        echo -e "INFO: Download puppet repo deb package successfull\n"
    fi

    echo -e "INFO: Gonna Install Deb Package"
    cmd2=$(dpkg -i puppetlabs-release-precise.deb >> $log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Installing puppet repo failed..."
        cat error
        exit 1
    else
        echo -e "INFO: Repository Installed...\n"
    fi
}

function apt-update() {
    echo -e "INFO: Updating the apt repository..."
    cc=$(apt-get update >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: apt repo not updated"
        exit 1
    else
        echo -e "\nINFO: Puppet Apt repository updated...\n"
    fi
}


function install_puppet_master() {
    echo -e "INFO: Installing Puppet Master...."
    cmd3=$(apt-get install puppet-common=3.7.4-1puppetlabs1 puppetmaster-common=3.7.4-1puppetlabs1 puppetmaster=3.7.4-1puppetlabs1 -y >> $log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Installation Failed..."
        cat error
#        exit 1
    else
        echo -e "INFO: Puppet Master Installed\n"
    fi
}


function puppet_restart() {
    echo -e "INFO: Starting the Puppet Master Service\n"
    cmd4=$(service puppetmaster restart >> $log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Puppet Master Service not starting"
        cat error
        exit 1
    else
        echo -e "INFO: Puppet Master Started..."
    fi
}


function adding_host_entry() {
    echo -e "\nINFO: Adding Host Entry ..\n"
    dnscheck=$(host $fqdn)
    if [ $? -ne 0 ]
    then
      ip=$(ip r | tail -1 | awk '{print $NF}')
      sed -i "$ a $ip $fqdn" /etc/hosts
    else  
      ip=$(host $fqdn | awk '{print $NF}')
      sed -i "$ a $ip $fqdn" /etc/hosts
    fi
}


function puppet_conf_modification() {
    echo -e "\nINFO: Adding entries in puppet configuration..\n"
    cmd5=$(sed -i '7 a environmentpath=$confdir/environments' $pconf >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Adding Env entries failed"
        cat error
        exit 1
    else
        echo -e "INFO: Environment Path added"
    fi
    cmd6=$(sed -i "8 a dns_alt_names=$fqdn,$fqdn.actiance.local,$fqdn.localdomain" $pconf >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Adding DNS ALT NAMES entries failed"
        cat error
        exit 1
    else
        echo -e "INFO: DNS ALT NAMES entries added"
    fi
    cmd7=$(sed -i "9 a server=$fqdn.actiance.local" $pconf >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Adding puppet server entries failed"
        cat error
        exit 1
    else
        echo -e "INFO: Puppet server entry added"
    fi
    cmd8=$(sed -i "10 a autosign=true" $pconf >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Autosign not set to true, Error.."
        cat error
        exit 1
    else
        echo -e "INFO: Autosign true is set.."
    fi
}

function write_site_puppet_file() {
    sitefile=/etc/puppet/manifests/site.pp
    mkdir -v -p /etc/puppet/manifests/
    domain=$(facter | grep domain | awk -F'>' '{print $2}' | sed 's/^\ *//g')
    if [ -f /etc/puppet/manifests/site.pp ]
    then
        cp /dev/null $sitefile
    fi 
    echo "node '$fqdn.$domain' {" >> $sitefile
    echo "     class { '::mcollective':" >> $sitefile
    echo "            middleware       => true," >> $sitefile
    echo "            client           => true," >> $sitefile
    echo "            middleware_hosts => [ 'puppet.actiance.local' ]," >> $sitefile
    echo "          }" >> $sitefile
    echo "}" >> $sitefile
    echo -e "INFO: Puppet QA site.pp file prepared "
}

function install_mcollective_server_packages() {
    echo -e "INFO: Installing Mcollective Server Packages.."
    cmd10=$(apt-get install mcollective-package-client mcollective-puppet-client mcollective-service-client mcollective -y >>$log 2>error)
    if [ $? -ne 0 ]
    then
        echo -e "ERROR: Not able to install mcollective packages.."
        cat error
        exit 1
    else
        echo -e "INFO: Mcollective Server Packages are installed"
    fi
}

function extract_deployment_modules() { 
   dpkg -i puppet-environment_0.0.1.deb 2>error
   if [ $? -ne 0 ]; then
      echo -e "Puppet environment files not extracted. . . "
      cat error
   else
      echo -e "Puppet Modules files copied Successfully...."
   fi
} 

function validate_url() {
    echo -ne "\nValidating BuildURL: $buildurl\n"
    if [[ `wget -S --spider $buildurl 2>&1 | grep 'HTTP/1.1 200 OK'` ]]
    then
        echo -ne "url is valid..\n"
    else
	if [ -d $buildurl ]
	then
		echo "Its Local Build: $buildurl"
	else
		echo -e "Invalid $buildurl. Exiting from the program....\n"
		exit 1
	fi
    fi
}

function extract_url() {
	if [[ $(echo $buildurl | grep ^http) ]]
	then
		echo -ne "\nExtracting build in $builddir ...\n"
		if [ ! -d $builddir ]; then mkdir -v -p $builddir;fi
		wget -r --no-parent --no-directories --reject index.html* $buildurl -P $builddir/  2>&1
		if [ $? -ne 0 ];then echo -e "\nDownloading Files from build url failed\n";exit 1;fi
		echo -ne "Extraction Done.\n"
	else
		echo -ne "\n Moving to Local Build Dir \n"
        cp -rfv $buildurl/* $builddir/  2>&1
	fi

}

function extract_ceph() {
	cp -rfv $ceph_path/*  $common_dir/ceph_files >>$log 2>error
	if [ $? -ne 0 ];then echo -e "ERROR: Ceph copy error.";exit 1;fi
	echo -e "INFO: Ceph keys copied successfully."
}

function extract_twn() {
	cp -rfv $twn_path/*  $common_dir/townsend/keystore >>$log 2>error
	if [ $? -ne 0 ];then echo -e "ERROR: Townsend copy error.";exit 1;fi
	echo -e "INFO: Townsend keys copied successfully."
}

function puppet_run() {
    ln -s /etc/hiera.yaml /etc/puppet/hiera.yaml
	puppet apply /etc/puppet/manifests/site.pp >>$log 2>error
	if [ $? -ne 0 ];then echo -e "ERROR: Mcollective Packages not installed.";exit 1;fi
	echo -e "INFO: MCollective Packages are successfully installed..."

}
function install_mcollective_server_packages() {
    apt-get install mcollective-package-client mcollective-puppet-client mcollective-service-client -y >> $log 2>error
    if [ $? -ne 0 ];then echo -e "ERROR: Unable to install Mcollective server packages";exit 1;fi
    echo -e "INFI: MCollective Server Packages are installed..."

}
download_install_puppet_repo
apt-update
install_puppet_master
adding_host_entry
puppet_conf_modification
extract_deployment_modules
write_site_puppet_file
puppet_restart
validate_url
extract_url
extract_ceph
extract_twn
puppet_run
install_mcollective_server_packages
