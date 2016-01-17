'use strict';

angular.module('aroundTheWorld', ['ui.router', 'user', 'ngResource'])
.constant("baseURL","http://localhost:8000/")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url:'/',
    views: {
      'header': {
        templateUrl : 'views/header.html',
        controller  : 'HeaderController'
      },

      'content': {
        templateUrl : 'views/gmap.html',
        controller: 'WorldMapController'
      }
    }
  })

  .state('app.mapsSidebar', {
    views: {
      'mapsSidebar': {
        templateUrl : 'views/mapsSidebar.html'
      }
    }
  })

  .state('app.mapsSidebar.login', {
    url:'mapslogin',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/login.html'
      }
    }
  })

  .state('app.mapsSidebar.maps', {
    url:'maps',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/mapsList.html',
        controller  : 'MapsListController'
      }
    }
  })

  // route for the dishdetail page
  .state('app.mapsSidebar.map', {
      url: 'map/:id',
      views: {
          'mapsSidebarContent': {
              templateUrl : 'views/map.html',
              controller  : 'MapController'
         }
      }
  });

  $urlRouterProvider.otherwise('/');
})

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

.controller('MapController', ['$scope', '$rootScope', '$stateParams', 'mapsService', 
  function($scope, $rootScope, $stateParams, mapsService) {

    $scope.showMap = false;
    $scope.message="Loading ...";
    $scope.map = mapsService.getMaps().get({id:parseInt($stateParams.id,10)})
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
}])

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
}])
;