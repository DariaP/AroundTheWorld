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
});