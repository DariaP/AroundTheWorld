function initMap() {
  var mapOptions = {
    center: new google.maps.LatLng(46.414, -118.101),
    zoom: 5
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
      console.log(marker)
    }
  }
};
