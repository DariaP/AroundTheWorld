function initMap() {
  var mapMarkers = [],
  searchMarkers = [];

  var userCallbacks = new Array();
  var mapOptions = {
    center: new google.maps.LatLng(46.414, -118.101),
    zoom: 3
  };
  var map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
    );
  var searchInput = document.getElementById('navbar-search-input');
  var autocomplete = new google.maps.places.Autocomplete(searchInput);

  var placeInfoWindow = new google.maps.InfoWindow();
  var placesSearchService = new google.maps.places.PlacesService(map);
  function placeFoundCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createSearchMarker(results[i]);
      }
    }
  }
  function getPin(color) {
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
  }
  function removeMarkers(markers) {
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }
  }
  function createSearchMarker(place) {
    
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: getPin("78FF69")
    });

    searchMarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      if (userCallbacks["contextMenuContent"]) {
        placeInfoWindow.setContent(userCallbacks["contextMenuContent"](place.name));
        placeInfoWindow.open(map, this);
      }
    });
  }

  return {
    putPlaceMarker: function(place) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.location.lat, place.location.lng),
        map: map,
        title: place.name,
        icon: getPin("FE7569")
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
    },
    contextMenuContent: function(getContent) {
      userCallbacks["contextMenuContent"] = getContent
    },
    search: function(searchText) {
      removeMarkers(searchMarkers);
      searchMarkers = [];
      var request = {
        query: searchText
      };
      placesSearchService.textSearch(request, placeFoundCallback);
    }
  }
};
