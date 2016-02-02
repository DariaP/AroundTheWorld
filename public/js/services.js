'use strict';

angular.module('aroundTheWorld')

.service('markersService', 
  function() {

    function getPin (color) {
      return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));  
    }

    this.getMarker = function(params) {
      var callbacks = {},
          menu = null;

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(params.location.lat, params.location.lng),
        map: params.map,
        title: params.title,
        icon: getPin(params.color)
      });

      google.maps.event.addListener(marker, 'click', function() {
        if (callbacks.onClick) {
          callbacks.onClick(params.id);
        }
      });

      google.maps.event.addListener(marker, 'mouseover', function() {
        if (callbacks.onMouseOver) {
          callbacks.onMouseOver(params.id);
        }
      });

      google.maps.event.addListener(marker, 'mouseout', function() {
        if (callbacks.onMouseOut) {
          callbacks.onMouseOut(params.id);
        }
      });

      return {
        title: params.title,
        clear: function() {
          marker.setMap(null);
        },

        setColor: function(color) {
          marker.setOptions({color: color});
        },

        getPosition: function() {
          return marker.getPosition();
        },

        onClick: function(callback) {
          callbacks.onClick = callback;
        },

        onMouseOver: function(callback) {
          callbacks.onMouseOver = callback;
        },

        onMouseOut: function(callback) {
          callbacks.onMouseOut = callback;
        },

        showInfo: function(htmlString) {
          menu = new google.maps.InfoWindow();
          menu.setContent(htmlString);
          menu.open(params.map, marker);
        },

        hideInfo: function() {
          if (menu) {
            menu.close();
          }
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

}])

.service('placesCachedService', ['placesService', function(placesService) {
  var cache = {};

  this.getPlace = function(placeId, callback) {
    if(cache[placeId]) {
      callback(cache[placeId]);
    } else {
      placesService.getPlace().get({id: placeId})
        .$promise.then(
          function(response){
              cache[placeId] = response;
              callback(response);
          },
          function(response) {
            //TODO
          }
      );
    }
  }

  this.getPlaces = function(mapId, callback) {
    placesService.getPlaces().query({mapId: mapId},
      function(response) {
        for (var i = 0 ; i < response.length ; ++i) {
          var place = response[i];
          cache[place._id] = place;
        }
        callback(response);
      },
      function(response) {
          //TODO
      }
    );
  }

}])

;