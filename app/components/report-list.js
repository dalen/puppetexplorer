export const reportList = {
  bindings: {
    node: '<',
  },

  template: `
    <div class="alert alert-warning" role="alert" ng-if="$ctrl.reports.length === 0">
      No reports found
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">Reports</div>
      <table class="table table-striped" ng-if="$ctrl.reports">
        <thead><tr>
          <th>Time</th>
          <th style="text-align:center">Successes</th>
          <th style="text-align:center">Noops</th>
          <th style="text-align:center">Skips</th>
          <th style="text-align:center">Failures</th>
          <th></th>
        </tr></thead>
        <tbody>
          <tr ng-repeat="report in $ctrl.reports"
            ui-sref="root.events({ mode: report, report: report.hash })">
            <td title="{{report.end_time}}">
              <span am-time-ago="report.end_time"></span>
            </td>
            <td class="text-center">{{report.metrics.events.success || ""}}</td>
            <td class="text-center">{{report.metrics.events.noop || ""}}</td>
            <td class="text-center">{{report.metrics.events.skip || ""}}</td>
            <td class="text-center">{{report.metrics.events.failure || ""}}</td>
            <td class="text-right">
              <span class="glyphicon" ng-class="$ctrl.status(report)"></span>
            </td>
          </tr>
        </tbody>
      </table>

      <uib-pagination ng-if="$ctrl.numItems > $ctrl.perPage" ng-model="$ctrl.page"
        ng-change="$ctrl.changePage($ctrl.page)"
        num-pages="$ctrl.numPages" items-per-page="$ctrl.perPage"
        boundary-links="$ctrl.numItems > $ctrl.perPage*5" max-size="5" total-items="$ctrl.numItems"
        rotate="false" previous-text="&lsaquo;" next-text="&rsaquo;"
        first-text="&laquo;" last-text="&raquo;"></uib-pagination>
    </div>
  `,

  controller: class {
    constructor($state, $stateParams, puppetDB) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.puppetDB = puppetDB;

      this.perPage = 1;
    }

    $onChanges(changes) {
      if (!changes.node.isFirstChange()) {
        this.$state.go(this.$state.current.name, { page: 1 });
        this.page = 1;
      }
      this.reset();
    }

    reset() {
      this.page = this.$stateParams.page;
      this.numItems = undefined;
      this.fetchReports();
    }

    changePage(page) {
      this.page = page;
      // Push the new state
      this.$state.go(this.$state.current.name, { page });
      this.fetchReports();
    }

    // Fetches reports for node and stores them in reports
    fetchReports() {
      this.reports = this.puppetDB.query(
        'reports',
        ['extract', ['hash', 'end_time', 'status', 'metrics'], ['=', 'certname', this.node]],
        {
          include_total: true,
          order_by: JSON.stringify([{ field: 'end_time', order: 'desc' }]),
          offset: this.perPage * (this.page - 1),
          limit: this.perPage,
        },
        (data, total) => {
          this.reports = data;
          for (const report of this.reports) {
            for (const metric of report.metrics.data) {
              report.metrics[metric.category] = report.metrics[metric.category] || {};
              report.metrics[metric.category][metric.name] = metric.value;
            }
          }
          this.numItems = total;
        }
      );
    }

    // Return the status of a node
    //
    // node - The {Object} node
    //
    // Returns: The {String} "failure", "skipped", "noop", "success" or "none"
    //          of `null` if no status known.
    //
    // TODO: This is largely duplicated from nodelist, but can be simplified
    //       significantly when the puppetDB 3.0 v4 API is released and moved to
    //       a common file (puppetDB service likely).
    status(report) {
      if (report === undefined) { return 'glyphicon-refresh spin'; }
      if (report === null) { return 'glyphicon-question-sign'; }
      if (report.status === 'failed') { return 'glyphicon-warning-sign text-danger'; }
      if (report.status === 'changed') { return 'glyphicon-exclamation-sign text-success'; }
      if (report.metrics.events && report.metrics.events.failures > 0) {
        return 'glyphicon-warning-sign text-danger';
      }
      if (report.metrics.events && report.metrics.events.skips > 0) {
        return 'glyphicon-exclamation-sign text-warning';
      }
      if (report.metrics.events && report.metrics.events.noops > 0) {
        return 'glyphicon-exclamation-sign text-info';
      }
      if (report.metrics.events && report.metrics.events.successes > 0) {
        return 'glyphicon-exclamation-sign text-success';
      }
      return 'glyphicon-ok-sign text-muted';
    }
  },
};
