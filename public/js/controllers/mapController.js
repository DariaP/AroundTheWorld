'use strict';

angular.module('aroundTheWorld')

.controller('MapController', [
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

    $scope.showMap = false;
    $scope.showPlaces = false;
    $scope.message="Loading ...";

    $rootScope.currentMap = $stateParams.mapId;

    if (userName) {
      mapsService.getMaps().get({id: $stateParams.mapId})
        .$promise.then(
          function(response){
              $scope.map = response;
              $scope.showMap = true;
              $rootScope.$emit('showMap', $scope.map._id);
          },
          function(response) {
            if (response.data && response.data.err.login) {
              $state.go('app.mapsSidebar.login', {url: $location.absUrl()});
            } else {
              $scope.message = "Error: "+ response.status + " " + response.statusText;
            }
          }
      );

      placesCachedService.getPlaces($stateParams.mapId, function(places) {
        $scope.places = places;
        $scope.showPlaces = true;        
      });

    } else {
      $state.go('app.mapsSidebar.login', {url: $location.absUrl()});
    }

    $scope.delete = function() {
      mapsService.getMaps().delete({id:$scope.map._id}, function () {
        $state.go('app.mapsSidebar.maps');
      });
    }

    $scope.addPlace = function() {
      $state.go('app.mapsSidebar.addPlaces', {mapId: $scope.map._id});
    };

    $scope.showEditNameForm = false;
    $scope.editName = function() {
      $scope.showEditNameForm = true;
    }

    $scope.saveNewName = function(newName) {
      if (newName && newName.length !== 0) {
        mapsService.getMaps().update({id:$scope.map._id}, {name: newName}, 
          function (result) {
            $scope.map.name = newName;
            $scope.showEditNameForm = false;
          }
        );
      } else {
        $scope.showEditNameForm = false;
      }
    }

    $scope.showButtons = [];
    $scope.placeHoverIn = function(i) {
      $scope.showButtons[i] = true;
    }
    $scope.placeHoverOut = function(i) {
      $scope.showButtons[i] = false;
    }

    $scope.lookUpPlace = function(placeId) {
      $rootScope.$emit('placeLookup', placeId);
    }

    $scope.removePlace = function(placeId, i) {
      var parentMaps = $scope.places[i].parentMaps;
      parentMaps.splice(parentMaps.indexOf($scope.map._id), 1);

      placesService.getPlace().update({id: placeId}, {parentMaps: parentMaps}, 
        function (result) {
          $scope.places.splice(i, 1);
        }
      );
    }

    $scope.close = function() {
      if ($state.current.name === "app.mapsSidebar.map") {
        $state.go('app');
      } else {
        var placeId = $state.$current.locals.globals.$stateParams.placeId;
        $state.go('app.mapsSidebar.place', {placeId: placeId});
      }
    }

    $scope.placeLinkClick = function(event, placeId) {
      event.preventDefault();
      // Need this workaround because link has buttons in it
      var tag = console.log(event.target.tagName.toLowerCase());
      if(tag !== 'button' && tag !== 'span') {
        $state.go("app.mapsSidebar.map.place", {
          mapId: $stateParams.mapId, 
          placeId: placeId
        });
      }
      $rootScope.$emit('placeSelected', placeId);
    }

    $scope.updatePlace = function(placeId, place) {
      for (var i = 0 ; i < $scope.places.length ; ++i) {
        if ($scope.places[i]._id === placeId) {
          $scope.places[i] = place;
          break;
        }
      }
    }
}]);