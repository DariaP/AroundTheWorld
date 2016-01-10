'use strict';

angular.module('aroundTheWorld', ['ui.router'])
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
        controller  : 'IndexController'
      }
    }

  })

  $urlRouterProvider.otherwise('/');
})

.controller('MapCtrl', function ($scope, $rootScope, markersService) {

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

})

.controller('HeaderController', function ($scope, $rootScope) {

  $scope.searchText = "";

  $scope.search = function() {
    $rootScope.$emit('search', $scope.searchText);
  }
})

.controller('IndexController', function() {

})

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
;