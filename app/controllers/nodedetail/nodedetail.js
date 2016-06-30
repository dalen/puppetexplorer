/* global angular NODE_FACTS */
angular.module('app').controller('NodeDetailCtrl', class {
  constructor($location, $routeParams, $scope, PuppetDB) {
    this.reset = this.reset.bind(this);
    this.fetchReports = this.fetchReports.bind(this);
    this.fetchFacts = this.fetchFacts.bind(this);
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$scope = $scope;
    this.PuppetDB = PuppetDB;
    this.node = this.$routeParams.node;
    // Reload nodes if either the page changes
    this.$scope.$on('pageChange', this.fetchReports);
    this.$scope.perPage = 10;
    this.reset();
  }

  reset() {
    this.reports = undefined;
    this.$location.search('page', null);
    this.$scope.numItems = undefined;
    this.fetchReports();
    return this.fetchFacts();
  }

  // Public: Fetches reports for node and stores them in @reports
  fetchReports() {
    this.reports = this.PuppetDB.parseAndQuery(
      'reports',
      this.$location.search().query,
      ['=', 'certname', this.node],
      {
        order_by: angular.toJson([{ field: 'end_time', order: 'desc' }]),
        offset: this.$scope.perPage * ((this.$location.search().page || 1) - 1),
        limit: this.$scope.perPage,
      },
      (data, total) => {
        this.reports = data;
        this.$scope.numItems = total;
        for (const report of this.reports) {
          this.PuppetDB.parseAndQuery(
            'event-counts',
            null,
            ['=', 'report', report.hash],
            {
              summarize_by: 'certname',
            },
            (d) => { report.events = d[0]; }
            );
        }
      }
      );
  }

  // Public: Fetch facts and store them in @facts
  //
  // Returns: `undefined`
  fetchFacts() {
    return this.PuppetDB.parseAndQuery(
      'fact-contents',
      null,
      ['=', 'certname', this.node],
      { order_by: angular.toJson([{ field: 'name', order: 'asc' }]) },
      (data) => {
        this.facts = data.filter(fact => fact.name[0] !== '_').map((fact) => {
          // insert some spaces to break lines
          fact.value = String(fact.value).replace(/(.{25})/g, '\u200B$1');
          return fact;
        });
      }
      );
  }

  // Public: Get the list of important facts to show in detail view
  //
  // Returns: A {Array} of important facts {String}.
  importantFacts() {
    return this.facts.filter((fact) => NODE_FACTS.indexOf(fact.name) !== -1)
      .sort((a, b) => NODE_FACTS.indexOf(a.name) - NODE_FACTS.indexOf(b.name));
  }

  // Public: Return the status of a node
  //
  // node - The {Object} node
  //
  // Returns: The {String} "failure", "skipped", "noop", "success" or "none"
  //          of `null` if no status known.
  //
  // TODO: This is largely duplicated from nodelist, but can be simplified
  //       significantly when the PuppetDB 3.0 v4 API is released and moved to
  //       a common file (PuppetDB service likely).
  status(report) {
    if (report === undefined) { return 'glyphicon-refresh spin'; }
    if (report === null) { return 'glyphicon-question-sign'; }
    if (report.status === 'failed') { return 'glyphicon-warning-sign text-danger'; }
    if (report.status === 'changed') { return 'glyphicon-exclamation-sign text-success'; }
    if (report.events && report.events.failures > 0) {
      return 'glyphicon-warning-sign text-danger';
    }
    if (report.events && report.events.skips > 0) {
      return 'glyphicon-exclamation-sign text-warning';
    }
    if (report.events && report.events.noops > 0) {
      return 'glyphicon-exclamation-sign text-info';
    }
    if (report.events && report.events.successes > 0) {
      return 'glyphicon-exclamation-sign text-success';
    }
    return 'glyphicon-ok-sign text-muted';
  }

  // Switch to events view for a specified report
  selectReport(report) {
    this.$location.search('mode', 'report');
    this.$location.search('report', report);
    return this.$location.path('/events');
  }
});
