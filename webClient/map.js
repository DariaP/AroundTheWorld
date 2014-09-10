function initMap() {
  var userCallbacks = new Array();
  var mapOptions = {
    center: new google.maps.LatLng(46.414, -118.101),
    zoom: 3
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  return {
    putPlaceMarker: function(place) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.location.lat, place.location.lng),
        map: map,
        title: place.name
      });
      google.maps.event.addListener(marker, 'click', function() {
        var callback = userCallbacks["onPlaceClick"];
        if(callback) {
          userCallbacks["onPlaceClick"](marker.title);
        }
      });
    },
    onPlaceClick: function(callback) {
      userCallbacks["onPlaceClick"] = callback
    }
  }
};
