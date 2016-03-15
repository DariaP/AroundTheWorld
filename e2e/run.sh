#!/bin/zsh

setopt shwordsplit 
scripts=

if [ "$1" != "" ]; then
    scripts="$1"
else
    scripts=$(ls | grep '.js' | grep -Ev 'conf.js|login.js|aroundTheWorldPage.js')
fi

for script in $scripts; do
	cd ..
	node initDb.js > /dev/null

	cd e2e

	echo "\nRunning test: "
	echo "$script"
	echo "\n"

	protractor --params.login="$FACEBOOK_USERNAME" --params.password="$FACEBOOK_PASSWORD" conf.js --specs "$script"
done

cd ..
node initDb.js > /dev/null