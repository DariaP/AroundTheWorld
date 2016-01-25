'use strict';

angular.module('aroundTheWorld')

.controller('GMapController', [
  '$scope', '$rootScope', 'markersService', 'placesService', 
  function ($scope, $rootScope, markersService, placesService) {

  var markers = {};

  var mapOptions = {
    center: new google.maps.LatLng(30, -30),
    zoom: 3
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var placesSearchService = new google.maps.places.PlacesService(map);

  var autocomplete = new google.maps.places.Autocomplete(
    document.querySelector(".search-form input"));

  $rootScope.$on('search', function (event, searchText) {
    search(searchText);
  });

  $rootScope.$on('showMap', function (event, mapId) {
    placesService.getPlaces().query({mapId: mapId},
      function(response) {
          for (var i = 0; i < response.length; i++) {
            createPlaceMarker(response[i]);
          }
          zoomToShowMap(markers);
      },
      function(response) {
          //TODO
      });
    }
  );

  $rootScope.$on('placeLookup', function (event, placeId) {
    markers[placeId].setColor("000000");
    zoomToShowPlace(markers[placeId].getPosition());
  });

  function zoomToShowPlace(placeLocation) {
    map.setCenter(placeLocation);
    if (map.getZoom() < 15) {
      map.setZoom(15);
    }
  }

  function zoomToShowMap(markers) {
    var bounds = new google.maps.LatLngBounds();

    for(var id in markers) {
      if (markers[id]) {
        bounds.extend(markers[id].getPosition());
      }
    }

    map.fitBounds(bounds);
  }

  function search(searchText) {
    var request = {
      query: searchText
    };

    placesSearchService.textSearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createSearchMarker(results[i]);
        }
      }
    });
  }

  function createSearchMarker(searchResult) {
    var marker = markersService.getMarker({
      map: map,
      title: searchResult.formatted_address,
      location: {
        lat: searchResult.geometry.location.lat(), 
        lng: searchResult.geometry.location.lng()
      },
      color: '78FF69'
    });

    var off = $rootScope.$on('search', function (event, searchText) {
      marker.clear();
      off();
    });
  }

  function createPlaceMarker(place) {
    var marker = markersService.getMarker({
      map: map,
      title: place.name,
      location: {
        lat: place.location.lat, 
        lng: place.location.lng
      },
      color: 'FE7569'
    });

    markers[place._id] = marker;

    var off = $rootScope.$on('showMap', function (event, searchText) {
      marker.clear();
      markers[place._id] = undefined;
      off();
    });
  }

  function createMarker(place) {
    var marker = markersService.getMarker({
      map: map,
      title: place.name,
      location: {
        lat: place.location.lat, 
        lng: place.location.lng
      },
      color: 'FE7569'
    });

    markers[place._id] = marker;

    var off = $rootScope.$on('showMap', function (event, searchText) {
      marker.clear();
      markers[place._id] = undefined;
      off();
    });
  }

}])

.controller('HeaderController', ['$scope', '$rootScope', 'userName', '$location',
  function ($scope, $rootScope, userName, $location) {

    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    $scope.userName = userName;
    $scope.searchText = "";

    $scope.search = function() {
      $rootScope.$emit('search', $scope.searchText);
    }
  }
])

.controller('GMapLayoutController',
  function ($scope) 
  {
    $scope.$parent.mapsSidebarClasses = "col-xs-hide";
    $scope.$parent.gmapClasses = "col-xs-12";
})

.controller('MapsSidebarController',
  function ($scope) 
  {
    $scope.$parent.mapsSidebarClasses = "col-xs-3";
    $scope.$parent.gmapClasses = "col-xs-9";
  })

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

.controller('MapController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'mapsService',
  'placesService',
  'userName', 

  function(
    $scope, 
    $rootScope,
    $state, 
    $stateParams, 
    mapsService,
    placesService,
    userName) {

    $scope.showMap = false;
    $scope.showPlaces = false;
    $scope.message="Loading ...";

    if (userName) {
      mapsService.getMaps().get({id: $stateParams.mapId})
        .$promise.then(
          function(response){
              $scope.map = response;
              $scope.showMap = true;
              $rootScope.$emit('showMap', $scope.map._id);
          },
          function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
          }
      );

      placesService.getPlaces().query({mapId: $stateParams.mapId},
        function(response) {
          $scope.places = response;
          $scope.showPlaces = true;
        },
        function(response) {
            //TODO
        }
      );

    } else {
      $state.go('app.mapsSidebar.login');
    }

    $scope.delete = function() {
      mapsService.getMaps().delete({id:$scope.map._id}, function () {
        $state.go('app.mapsSidebar.maps');
      });
    }

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
        $state.go('app.map');
      } else {
        var placeId = $state.$current.locals.globals.$stateParams.placeId;
        $state.go('app.mapsSidebar.place', {placeId: placeId});
      }
    }

    $scope.placeLinkClick = function(event, placeId) {
      event.preventDefault();
      // Need this workaround because link has buttons in it
      if(event.target.tagName.toLowerCase() === 'a') {
        $state.go("app.mapsSidebar.map.place", {
          mapId: $stateParams.mapId, 
          placeId: placeId
        });
      }
    }
}])

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
  }])

.controller('PlaceController', [
  '$scope',
  '$state',
  '$stateParams',
  'placesService',
  'userName',
  function ($scope, $state, $stateParams, placesService, userName) 
  {
    $scope.showPlace = false;
    $scope.message="Loading ...";
    $scope.noWrapSlides = false;

    placesService.getPlace().get({id: $stateParams.placeId})
      .$promise.then(
        function(response){
            $scope.place = response;
            $scope.showPlace = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );

    $scope.close = function() {
      if ($state.current.name === "app.mapsSidebar.place") {
        $state.go('app.map');
      } else {
        $state.go('app.mapsSidebar.map', {mapId: $stateParams.mapId});
      }
    }


  }])

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

      $scope.newPlace.location = parseLocation($scope.newPlace.location);
      $scope.newPlace.pics = parsePics($scope.newPlace.pics);
      placesService.getPlaces().save(
          $scope.newPlace, 
          function (result) {
            $state.go('app.mapsSidebar.place', {placeId: result._id});
        });
    }

    function parsePics(picsStr) {
      if (picsStr.length == 0)
        return [];
      else
        return picsStr.split(/[, \n]+/);
    }

    function parseLocation(locationStr) {
      var latlng = locationStr.split(/[, ]+/);
      return {
        lat: latlng[0],
        lng: latlng[1]
      };
    }
    /*$scope.showPlace = false;
    $scope.message="Loading ...";
    $scope.noWrapSlides = false;
    
    placesService.getPlace().get({id: $stateParams.placeId})
      .$promise.then(
        function(response){
            $scope.place = response;
            $scope.showPlace = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );

    $scope.close = function() {
      if ($state.current.name === "app.mapsSidebar.place") {
        $state.go('app.map');
      } else {
        $state.go('app.mapsSidebar.map', {mapId: $stateParams.mapId});
      }
    }*/


  }])
;