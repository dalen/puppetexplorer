import moment from 'moment';

export const nodelist = {
  bindings: {
    query: '<',
  },

  template: `
    <div class="alert alert-warning" role="alert" ng-if="$ctrl.nodes.length === 0">
      No nodes found
    </div>

    <table class="table table-striped table-hover" ng-if="$ctrl.nodes.length > 0" id="node-list">
      <thead><tr>
        <th><span class="label label-default">
          <ng-pluralize count="$ctrl.numItems"
            when="{'one': '1 node found', 'other': '{} nodes found'}">
          </ng-pluralize>
        </span></th>
        <th>Last run</th>
        <th style="text-align:center">Successes</th>
        <th style="text-align:center">Noops</th>
        <th style="text-align:center">Skips</th>
        <th style="text-align:center">Failures</th>
        <th></th>
      </tr></thead>
      <tbody>
        <tr ng-repeat="node in $ctrl.nodes">
          <td ui-sref="node-detail({node: node.certname})">{{node.certname}}</td>
          <td title="{{node['catalog-timestamp']}}">
            <span class="glyphicon glyphicon-warning-sign text-warning"
              ng-if="$ctrl.nodeUnresponsive(node)"></span>
            <span am-time-ago="node.report_timestamp"></span>
          </td>
          <td class="text-center">{{node.metrics.events.success || ""}}</td>
          <td class="text-center">{{node.metrics.events.noop || ""}}</td>
          <td class="text-center">{{node.metrics.events.skip || ""}}</td>
          <td class="text-center">{{node.metrics.events.failure || ""}}</td>
          <td class="text-right" ui-sref="events({node: node.certname})">
            <span class="glyphicon" ng-class="$ctrl.nodeStatus(node)"></span>
          </td>
        </tr>
      </tbody>
    </table>

    <uib-pagination ng-if="$ctrl.numItems > $ctrl.perPage" ng-model="$ctrl.page"
      ng-change="$ctrl.$state.go($ctrl.$state.current.name, { page: $ctrl.page })"
      num-pages="$ctrl.numPages" items-per-page="$ctrl.perPage"
      boundary-links="$ctrl.numItems > $ctrl.perPage*5" max-size="5" total-items="$ctrl.numItems"
      rotate="false" previous-text="&lsaquo;" next-text="&rsaquo;"
      first-text="&laquo;" last-text="&raquo;"></uib-pagination>
  `,

  controller: class {
    constructor($state, config, puppetDB) {
      this.$state = $state;
      this.unresponsiveHours = config.get('unresponsiveHours');
      this.puppetDB = puppetDB;

      this.$state.params.page = this.$state.params.page || 1;
      this.perPage = 5;
      this.reset();
    }

    $onChanges() {
      this.reset();
    }

    reset() {
      this.numItems = undefined;
      this.fetchNodes();
    }

    // Fetch the list of nodes for the current query
    fetchNodes() {
      this.nodes = undefined;
      this.puppetDB.query(
        'nodes',
        this.query,
        {
          include_total: true,
          offset: this.perPage * (this.$state.params.page - 1),
          limit: this.perPage,
          order_by: JSON.stringify([{ field: 'certname', order: 'asc' }]),
        },
        (data, total) => {
          this.numItems = total;
          this.nodes = data;
          for (const node of this.nodes) {
            this.fetchNodeEventCount(node);
          }
        }
      );
    }

    // Fetch node event counts
    //
    // node - The {Object} node to fetch event counts for
    //
    // Returns: `undefined`
    fetchNodeEventCount(node) {
      if (!node.latest_report_hash) { return; }
      const resp = this.puppetDB.getQuery(`reports/${node.latest_report_hash}/metrics`);
      this.puppetDB.handleResponse(resp, ((n) =>
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
      return moment(node.report_timestamp)
        .isBefore(moment.utc().subtract(this.unresponsiveHours, 'hours'));
    }
  },
};
