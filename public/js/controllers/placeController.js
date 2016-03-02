'use strict';

angular.module('aroundTheWorld')

.controller('PlaceController', [
  '$scope',
  '$state',
  '$stateParams',
  '$location',
  'placesService',
  'placesCachedService',
  'userName',
  function (
    $scope, 
    $state, 
    $stateParams, 
    $location,
    placesService, 
    placesCachedService, 
    userName) 
  {
    if (!userName) {
      $state.go('app.mapsSidebar.login', {url: $location.absUrl()});
      return;
    }

    $scope.showPlace = false;
    $scope.message="Loading ...";
    $scope.noWrapSlides = false;

    placesCachedService.getPlace($stateParams.placeId, function(place) {
      $scope.place = place;
      $scope.showPlace = true;
    });

    $scope.close = function() {
      if ($state.current.name === "app.mapsSidebar.place") {
        $state.go('app');
      } else {
        $state.go('app.mapsSidebar.map', {mapId: $stateParams.mapId});
      }
    }

    $scope.showEdit = {};
    $scope.cancelEdit = function(property) {
      $scope.showEdit[property] = false;
    }

    $scope.newProperties = {};
    $scope.edit = function(property) {
      $scope.showEdit[property] = true;
      $scope.newProperties[property] = toStr[property]($scope.place[property]);
    }

    $scope.save = function(property) {
      if(!$scope.showEdit[property]) {
        return;
      }

      var value = parse[property]($scope.newProperties[property]);
      if (value && value !== $scope.place[property]) {//TODO: validate value?
        var newProperties = {};
        newProperties[property] = value;
        placesService.getPlace().update({id:$scope.place._id}, 
          newProperties, 
          function (result) {
            $scope.place[property] = value;
            $scope.showEdit[property] = false;
          }
        );
      } else {
        $scope.showEdit[property] = false;
      }
    }
  }]);