function initMap() {
  var mapOptions = {
    center: new google.maps.LatLng(46.414, -118.101),
    zoom: 5
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  return {
    putPlaceMarker: function(place) {
      var latlng = place.location.split(/\s*,\s*/);
      var lat = parseFloat(latlng[0]),
      lng = parseFloat(latlng[1])
      console.log(lat)
      console.log(lng)
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: place.name
      });
      console.log(marker)
    }
  }
};
