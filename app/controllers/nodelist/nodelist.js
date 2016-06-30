/* global angular UNRESPONSIVE_HOURS moment */
angular.module('app').controller('NodeListCtrl', class {
  constructor($location, $scope, PuppetDB) {
    // Reload nodes if either the page changes
    this.reset = this.reset.bind(this);
    this.fetchNodes = this.fetchNodes.bind(this);
    this.fetchNodeEventCount = this.fetchNodeEventCount.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.$location = $location;
    this.$scope = $scope;
    this.PuppetDB = PuppetDB;
    this.$scope.$on('pageChange', this.fetchNodes);
    // Reset pagination and reload nodes if query changes
    this.$scope.$on('queryChange', this.reset);
    this.$scope.perPage = 50;
    this.reset();
  }

  reset() {
    this.$location.search('page', null);
    this.$scope.numItems = undefined;
    return this.fetchNodes();
  }

  // Public: Fetch the list of nodes for the current query
  //
  // Returns: `undefined`
  fetchNodes() {
    this.nodes = undefined;
    return this.PuppetDB.parseAndQuery(
      'nodes',
      this.$location.search().query,
      null,
      {
        offset: this.$scope.perPage * ((this.$location.search().page || 1) - 1),
        limit: this.$scope.perPage,
        order_by: angular.toJson([{ field: 'certname', order: 'asc' }]),
      },
      (data, total) => {
        this.$scope.numItems = total;
        this.nodes = data;
        for (const node of this.nodes) {
          this.fetchNodeEventCount(node);
        }
        if (this.$location.search().node != null) {
          this.fetchSelectedNode();
        }
      }
      );
  }

  // Public: Fetch node event counts
  //
  // node - The {Object} node to fetch event counts for
  //
  // Returns: `undefined`
  fetchNodeEventCount(node) {
    if (!node.latest_report_hash) { return; }
    const resp = this.PuppetDB.getQuery(`reports/${node.latest_report_hash}/metrics`);
    this.PuppetDB.handleResponse(resp, ((n) =>
      (data) => {
        node.metrics = {};
        // Create a nested hash out of all the metrics
        for (const metric of data) {
          if (n.metrics[metric.category] == null) { n.metrics[metric.category] = {}; }
          node.metrics[metric.category][metric.name] = metric.value;
        }
      }
    )(node)
    );
  }

  // Public: Select a node to show info for
  //
  // node - The node {Object}
  //
  // Returns: `undefined`
  selectNode(node) {
    return this.$location.path(`/node/${node.certname}`);
  }

  // Public: set the query to find a node and show events for it
  //
  // node - The {String} name of the node
  //
  // Returns: `undefined`
  showEvents(node) {
    this.$location.search('query', `\"${node}\"`);
    return this.$location.path('/events');
  }

  // Public: Return the status of a node
  //
  // node - The {Object} node
  //
  // Returns: The {String} "failure", "skipped", "noop", "success" or "none"
  //          of `null` if no status known.
  nodeStatus(node) {
    switch (node.latest_report_status) {
      case 'failed': return 'glyphicon-warning-sign text-danger';
      case 'changed': return 'glyphicon-exclamation-sign text-success';
      case 'unchanged': return 'glyphicon-exclamation-sign text-success';
      default: return 'glyphicon-question-sign';
    }
  }

  // Return if a node is unresponsive or not
  nodeUnresponsive(node) {
    if (node.report_timestamp == null) { return true; }
    const hours = UNRESPONSIVE_HOURS || 2;
    return moment(node.report_timestamp).isBefore(moment.utc().subtract(hours, 'hours'));
  }
});
