
function startClient() {
  var client = require('socket.io-client'),
      config = require('./config.js').config,
      serverAddres = config.dataServerAddress + ":" + config.dataServerPort

  console.log("Connecting to the server: " + serverAddres);
  var socket = client.connect(serverAddres);

  socket.on('connect', function () {
    console.log("Connected to the server. Asking for data...");
    socket.on('allPlaces', function(places) {
    	console.log(places)
    })
    socket.emit('getAllPlaces')
  });
}

startClient()