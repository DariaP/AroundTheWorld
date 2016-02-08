'use strict';

angular.module('aroundTheWorld')

.controller('LayoutController',[
  '$rootScope',
  function ($rootScope) 
  {
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      var stateName = toState.name;

      if (stateName === "app") {
        $rootScope.mapsSidebarClasses = "col-xs-hide";
        $rootScope.col1Classes = "col-xs-hide";
        $rootScope.col2Classes = "col-xs-hide";
        $rootScope.gmapClasses = "col-xs-12";
      }

      if (stateName === "app.mapsSidebar.maps") {
        $rootScope.mapsSidebarClasses = "col-xs-3";
        $rootScope.col1Classes = "col-xs-12";
        $rootScope.col2Classes = "col-xs-hide";
        $rootScope.gmapClasses = "col-xs-9";
      }

      if (stateName === "app.mapsSidebar.map") {
        $rootScope.mapsSidebarClasses = "col-xs-3";
        $rootScope.col1Classes = "col-xs-12";
        $rootScope.col2Classes = "col-xs-hide";
        $rootScope.gmapClasses = "col-xs-9";
      }

      if (stateName === "app.mapsSidebar.map.place") {
        $rootScope.mapsSidebarClasses = "col-xs-6";
        $rootScope.col1Classes = "col-xs-6";
        $rootScope.col2Classes = "col-xs-6";
        $rootScope.gmapClasses = "col-xs-6";
      }

      if (stateName === "app.mapsSidebar.place") {
        $rootScope.mapsSidebarClasses = "col-xs-3";
        $rootScope.col1Classes = "col-xs-hide";
        $rootScope.col2Classes = "col-xs-12";
        $rootScope.gmapClasses = "col-xs-9";
      }
      
    });
}])