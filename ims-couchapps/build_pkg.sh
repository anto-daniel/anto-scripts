#!/bin/bash 

source build_func.sh 


check_version
set_variables
set_env

ENV=$1

for dir in *
do
  if [[ ! -d $dir ]]; then
    continue;
  else
    if [[ ! -f $dir/kanso.json || ! -f $dir/package.json ]]; then
      echo "Either kanso.json or package.json in MISSING in $dir"
    else
      copy_project_files_to_builddir
      npm_kanso_install
    fi
  fi
done

build_config
cd $BUILDROOT
build-package
