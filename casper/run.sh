#!/bin/zsh

node ../../AroundTheWorld-server/initDb.js
node ../../AroundTheWorld-server/index.js &
pid=$(ps | grep 'index.js' | grep -v 'grep' | awk '{print $1;}')
casperjs test mapsSidebarTests.js
kill $pid