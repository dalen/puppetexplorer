#!/bin/bash

GITHUB_REPO='spotify/puppetexplorer'
PACKAGECLOUD_REPO='dalen/puppetexplorer'

[ -z "$TRAVIS_TAG" ] && echo "Not a tagged release, not building packages" && exit 0;
if [[ $TRAVIS_REPO_SLUG != $GITHUB_REPO ]]; then
  echo "Not ${GITHUB_REPO} repo, not building packages"
  exit 0
fi
[ -z "$PACKAGECLOUD_TOKEN" ] && echo "No packagecloud token found, not building packages" && exit 0;

sudo apt-get update -qq
sudo apt-get install -y devscripts debhelper rpm
gem install package_cloud
grunt debian_package rpm:release

echo "{\"https://packagecloud.io\":\"https://packagecloud.io\",\"token\":\"${PACKAGECLOUD_TOKEN}\"}" > ~/.packagecloud
package_cloud push $PACKAGECLOUD_REPO/any/any tmp/*.deb
package_cloud push $PACKAGECLOUD_REPO/el/7 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/el/6 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/el/5 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/scientific/5 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/scientific/6 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/14 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/15 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/16 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/17 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/18 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/19 rpm/RPMS/noarch/*.rpm
package_cloud push $PACKAGECLOUD_REPO/fedora/20 rpm/RPMS/noarch/*.rpm

# Prepare for GitHub releases push
cp -r dist puppetexplorer-${TRAVIS_TAG}
tar czf puppetexplorer.tar.gz puppetexplorer-${TRAVIS_TAG}
cp tmp/*.deb puppetexplorer.deb
cp rpm/RPMS/noarch/*.rpm puppetexplorer.rpm
