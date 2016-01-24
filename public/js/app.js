'use strict';

angular.module('aroundTheWorld', ['ui.router', 'user', 'ngResource', 'ui.bootstrap'])
.constant("baseURL","http://localhost:8000/")
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    abstract: true,
    views: {
      'header': {
        templateUrl : 'views/header.html',
        controller  : 'HeaderController'
      },

      'content': {
        templateUrl : 'views/worldMap.html',
        controller  : 'GMapController'
      }
    }
  })

  .state('app.map', {
    url:'/',
    views: {
      'map-layout': {
        template : " ",
        controller  : 'GMapLayoutController'
      }
    }
  })

  .state('app.mapsSidebar', {
    abstract: true,
    views: {

      'mapsSidebar': {
        templateUrl : 'views/mapsSidebar.html',
        controller: 'MapsSidebarController'
      }
    }
  })

  .state('app.mapsSidebar.login', {
    url:'/mapslogin',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/login.html'
      }
    }
  })

  .state('app.mapsSidebar.maps', {
    url:'/maps',
    views: {
      'mapsSidebarContent': {
        templateUrl : 'views/mapsList.html',
        controller  : 'MapsListController'
      }
    }
  })

  .state('app.mapsSidebar.maps.add', {
    url:'/add',
    views: {
      'addMap': {
        templateUrl : 'views/addMap.html',
        controller  : 'NewMapController'
      }
    }
  })

  .state('app.mapsSidebar.map', {
      url: '/map/:mapId',
      views: {
          'mapsSidebarContent': {
              templateUrl : 'views/map.html',
              controller  : 'MapController'
         }
      }
  })

  .state('app.mapsSidebar.map.place', {
      url: '/place/:placeId',
      views: {
        'placeDetails' : {
          templateUrl : "views/placeDetails.html",
          controller  : 'PlaceController'
        },
        'sidebarSeparator' : {
          templateUrl : "views/hr.html"
        }
      }
  })

  .state('app.mapsSidebar.place', {
      url: '/place/:placeId',
      views: {
        'mapsSidebarContent' : {
          templateUrl : "views/placeDetails.html",
          controller  : 'PlaceController'
        }
      }
  })

  $urlRouterProvider.otherwise('/');
});