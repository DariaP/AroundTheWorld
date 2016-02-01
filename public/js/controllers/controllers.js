'use strict';

angular.module('aroundTheWorld')

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
  });