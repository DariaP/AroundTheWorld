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
        $rootScope.sidebarClasses = "hidden";
        $rootScope.col1Classes = "hidden";
        $rootScope.col2Classes = "hidden";
        $rootScope.gmapClasses = "";
      }

      if (stateName === "app.map" ||
          stateName === "app.maps" ||
          stateName === "app.login" ||
          stateName === "app.addPlaces") {
        $rootScope.sidebarClasses = "sidebar-1-col";
        $rootScope.col1Classes = "col-xs-12";
        $rootScope.col2Classes = "hidden";
        $rootScope.gmapClasses = "";
      }


      if (stateName === "app.map.place") {
        $rootScope.sidebarClasses = "sidebar-2-cols";
        $rootScope.col1Classes = "col-xs-hide col-sm-6";
        $rootScope.col2Classes = "col-xs-12 col-sm-6";
        $rootScope.gmapClasses = "column col-xs-6";
      }

      if (stateName === "app.place") {
        $rootScope.sidebarClasses = "sidebar-1-col";
        $rootScope.col1Classes = "col-xs-hide col-sm-hide";
        $rootScope.col2Classes = "col-xs-12";
        $rootScope.gmapClasses = "column col-xs-6 col-sm-9";
      }

    }

    setClasses($state.current.name);

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        setClasses(toState.name);      
    });
}])