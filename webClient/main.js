function initMaps() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  console.log(map)
};
function getDataClient(url, placesCallback, connectionClosedCallback) {
  var serverUnavailable = function () {
    $('#places').text("Temporary unavailable");
    connectionClosedCallback();
  };

  if (typeof io === 'undefined') {
    serverUnavailable();
  }

  var socket = io.connect(url);
  socket.on('allPlaces', placesCallback);
  socket.on('disconnect', function() {
    serverUnavailable();
  });

  return {
    requestAllPlaces : function(url) {
      socket.emit('getAllPlaces');
    }
  };
};
function startDataClient() {
  dataClient = getDataClient('http://localhost:29999',
    function(places) {
      console.log(JSON.stringify(places))
    },
    function() {}
    );
  dataClient.requestAllPlaces()  
};
function onLoad() {
  initMaps();
  startDataClient();
}
