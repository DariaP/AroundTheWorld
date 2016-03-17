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
        $rootScope.sidebarClasses = "narrow-sidebar";
        $rootScope.col1Classes = "wide-col";
        $rootScope.col2Classes = "hidden";
        $rootScope.gmapClasses = "";
      }


      if (stateName === "app.map.place") {
        $rootScope.sidebarClasses = "wide-sidebar";
        $rootScope.col1Classes = "narrow-col";
        $rootScope.col2Classes = "narrow-col";
        $rootScope.gmapClasses = "";
      }

      if (stateName === "app.place") {
        $rootScope.sidebarClasses = "narrow-sidebar";
        $rootScope.col1Classes = "hidden";
        $rootScope.col2Classes = "wide-col";
        $rootScope.gmapClasses = "";
      }

    }

    setClasses($state.current.name);

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        setClasses(toState.name);      
    });
}])