'use strict';

angular.module('aroundTheWorld')

.controller('HeaderController', ['$scope', '$rootScope', 'userName', '$location',
  function ($scope, $rootScope, userName, $location) {

    $scope.login = function(event) {
      event.preventDefault();
      console.log($location.absUrl());
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