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

  .state('app.mapsSidebar', {
    abstract: true,
    views: {

      'mapsSidebar': {
        templateUrl : 'views/mapsSidebar.html'
      }
    }
  })

  .state('app.mapsSidebar.login', {
    url:'mapslogin/:url',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/login.html',
        controller: 'LoginController'
      }
    }
  })

  .state('app.mapsSidebar.maps', {
    url:'maps/',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/mapsList.html',
        controller  : 'MapsListController'
      }
    }
  })

  .state('app.mapsSidebar.maps.add', {
    url:'add/',
    views: {
      'addMap': {
        templateUrl : 'views/addMap.html',
        controller  : 'NewMapController'
      }
    }
  })

  .state('app.mapsSidebar.map', {
      url: 'map/:mapId/',
      views: {
          'mapsSidebarContent': {
              templateUrl : 'views/map.html',
              controller  : 'MapController'
         }
      }
  })

  .state('app.mapsSidebar.addPlaces', {
      url: 'addplaces/:mapId/',
      views: {
          'mapsSidebarContent': {
              templateUrl : 'views/addPlacesOnMap.html',
              controller  : 'AddPlacesOnMapController'
         }
      }
  })

  .state('app.mapsSidebar.map.place', {
      url: 'place/:placeId/',
      views: {
        'placeDetails' : {
          templateUrl : "views/placeDetails.html",
          controller  : 'PlaceController'
        }
      }
  })

  .state('app.mapsSidebar.place', {
      url: 'place/:placeId/',
      views: {
        'mapsSidebarContent' : {
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