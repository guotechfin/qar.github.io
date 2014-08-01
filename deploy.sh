#! /usr/bin/env bash
echo "Building ..."
jekyll build

cd _site
git add -A;
git commit -m "Automatically commited"

git push origin master
