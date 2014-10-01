#!/bin/bash

GITHUB_REPO='spotify/puppetexplorer'

[ -z "$TRAVIS_TAG" ] && echo "Not a tagged release, not building packages" && exit 0;
if [[ $TRAVIS_REPO_SLUG != $GITHUB_REPO ]]; then
  echo "Not ${GITHUB_REPO} repo, not building packages"
  exit 0
fi

sudo apt-get update -qq
sudo apt-get install -y devscripts debhelper rpm
grunt debian_package rpm:release

# Prepare for GitHub releases push
cp -r dist puppetexplorer-${TRAVIS_TAG}
tar czf puppetexplorer.tar.gz puppetexplorer-${TRAVIS_TAG}
cp tmp/*.deb puppetexplorer.deb
cp rpm/RPMS/noarch/*.rpm puppetexplorer.rpm
