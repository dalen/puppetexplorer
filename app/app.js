import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-google-chart';
import 'angular-moment';
import 'angular-bootstrap';

angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'googlechart',
  'angularMoment',
  'ui.bootstrap',
]).run(($rootScope, $location, $http, PuppetDB) => {
  // Make the $location service available in root scope
  $rootScope.location = $location;
  $rootScope.isLoading = () => $http.pendingRequests.length !== 0;
  $rootScope.clearError = () => { $rootScope.error = null; };
  $rootScope.$on('queryChange', $rootScope.clearError);
  $rootScope.$on('queryChange', PuppetDB.cancel);
  $rootScope.$on('filterChange', PuppetDB.cancel);
  $rootScope.changePage = (page) => {
    $location.search('page', page);
    $rootScope.$broadcast('pageChange', { page });
  };
});

angular.module('app').factory('$exceptionHandler', ($injector, $log) =>
  (exception, cause) => {
    $log.error(exception, cause);
    if (!cause) {
      const $rootScope = $injector.get('$rootScope');
      $rootScope.error = exception.message;
    }
  }
);

angular.module('app').config(($routeProvider) =>
  $routeProvider.when('/dashboard', {
    templateUrl: 'controllers/dashboard/dashboard.tpl.html',
    controller: 'DashboardCtrl',
    controllerAs: 'dashboard',
    reloadOnSearch: false,
  })
  .when('/nodes', {
    templateUrl: 'controllers/nodelist/nodelist.tpl.html',
    controller: 'NodeListCtrl',
    controllerAs: 'nodeList',
    reloadOnSearch: false,
  })
  .when('/node/:node', {
    templateUrl: 'controllers/nodedetail/nodedetail.tpl.html',
    controller: 'NodeDetailCtrl',
    controllerAs: 'nodeDetail',
    reloadOnSearch: false,
  })
  .when('/events', {
    templateUrl: 'controllers/events/events.tpl.html',
    controller: 'EventsCtrl',
    controllerAs: 'events',
    reloadOnSearch: false,
  })
  .when('/facts', {
    templateUrl: 'controllers/facts/facts.tpl.html',
    controller: 'FactsCtrl',
    controllerAs: 'facts',
    reloadOnSearch: false,
  })
  .otherwise({ redirectTo: '/dashboard' })
);
