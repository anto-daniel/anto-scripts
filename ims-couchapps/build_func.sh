#!/bin/bash 
export PATH=$PATH:/opt/xxxx/bin
function check_version {
  if [ ! -f VERSION ]; then
    echo Need VERSION file
    exit 1;
  else
    VERSION=$(cat VERSION)
  fi
}

function set_variables {
  PKGNAME="ims-couchapps"
  #ENV=$1
  BUILDROOT=buildroot
  BUILDDIR=$BUILDROOT/opt/xxxx/$PKGNAME
  POSTINSTDIR=/opt/xxxx/$PKGNAME
  check_version
  KANSODIR="./node_modules/kanso"
  DB="ims"
}

function set_env {
  mkdir -p $BUILDROOT/etc/profile.d
  cat > $BUILDROOT/etc/profile.d/ims_path.sh <<EOM
  export PATH=\$PATH:/opt/xxxx/bin
EOM
    }


function copy_project_files_to_builddir {
  mkdir -p $BUILDDIR
  rsync -az $dir $BUILDDIR

}

function npm_kanso_install {
  OLDDIR=`pwd`
  cd $BUILDDIR/$dir
  rm -rf packages/ node_modules/
  /opt/xxxx/bin/npm install
  $KANSODIR/bin/kanso install
  cd $OLDDIR
}

function build_config {

cat > $BUILDROOT/config.yaml <<EOM
package: ims-couchapps
version: $VERSION
arch: amd64
description: IMS CouchApps
depends: ims-nodejs
url: http://ims.corp.xxxx.com/
maintainer: Anto Daniel <anto.daniel@xxxx.com>
postinst: |
  #!/bin/bash
  source /etc/profile.d/ims_path.sh
  APPDIR=/opt/xxxx/ims-couchapps
  cd \$APPDIR
  for dir in *
  do
    if [[ ! -d \$dir ]]; then
      #echo "\$dir: NOT A KANSO APP DIRECTORY"
      continue;
    else
      if [[ ! -f \$dir/kanso.json || ! -f \$dir/package.json ]]; then
        echo "Either kanso.json or package.json is missing in \$dir"
      else
        cd \$dir
        CONFIGFILE=\$APPDIR/\$dir/conf/$ENV/config.yaml
        if [ ! -f \$CONFIGFILE ]; then
          echo config file not found
        else
          HOST=\$(cat \$CONFIGFILE | grep 'host' | cut -f2 -d: | sed 's/\ //')
          PORT=\$(cat \$CONFIGFILE | grep 'port' | cut -f2 -d: | sed 's/\ //')
          DBUSER=\$(cat \$CONFIGFILE | grep 'dbuser' | cut -f2 -d: | sed 's/\ //')
          DBPASS=\$(cat \$CONFIGFILE | grep 'dbpass' | cut -f2 -d: | sed 's/\ //')
          DB=\$(cat \$CONFIGFILE | grep 'db:' | cut -f2 -d: | sed 's/\ //')
               
          $KANSODIR/bin/kanso push http://\$DBUSER:\$DBPASS@\$HOST:\$PORT/\$DB
          cd ..
        fi
      fi
    fi
  done


EOM
    }


#export -f check_version
#export -f set_variables
#export -f copy_project_files_to_builddir
#export -f npm_kanso_install
#export -f build_config
