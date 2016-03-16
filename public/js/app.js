'use strict';

angular.module('aroundTheWorld', ['ui.router', 'user', 'ngResource', 'ui.bootstrap'])
.constant("baseURL","http://localhost:8000/")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/",
    views: {
      'header': {
        templateUrl : 'views/header.html',
        controller  : 'HeaderController'
      },

      'content': {
        templateUrl : 'views/worldMap.html',
        controller  : 'GMapController'
      },

      'layout': {
        template: "",
        controller: 'LayoutController'
      }
    }
  })

  .state('app.login', {
    url:'mapslogin/:url',
    views: {
      'sidebar': {
        templateUrl : 'views/login.html',
        controller: 'LoginController'
      }
    }
  })

  .state('app.maps', {
    url:'maps/',
    views: {
      'sidebar': {
        templateUrl : 'views/mapsList.html',
        controller  : 'MapsListController'
      }
    }
  })

  .state('app.maps.add', {
    url:'add/',
    views: {
      'addMap': {
        templateUrl : 'views/addMap.html',
        controller  : 'NewMapController'
      }
    }
  })

  .state('app.map', {
      url: 'map/:mapId/',
      views: {
          'sidebar': {
              templateUrl : 'views/map.html',
              controller  : 'MapController'
         }
      }
  })

  .state('app.addPlaces', {
      url: 'addplaces/:mapId/',
      views: {
          'sidebar': {
              templateUrl : 'views/addPlacesOnMap.html',
              controller  : 'AddPlacesOnMapController'
         }
      }
  })

  .state('app.map.place', {
      url: 'place/:placeId/',
      views: {
        'placeDetails' : {
          templateUrl : "views/placeDetails.html",
          controller  : 'PlaceController'
        }
      }
  })

  .state('app.place', {
      url: 'place/:placeId/',
      views: {
        'sidebar' : {
          templateUrl : "views/placeDetails.html",
          controller  : 'PlaceController'
        }
      }
  })

  .state('app.newPlace', {
    url: 'newPlace/',
    views: {
      'content@': {
        templateUrl : 'views/addPlace.html',
        controller  : 'NewPlaceController'
      }
    }
  })

  $urlRouterProvider.otherwise('/');
})

;