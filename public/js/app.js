'use strict';

angular.module('aroundTheWorld', ['ui.router', 'user', 'ngResource'])
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
});