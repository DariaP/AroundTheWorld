function getDataClient(url, connectionClosedCallback) {
  var serverUnavailable = function () {
    $('#places').text("Temporary unavailable");
    connectionClosedCallback();
  };

  if (typeof io === 'undefined') {
    serverUnavailable();
  }

  var socket = io.connect(url);
  
  socket.on('disconnect', function() {
    serverUnavailable();
  });

  return {
    requestAllPlaces : function(url) {
      socket.emit('getAllPlaces');
    },
    onPlaces : function(callback) {
      socket.on('allPlaces', callback);
    }
  };
};

function onLoad() {
  $('#details-sidebar').hide();

  map = initMap();
  dataClient = getDataClient(
    'http://localhost:29999',
    function() {}
    );
  dataClient.onPlaces(function(places) {
    places.forEach(function(place) {
      map.putPlaceMarker(place);
    });
  });
  dataClient.requestAllPlaces();
}
