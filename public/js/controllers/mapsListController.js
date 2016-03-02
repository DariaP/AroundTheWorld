'use strict';

angular.module('aroundTheWorld')

.controller('MapsListController', [
  '$scope', 
  '$state',
  '$location',
  'mapsService', 
  'userName', 
  function (
      $scope, 
      $state, 
      $location,
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
            if (response.data && response.data.err.login) {
              $state.go('app.mapsSidebar.login', {url: $location.absUrl()});
            } else {
              $scope.message = "Error: " + response.status + " " + response.statusText;
            }
          });
    } else {
      $state.go('app.mapsSidebar.login', {url: $location.absUrl()});
    }

    $scope.newMap = function() {
      $state.go('app.mapsSidebar.maps.add');
    }

    $scope.close = function() {
      $state.go('app');
    }
}])