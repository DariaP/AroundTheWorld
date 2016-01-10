'use strict';

angular.module('aroundTheWorld', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the main page
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

    .controller('MapCtrl', function ($scope, $rootScope) {

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

            //TODO:this.trigger('newSearch');

            placesSearchService.textSearch(request, function(results, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                  createSearchMarker(results[i]);
                }
              }
            });
        }

        function createSearchMarker(searchResult) {
            console.log(searchResult);
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
;