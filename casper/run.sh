#!/bin/zsh

setopt shwordsplit 
scripts=

if [ "$1" != "" ]; then
    scripts="$1"
else
    scripts=$(ls | grep '.js')
fi
 
for script in $scripts; do
	node ../../AroundTheWorld-server/initDb.js
	node ../../AroundTheWorld-server/index.js &
	pid=$(ps | grep 'index.js' | grep -v 'grep' | awk '{print $1;}')
	casperjs test $script
	kill $pid
done
