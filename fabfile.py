#!/usr/bin/env python

from fabric.api import local
from fabric.api import run, sudo
from fabric.api import env, put

#env.hosts = ['192.168.112.16', '192.168.120.44']
env.user = "apcuser"
env.password = "facetime"

def hello(who="world"):
    print "Hello {who}!".format(who=who)

def prepare_deploy():
    #local("./manage.py test my_app")
    local("git add --all && git commit -m 'fab deployed'")
    local("git push")

def test():
    run('ls')


def install_disk_prepare(user=env.user):
    sudo('apt-get install python-dev python-pip libffi-dev -y')
    sudo('pip install paramiko cryptography==1.2.1')
    run('mkdir -p $HOME/DiskPrepare/')
    put('DiskPrepare.py','/home/'+env.user+'/DiskPrepare')
    put('PartitionandMount.py','/home/'+env.user+'/DiskPrepare')
    run('cd DiskPrepare && python DiskPrepare.py')
    run('cd DiskPrepare && python PartitionandMount.py')
