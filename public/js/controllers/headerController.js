'use strict';

angular.module('aroundTheWorld')

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
]);