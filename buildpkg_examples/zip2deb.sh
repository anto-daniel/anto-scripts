#!/bin/bash 

zipfile=$1
buildroot=pkgroot
builddir=$buildroot/opt/storm
version=0.0.2
package=storm

if [ $# -ne 1 ]; then echo "Need 1st argument: zip file";exit 1;fi

mkdir -p $builddir && mkdir -p $buildroot/DEBIAN
echo "Extracting build files to $builddir"
unzip $zipfile -d $buildroot/opt/storm > extracted_archive.log

cat >> $buildroot/DEBIAN/control << EOM
Package: $package
Version: $version
Architecture: all
Maintainer: Actiance <apaul@actiance.com>
Description: Custom Build Storm Package
EOM

cat >> $buildroot/DEBIAN/preinst << EOM
#!/bin/bash 

/bin/echo "Removing old build files.."
/bin/rm -rf /opt/storm

EOM

chmod +x $buildroot/DEBIAN/preinst
dpkg-deb --build $buildroot ${package}\_${version}.deb
rm -rf $buildroot extracted_archive.log
