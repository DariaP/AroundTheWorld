'use strict';

angular.module('aroundTheWorld')

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

    $scope.newMap = function() {
      $state.go('app.mapsSidebar.maps.add');
    }

    $scope.close = function() {
      $state.go('app.map');
    }
}])