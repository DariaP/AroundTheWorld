'use strict';

angular.module('aroundTheWorld')

.controller('AddPlacesOnMapController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$location',
  'mapsService',
  'placesService',
  'placesCachedService',
  'userName', 

  function(
    $scope, 
    $rootScope,
    $state, 
    $stateParams, 
    $location,
    mapsService,
    placesService,
    placesCachedService,
    userName) {

    $scope.mapId = $stateParams.mapId;
    
    $scope.showPlaces = false;
    $scope.message="Loading ...";

    if (userName) {
      placesCachedService.getPlacesNotOnMap($scope.mapId, function(places) {
        $scope.places = places;
        $scope.showPlaces = true;        
      });
    } else {
      $state.go('app.login', {url: $location.absUrl()});
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
      var tag = event.target.tagName.toLowerCase();
      if(tag !== 'button' && tag !== 'span') {
        $state.go("app.place", {
          mapId: $stateParams.mapId, 
          placeId: placeId
        });
      }
    }

    //TODO - can go to map.place state
    $scope.done = function() {
      $state.go("app.map", {
        mapId: $stateParams.mapId
      });  
    };

}]);