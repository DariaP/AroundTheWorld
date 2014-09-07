            
function onLoad() {
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
  dataClient = getDataClient('http://localhost:29999',
    function(places) {
      $('#places').text(JSON.stringify(places));
    },
    function() {}
  );
  dataClient.requestAllPlaces()
}
