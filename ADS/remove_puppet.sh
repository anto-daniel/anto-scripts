#!/bin/bash

pkgs=$(dpkg -l | grep puppetlabs1 | awk '{print $2}')

for pkg in $pkgs
do
    apt-get purge $pkg -y
done

dpkg --purge puppet-environment
rm -rfv /var/lib/puppet
