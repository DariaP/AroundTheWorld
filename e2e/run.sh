cd ..
node initDb.js > /dev/null
cd e2e

protractor --params.login="$FACEBOOK_USERNAME" --params.password="$FACEBOOK_PASSWORD" conf.js --specs "$1"
