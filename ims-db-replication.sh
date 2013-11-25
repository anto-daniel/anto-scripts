#!/bin/bash

###  Variables ###

  host1=$1
  host2=$2
  db=$3
  dbuser=imsadmin
  dbpass=imsadmin
  port=5984
### Function to check argument is not missing ###

function argument_check {
  echo -e "Please enter all arguments .\n
           1st argument: hostname1.\n
           2nd argument: hostname 2.\n
           3rd argument: db name"

}

function replicate {
  curl -H 'Content-Type: application/json' -X POST http://$dbuser:$dbpass@$host1:$port/_replicate -d "{\"source\": \"$db\", \"target\": \"http://$dbuser:$dbpass@$host2:$port/$db\", \"continuous\":true}"
  curl -H 'Content-Type: application/json' -X POST http://$dbuser:$dbpass@$host1:$port/_replicate -d "{\"source\": \"http://$dbuser:$dbpass@$host2:$port/$db\", \"target\": \"$db\", \"continuous\":true}"
  curl -H 'Content-Type: application/json' -X POST http://$dbuser:$dbpass@$host2:$port/_replicate -d "{\"source\": \"$db\", \"target\": \"http://$dbuser:$dbpass@$host1:$port/$db\", \"continuous\":true}"
  curl -H 'Content-Type: application/json' -X POST http://$dbuser:$dbpass@$host2:$port/_replicate -d "{\"source\": \"http://$dbuser:$dbpass@$host1:$port/$db\", \"target\": \"$db\", \"continuous\":true}"

}


function check_db_exists {
  cmd1=$(curl -s -X GET http://$dbuser:$dbpass@$host1:$port/$db)
  cmd2=$(curl -s -X GET http://$dbuser:$dbpass@$host2:$port/$db)
  if [[ $cmd2==*"no_db_file"* ]]; then
    echo "$db does not exists in $host2:"
    echo "creating $db in $host2:"
    curl -s -X PUT http://$dbuser:$dbpass@$host2:$port/$db
    #exit 1;
    replicate
  elif [[ $cmd2==*"db_not_found"* ]]; then 
    echo "no $db in $host2:"
    echo "creating $db in $host2:"
    curl -s -X PUT http://$dbuser:$dbpass@$host2:$port/$db
    #exit 1;
    replicate
  else
    #echo "db exists on both machines"
    replicate
  fi
}

if [[ $1 == '' || $2 == '' || $3 == '' ]];then
  argument_check
  exit 1
else
  check_db_exists
  replicate
fi
