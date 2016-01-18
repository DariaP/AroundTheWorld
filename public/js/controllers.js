'use strict';

angular.module('aroundTheWorld')

.controller('WorldMapController', [
  '$scope', '$rootScope', 'markersService', 'placesService', 
  function ($scope, $rootScope, markersService, placesService) {

  var mapOptions = {
    center: new google.maps.LatLng(30, -30),
    zoom: 3
  }

  $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var placesSearchService = new google.maps.places.PlacesService($scope.map);

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
      },
      function(response) {
          //TODO
      });
    }
  );

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
    var marker = markersService.getMarker({
      map: $scope.map,
      title: searchResult.formatted_address,
      location: {
        lat: searchResult.geometry.location.lat(), 
        lng: searchResult.geometry.location.lng()
      },
      color: '78FF69'
    });

    var off = $rootScope.$on('search', function (event, searchText) {
      marker.clear();
      off();
    });
  }

  function createPlaceMarker(place) {
    var marker = markersService.getMarker({
      map: $scope.map,
      title: place.name,
      location: {
        lat: place.location.lat, 
        lng: place.location.lng
      },
      color: 'FE7569'
    });

    var off = $rootScope.$on('showMap', function (event, searchText) {
      marker.clear();
      off();
    });
  }
}])

.controller('HeaderController', ['$scope', '$rootScope', 'userName', '$location',
  function ($scope, $rootScope, userName, $location) {

    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    $scope.userName = userName;
    $scope.searchText = "";

    $scope.search = function() {
      $rootScope.$emit('search', $scope.searchText);
    }
  }
])

.controller('MapsListController', [
  '$scope', 
  '$state',
  'mapsService', 
  'userName', 
  function (
      $scope, 
      $state, 
      mapsService, 
      userName 
    ) 
  {

    $scope.showMaps = false;
    $scope.message = "Loading ...";
    $scope.maps = {};

    if (userName) {
      mapsService.getMaps().query(
          function(response) {
              $scope.maps = response;
              $scope.showMaps = true;
          },
          function(response) {
              $scope.message = "Error: " + response.status + " " + response.statusText;
          });
    } else {
      $state.go('app.mapsSidebar.login');
    }
}])

.controller('MapController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'mapsService',
  'placesService',
  'userName', 

  function(
    $scope, 
    $rootScope,
    $state, 
    $stateParams, 
    mapsService,
    placesService,
    userName) {

    $scope.showMap = false;
    $scope.showPlaces = false;
    $scope.message="Loading ...";

    if (userName) {
      mapsService.getMaps().get({id: parseInt($stateParams.id,10)})
        .$promise.then(
          function(response){
              $scope.map = response;
              $scope.showMap = true;
              $rootScope.$emit('showMap', $scope.map._id);
          },
          function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
          }
      );

      placesService.getPlaces().query({mapId: parseInt($stateParams.id,10)},
        function(response) {
          $scope.places = response;
          $scope.showPlaces = true;
        },
        function(response) {
            //TODO
        }
      );

    } else {
      $state.go('app.mapsSidebar.login');
    }

    $scope.delete = function() {
      mapsService.getMaps().delete({id:$scope.map._id}, function () {
        $state.go('app.mapsSidebar.maps');
      });
    }
}]);