'use strict';

angular.module('aroundTheWorld')

.controller('NewPlaceController', [
  '$scope',
  '$state',
  '$stateParams',
  'placesService',
  'userName',
  function ($scope, $state, $stateParams, placesService, userName) 
  {
    $scope.newPlace = {
      name: "",
      location: "",
      notes: "",
      pics: "",
      parentMaps: []
    };

    $scope.save = function() {

      $scope.newPlace.location = parse.location($scope.newPlace.location);
      $scope.newPlace.pics = parse.pics($scope.newPlace.pics);
      placesService.getPlaces().save(
          $scope.newPlace, 
          function (result) {
            $state.go('app.mapsSidebar.place', {placeId: result._id});
        });
    }
  }])
;