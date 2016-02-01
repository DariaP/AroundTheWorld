'use strict';

angular.module('aroundTheWorld')

.controller('NewMapController', [
  '$scope',
  '$state',
  'mapsService',
  'userName',
  function ($scope, $state, mapsService, userName) 
  {
    $scope.newMapName = "";
    $scope.addNewMap = function() {
      if ($scope.newMapName.length !== 0) {
        mapsService.getMaps().save({
          name: $scope.newMapName
        }, function (result) {
          $scope.$parent.$parent.maps.push({
            name: $scope.newMapName,
            _id: result._id
          });
        });
      }
      $state.go('app.mapsSidebar.maps');
    }
}]);