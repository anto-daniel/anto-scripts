#!/bin/bash

if [[ $1 == "" ]]; then
  echo "Need 1st argument..."
  exit 0
fi

#### input the pipeline name ####
pname=$1
credhub login

echo "postgres_username=$(credhub get -n /concourse/enterprise-archive/$pname/postgres_username -q)" > load_vars.sh
echo "postgres_password='$(credhub get -n /concourse/enterprise-archive/$pname/postgres_password -q)'" >> load_vars.sh
echo "postgres_hostname=$(credhub get -n /concourse/enterprise-archive/$pname/postgres_hostname -q)" >> load_vars.sh
echo "postgres_db=$(credhub get -n /concourse/enterprise-archive/$pname/postgres_db -q)" >> load_vars.sh
echo "postgres_url='$(credhub get -n /concourse/enterprise-archive/$pname/postgres_url -q)'" >> load_vars.sh
