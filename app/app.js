import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-google-chart';
import 'angular-moment';
import 'angular-ui-bootstrap';

import { app } from './components/app';
import { beanMetric } from './components/bean-metric';
import { nodeMetric } from './components/node-metric';
import { searchField } from './components/search-field';
import { dashboard } from './components/dashboard';
import { menubar } from './components/menubar';
import { nodelist } from './components/nodelist';
import { reportList } from './components/report-list';
import { importantFacts } from './components/important-facts';
import { nodeDetail } from './components/node-detail';

import { FactsCtrl } from './controllers/facts/facts';
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
  .component('app', app)
  .component('beanMetric', beanMetric)
  .component('nodeMetric', nodeMetric)
  .component('searchField', searchField)
  .component('dashboard', dashboard)
  .component('menubar', menubar)
  .component('nodelist', nodelist)
  .component('reportList', reportList)
  .component('importantFacts', importantFacts)
  .component('nodeDetail', nodeDetail)
  .controller('FactsCtrl', FactsCtrl)
  .controller('EventsCtrl', EventsCtrl)
  .service('config', Config)
  .service('puppetDB', PuppetDB)
  .run(($rootScope) => {
    $rootScope.clearError = () => { $rootScope.error = null; };
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
    template: '<dashboard></dashboard>',
    reloadOnSearch: false,
  })
  .when('/nodes', {
    template: '<nodelist query="$ctrl.query"></nodelist>',
    reloadOnSearch: false,
  })
  .when('/node/:node', {
    template: '<node-detail></node-detail>',
    reloadOnSearch: false,
  })
  .when('/events', {
    templateUrl: 'controllers/events/events.tpl.html',
    controller: 'EventsCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  })
  .when('/facts', {
    templateUrl: 'controllers/facts/facts.tpl.html',
    controller: 'FactsCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  })
  .otherwise({ redirectTo: '/dashboard' })
);
