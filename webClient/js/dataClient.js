function initDataClient(url, connectionClosedCallback) {
  var serverUnavailable = function () {
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
    requestAllPlaces : function() {
      socket.emit('getAllPlaces');
    },
    onPlaces : function(callback) {
      socket.on('allPlaces', callback);
    },
    requestAllMaps : function() {
      socket.emit('getAllMaps');
    },
    onMaps : function(callback) {
      socket.on('allMaps', callback);
    },
    requestPlacesOnMap : function(map) {
      socket.emit('getPlacesOnMap', {map : map});
    },
    onPlacesOnMap : function(callback) {
      socket.on('placesOnMap', callback);
    },
    addPlace: function(place) {
      socket.emit('addPlace', place);
    },
    addPlaceOnMap: function (place, map) {
      socket.emit('addPlaceOnMap', { place: place, map: map});
    },
    onPlaceAdded: function(callback) {
      socket.on('placeAdded', callback);
    }
  };
};