'use strict';

angular.module('aroundTheWorld')

.controller('HeaderController', [
  '$scope', 
  '$rootScope', 
  '$window', 
  'userName', 
  '$location',
  function (
    $scope, 
    $rootScope, 
    $window, 
    userName, 
    $location) 
  {
    $scope.login = function(event) {
      event.preventDefault();
      var url = $location.absUrl();
      $window.location.href = '/auth/facebook/login/' + encodeURIComponent(url);
    }

    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    $scope.userName = userName;

    $scope.search = function() {
      // Google autocomplete doesn't work with angular models
      var searchText = document.querySelector(".search-form input").value;
      $rootScope.$emit('search', searchText);
    }

    // Hide navbar on xs screens after menu item was clicked
    $('.nav a').on('click', function() {
      if ($(window).width() <= 768) {
        $('.navbar-toggle').click()
      }
    });
  }
]);