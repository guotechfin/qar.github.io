#! /usr/bin/env bash
cd _site &&  git checkout master

cd -
echo "Building ..."
jekyll build

cd _site
git add -A;
git commit -m "Automatically commited"

git push origin master
