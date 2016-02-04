'use strict';

angular.module('aroundTheWorld')

.controller('AddPlacesOnMapController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'mapsService',
  'placesService',
  'placesCachedService',
  'userName', 

  function(
    $scope, 
    $rootScope,
    $state, 
    $stateParams, 
    mapsService,
    placesService,
    placesCachedService,
    userName) {

    $scope.showPlaces = false;
    $scope.message="Loading ...";

    if (userName) {
      placesCachedService.getAllPlaces(function(places) {
        $scope.places = places;
        $scope.showPlaces = true;        
      });
    } else {
      $state.go('app.mapsSidebar.login');
    }

    $scope.addPlace = function(placeId, i) {
      var parentMaps = $scope.places[i].parentMaps;
      parentMaps.push($stateParams.mapId);

      placesService.getPlace().update({id: placeId}, {parentMaps: parentMaps}, 
        function (result) {
          $scope.places.splice(i, 1);
        }
      );
    }

    $scope.placeLinkClick = function(event, placeId) {
      event.preventDefault();
      // Need this workaround because link has buttons in it
      if(event.target.tagName.toLowerCase() === 'a') {
        $state.go("app.mapsSidebar.place", {
          mapId: $stateParams.mapId, 
          placeId: placeId
        });
      }
    }

}]);