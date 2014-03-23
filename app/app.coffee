require('semantic/build/packaged/javascript/semantic')
require('angular')
require('angular-route')
require('angular-animate')
require('angular-moment/angular-moment')
require('angular-google-chart/ng-google-chart')

angular.module('app', [
  'ngRoute'
  'ngAnimate'
  'googlechart'
  'angularMoment'
]).run ($rootScope, $location, $http, Pagination) ->
  # Make the $location service available in root scope
  $rootScope.location = $location
  $rootScope.isLoading = -> ($http.pendingRequests.length isnt 0)
  $rootScope.pagination = Pagination
  $rootScope.clearError = ->
    $rootScope.error = null
  $rootScope.$on('queryChange', $rootScope.clearError)

angular.module('app').factory '$exceptionHandler', ($injector, $log) ->
  (exception, cause) ->
    $log.error exception, cause
    unless cause
      $rootScope = $injector.get('$rootScope')
      $rootScope.error = exception.message

angular.module('app').config ($routeProvider) ->
  $routeProvider.when('/dashboard',
    templateUrl: 'controllers/dashboard/dashboard.tpl.html'
    controller: 'DashboardCtrl'
  ).when('/nodes',
    templateUrl: 'controllers/nodelist/nodelist.tpl.html'
    controller: 'NodeListCtrl'
    controllerAs: 'nodeList'
    reloadOnSearch: false
  ).when('/events',
    templateUrl: 'controllers/events/events.tpl.html'
    controller: 'EventsCtrl'
    controllerAs: 'events'
    reloadOnSearch: false
  ).when('/facts',
    templateUrl: 'controllers/facts/facts.tpl.html'
    controller: 'FactsCtrl'
    controllerAs: 'facts'
    reloadOnSearch: false
  ).otherwise redirectTo: '/dashboard'
