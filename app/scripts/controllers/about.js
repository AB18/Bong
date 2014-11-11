'use strict';

/**
 * @ngdoc function
 * @name bongApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bongApp
 */
angular.module('bongApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
