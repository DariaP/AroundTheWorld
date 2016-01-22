'use strict';

angular.module('aroundTheWorld')

.service('markersService', function() {

  function getPin (color) {
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));  
  }

  this.getMarker = function(params) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(params.location.lat, params.location.lng),
      map: params.map,
      title: params.title,
      icon: getPin(params.color)
    });

    return {
      clear: function() {
        marker.setMap(null);
      },

      setColor: function(color) {
        marker.setOptions({color: color});
      },

      getPosition: function() {
        return marker.getPosition();
      }
    }
  };
})

.service('mapsService', ['$resource', 'baseURL', function($resource, baseURL) {
  this.getMaps = function() {
    return $resource(baseURL + "maps/:id", null,  {'update': {method: 'PUT' }});
  }
}])

.service('placesService', ['$resource', 'baseURL', function($resource, baseURL) {
  this.getPlaces = function() {
    return $resource(baseURL + "places/:mapId", null,  {'update': {method: 'PUT' }});
  }

  this.getPlace = function() {
    return $resource(baseURL + "place/:id", null,  {'update': {method: 'PUT' }});
  }

}]);