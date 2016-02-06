'use strict';

angular.module('aroundTheWorld')

.controller('GMapController', [
  '$scope', 
  '$rootScope', 
  '$state',  
  '$compile',
  '$templateRequest',
  'markersService', 
  'placesService', 
  function (
    $scope, 
    $rootScope, 
    $state,  
    $compile,
    $templateRequest,
    markersService, 
    placesService) 
  {

  var markers = {};

  var mapOptions = {
    center: new google.maps.LatLng(30, -30),
    zoom: 3
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var placesSearchService = new google.maps.places.PlacesService(map);

  var autocomplete = new google.maps.places.Autocomplete(
    document.querySelector(".search-form input"));

  $rootScope.$on('search', function (event, searchText) {
    search(searchText);
  });

  $rootScope.$on('showMap', function (event, mapId) {
    placesService.getPlaces().query({mapId: mapId},
      function(response) {
          for (var i = 0; i < response.length; i++) {
            createPlaceMarker(response[i]);
          }
          zoomToShowMap(markers);
      },
      function(response) {
          //TODO
      });
    }
  );

  $rootScope.$on('placeLookup', function (event, placeId) {
    markers[placeId].setColor("000000");
    zoomToShowPlace(markers[placeId].getPosition());
  });

  $rootScope.$on('placeSelected', function(event, placeId) {
    var placeMarker = markers[placeId];
    if (placeMarker) {
      placeMarker.setColor("FFFF00");
      placeMarker.bigger();
    }

    var off = $rootScope.$on('placeSelected', function() {
      placeMarker.setColor("FE7569");
      placeMarker.smaller();
      off();
    })
  });

  function zoomToShowPlace(placeLocation) {
    map.setCenter(placeLocation);
    if (map.getZoom() < 15) {
      map.setZoom(15);
    }
  }

  function zoomToShowMap(markers) {
    var bounds = new google.maps.LatLngBounds();

    for(var id in markers) {
      if (markers[id]) {
        bounds.extend(markers[id].getPosition());
      }
    }

    map.fitBounds(bounds);
  }

  function search(searchText) {
    var request = {
      query: searchText
    };

    placesSearchService.textSearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createSearchMarker(results[i]);
        }
      }
    });
  }

  function createSearchMarker(searchResult) {
    var result = {
      map: map,
      title: searchResult.formatted_address,
      location: {
        lat: searchResult.geometry.location.lat(), 
        lng: searchResult.geometry.location.lng()
      },
      color: '78FF69'
    };

    var marker = markersService.getMarker(result);

    marker.onClick(function() {
      var scope = $rootScope.$new(true);
      scope.searchResult = result;
      scope.mapId = $rootScope.currentMap;
      $templateRequest("views/searchResultInfoWindow.html").then(function(templateHtml){
        var template = angular.element(templateHtml);
        var html = $compile(template)(scope);
        marker.showInfo(html[0]);
      });
    })

    var off = $rootScope.$on('search', function (event, searchText) {
      marker.clear();
      off();
    });
  }

  function createPlaceMarker(place) {
    var marker = markersService.getMarker({
      map: map,
      title: place.name,
      location: {
        lat: place.location.lat, 
        lng: place.location.lng
      },
      color: 'FE7569',
      id: place._id
    });

    markers[place._id] = marker;

    marker.onClick(function(placeId) {
      if ($state.current.name === "app.mapsSidebar.map.place" ||
          $state.current.name === "app.mapsSidebar.map") {
        $state.go('app.mapsSidebar.map.place', {
          placeId: placeId,
          mapId: $state.params.mapId
        });
      } else {
        $state.go('app.mapsSidebar.place', {placeId: placeId});
      }
    })

    marker.onMouseOver(function(placeId) {
      $scope.marker = markers[placeId];
      $templateRequest("views/markerInfoWindow.html").then(function(templateHtml){
        var template = angular.element(templateHtml);
        var html = $compile(template)($scope);
        marker.showInfo(html[0]);
      });
    });

    marker.onMouseOut(function(placeId) {
      marker.hideInfo();
    });

    var off = $rootScope.$on('showMap', function (event, searchText) {
      marker.clear();
      markers[place._id] = undefined;
      off();
    });
  }

  function createMarker(place) {
    var marker = markersService.getMarker({
      map: map,
      title: place.name,
      location: {
        lat: place.location.lat, 
        lng: place.location.lng
      },
      color: 'FE7569'
    });

    markers[place._id] = marker;

    var off = $rootScope.$on('showMap', function (event, searchText) {
      marker.clear();
      markers[place._id] = undefined;
      off();
    });
  }

}]);
