#!/bin/zsh

setopt shwordsplit 
scripts=

if [ "$1" != "" ]; then
    scripts="$1"
else
    scripts=$(ls | grep '.js')
fi

serverPid=$(ps | grep 'index.js' | grep -v 'grep' | awk '{print $1;}')

if [[ "$serverPid" != "" ]]; then
	kill $serverPid
fi

for script in $scripts; do
	cd ..
	node initDb.js > /dev/null
	node index.js 1> /dev/null 2> /dev/null &
	pid=$(ps | grep 'index.js' | grep -v 'grep' | awk '{print $1;}')
	cd casper
	casperjs --engine=slimerjs --ssl-protocol=any test $script --addr=http://localhost:8000
	kill $pid
done

cd ..
node initDb.js > /dev/null

if [[ "$serverPid" != "" ]]; then
	node index.js &
fi