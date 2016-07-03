import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-google-chart';
import 'angular-moment';
import 'angular-ui-bootstrap';

import { beanMetric } from './components/bean-metric';
import { nodeMetric } from './components/node-metric';
import { searchField } from './components/search-field';

import { SearchCtrl } from './controllers/search/search';
import { NodeListCtrl } from './controllers/nodelist/nodelist';
import { NodeDetailCtrl } from './controllers/nodedetail/nodedetail';
import { MenuCtrl } from './controllers/menu/menu';
import { FactsCtrl } from './controllers/facts/facts';
import { DashboardCtrl } from './controllers/dashboard/dashboard';
import { EventsCtrl } from './controllers/events/events';

import { Config } from './services/config';
import { PuppetDB } from './services/puppetdb';

angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'googlechart',
  'angularMoment',
  'ui.bootstrap',
])
  .component('beanMetric', beanMetric)
  .component('nodeMetric', nodeMetric)
  .component('searchField', searchField)
  .controller('SearchCtrl', SearchCtrl)
  .controller('NodeListCtrl', NodeListCtrl)
  .controller('NodeDetailCtrl', NodeDetailCtrl)
  .controller('MenuCtrl', MenuCtrl)
  .controller('FactsCtrl', FactsCtrl)
  .controller('DashboardCtrl', DashboardCtrl)
  .controller('EventsCtrl', EventsCtrl)
  .service('config', Config)
  .service('puppetDB', PuppetDB)
  .run(($rootScope, $location, $http, puppetDB) => {
    // Make the $location service available in root scope
    $rootScope.location = $location;
    $rootScope.isLoading = () => $http.pendingRequests.length !== 0;
    $rootScope.clearError = () => { $rootScope.error = null; };
    $rootScope.$on('queryChange', $rootScope.clearError);
    $rootScope.$on('queryChange', puppetDB.cancel);
    $rootScope.$on('filterChange', puppetDB.cancel);
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
