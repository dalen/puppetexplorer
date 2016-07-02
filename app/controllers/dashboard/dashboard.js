/* global DASHBOARD_PANELS */
export class DashboardCtrl {
  constructor($scope, puppetDB, $location, config) {
    this.$scope = $scope;
    this.puppetDB = puppetDB;
    this.$location = $location;

    this.panels = config.get('dashboardPanels');
    this.checkVersion();
    this.loadMetrics();
  }

  loadMetrics() {
    for (const panel of this.panels) {
      panel.count = undefined; // reset if we switched server
      this.getNodeCount(panel.query, (count) => { panel.count = String(count); });
    }

    this.$scope.panelWidth = Math.max(2, Math.floor(12 / this.panels.length));
  }

  getNodeCount(query, callback) {
    this.puppetDB.query(
      'nodes',
      ['extract', [['function', 'count']], this.puppetDB.parse(query)],
      {},
      (data) => callback(data[0].count)
    );
  }

  setQuery(query) {
    this.$location.search('query', query);
    this.$location.path('/nodes');
  }

  checkVersion() {
    this.puppetDB.getVersion().then(
      (resp) => {
        this.major = parseInt(resp.data.version.split('.')[0], 10);
        this.minor = parseInt(resp.data.version.split('.')[1], 10);
        this.patch = parseInt(resp.data.version.split('.')[2], 10);
        if (this.major < 4 || (this.major === 3 && this.minor < 2)) {
          throw new Error('This version of Puppet Explorer requires puppetDB version 3.2.0+' +
            `, you are running puppetDB ${resp.data.version}`);
        }
      }
    );
  }
}
