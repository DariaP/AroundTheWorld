'use strict';

angular.module('aroundTheWorld')

.controller('LoginController', [
  '$scope', 
  '$window',
  '$stateParams', 
  function(
    $scope,
    $window,
    $stateParams)
  {
    $scope.login = function(event) {
      event.preventDefault();
      $window.location.href = '/auth/facebook/login/' + encodeURIComponent($stateParams.url);
    }
  }
])

.controller('LayoutController',[
  '$state',
  '$rootScope',
  function ($state, $rootScope) 
  {
    function setClasses(stateName) {
      if (stateName === "app") {
        $rootScope.mapsSidebarClasses = "col-xs-hide";
        $rootScope.col1Classes = "col-xs-hide";
        $rootScope.col2Classes = "col-xs-hide";
        $rootScope.gmapClasses = "col-xs-12";
      }

      if (stateName === "app.mapsSidebar.map" ||
          stateName === "app.mapsSidebar.maps" ||
          stateName === "app.mapsSidebar.login" ||
          stateName === "app.mapsSidebar.addPlaces") {
        $rootScope.mapsSidebarClasses = "sidebar col-xs-12 col-sm-3";
        $rootScope.col1Classes = "col-xs-12";
        $rootScope.col2Classes = "col-xs-hide";
        $rootScope.gmapClasses = "col-xs-12 col-sm-9";
      }


      if (stateName === "app.mapsSidebar.map.place") {
        $rootScope.mapsSidebarClasses = "sidebar col-xs-12 col-sm-6";
        $rootScope.col1Classes = "col-xs-hide col-sm-6";
        $rootScope.col2Classes = "col-xs-12 col-sm-6";
        $rootScope.gmapClasses = "col-xs-12 col-sm-6";
      }

      if (stateName === "app.mapsSidebar.place") {
        $rootScope.mapsSidebarClasses = "col-xs-12 col-sm-3";
        $rootScope.col1Classes = "col-xs-hide";
        $rootScope.col2Classes = "col-xs-12";
        $rootScope.gmapClasses = "col-xs-12 col-sm-9";
      }

    }

    setClasses($state.current.name);

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        setClasses(toState.name);      
    });
}])