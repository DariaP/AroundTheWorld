'use strict';

angular.module('aroundTheWorld')

.controller('NewMapController', [
  '$scope',
  '$rootScope',
  '$state',
  'mapsService',
  'userName',
  function ($scope, $rootScope, $state, mapsService, userName) 
  {
    $scope.newMapName = "";
    $scope.addNewMap = function() {
      if ($scope.newMapName.length !== 0) {
        mapsService.getMaps().save({
          name: $scope.newMapName
        }, function (result) {
          $rootScope.$emit('newMap', {
            name: $scope.newMapName,
            _id: result._id
          });
        });
      }
      $state.go('app.mapsSidebar.maps');
    }
}]);