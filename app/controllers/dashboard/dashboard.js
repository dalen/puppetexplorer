/* global angular DASHBOARD_PANELS */
angular.module('app').controller('DashboardCtrl', class {
  constructor($scope, PuppetDB, $location) {
    this.loadMetrics = this.loadMetrics.bind(this);
    this.$scope = $scope;
    this.PuppetDB = PuppetDB;
    this.$location = $location;
    this.$scope.$on('queryChange', this.loadMetrics);
    this.major = this.minor = this.patch = null;
    this.checkVersion();
  }

  loadMetrics() {
    this.getBean('num-nodes', 'activeNodes');
    this.getBean('num-resources', 'resources');
    this.getBean('avg-resources-per-node', 'avgResources');
    this.getBean('pct-resource-dupes', 'resDuplication', 100);

    if (DASHBOARD_PANELS) {
      this.$scope.panels = DASHBOARD_PANELS;
    } else {
      this.$scope.panels = [];
    }
    for (const panel of this.$scope.panels) {
      panel.count = undefined; // reset if we switched server
      this.getNodeCount(panel.query, (count) => { panel.count = String(count); });
    }

    this.$scope.panelWidth = Math.max(2, Math.floor(12 / this.$scope.panels.length));
  }

  getBean(name, scopeName, multiply = 1) {
    this.$scope[scopeName] = undefined;
    const bean = this.major > 3 ?
      'puppetlabs.puppetdb.population' : 'puppetlabs.puppetdb.query.population';
    const metric = this.major > 3 ?
      `${bean}:name=${name}` : `${bean}:type=default,name=${name}`;
    return this.PuppetDB.getBean(metric)
      .success((data) => {
        this.$scope[scopeName] = (angular.fromJson(data).Value * multiply)
          .toLocaleString()
          .replace(/^(.*\..).*/, '$1');
      })
      .error((data, status) => {
        if (status !== 0) {
          throw new Error(`Could not fetch metric ${name} from PuppetDB`);
        }
      });
  }

  getNodeCount(query, callback) {
    this.PuppetDB.query(
      'nodes',
      ['extract', [['function', 'count']], this.PuppetDB.parse(query)],
      {},
      (data) => callback(data[0].count)
    );
  }

  setQuery(query) {
    this.$location.search('query', query);
    return this.$location.path('/nodes');
  }

  checkVersion() {
    return this.PuppetDB.getVersion()
      .success(data => {
        this.major = parseInt(data.version.split('.')[0], 10);
        this.minor = parseInt(data.version.split('.')[1], 10);
        this.patch = parseInt(data.version.split('.')[2], 10);
        if (this.major < 4 || (this.major === 3 && this.minor < 2)) {
          throw new Error('This version of Puppet Explorer requires PuppetDB version 3.2.0+' +
            `, you are running PuppetDB ${data.version}`);
        }
        return this.loadMetrics();
      });
  }
});
