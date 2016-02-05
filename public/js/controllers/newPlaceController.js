'use strict';

angular.module('aroundTheWorld')

.controller('NewPlaceController', [
  '$scope',
  '$state',
  '$stateParams',
  '$location',
  'placesService',
  'userName',
  function ($scope, $state, $stateParams, $location, placesService, userName) 
  {
    var query = $location.search();

    $scope.newPlace = {
      name: query.title,
      location: query.location,
      notes: "",
      pics: "",
      parentMaps: []
    };

    if (query.parentMap) {
      $scope.newPlace.parentMaps.push(query.parentMap);
    }

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