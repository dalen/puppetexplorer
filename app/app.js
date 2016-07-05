import angular from 'angular';
import 'angular-ui-router';
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
import { events } from './components/events';
import { eventList } from './components/event-list';

import { FactsCtrl } from './controllers/facts/facts';

import { Config } from './services/config';
import { PuppetDB } from './services/puppetdb';

angular.module('app', [
  'ui.router',
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
  .component('events', events)
  .component('eventList', eventList)
  .controller('FactsCtrl', FactsCtrl)
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

angular.module('app').config(($stateProvider, $urlRouterProvider) => {
  // For any unmatched url, redirect to dashboard
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('root', {
      url: '/?query',
      abstract: true,
    })
    .state('dashboard', {
      url: '/dashboard',
      component: 'dashboard',
    })
    .state('nodes', {
      url: '/nodes?page',
      params: {
        page: {
          type: 'int',
          value: 1,
          dynamic: true,
        },
      },
      // template: '<nodelist query="$ctrl.query"></nodelist>',
      component: 'nodelist',
      resolve: {
        query: ($ctrl) => $ctrl.query,
      },
    })
    .state('node-detail', {
      url: '/node/:node?page',
      params: {
        page: {
          type: 'int',
          value: 1,
          dynamic: true,
        },
      },
      component: 'nodeDetail',
    })
    .state('events', {
      url: '/events',
      // template: '<events query="$ctrl.query"></events>',
      component: 'events',
      resolve: {
        query: '$ctrl.query',
      },
    })
    .state('facts', {
      url: '/facts',
      component: 'facts',
    });
});
