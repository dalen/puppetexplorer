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
          <tr ng-repeat="report in $ctrl.reports" ng-click="$ctrl.selectReport(report.hash)">
            <td title="{{report.end_time}}">
              <span am-time-ago="report.end_time"></span>
            </td>
            <td class="text-center">{{report.events.successes || ""}}</td>
            <td class="text-center">{{report.events.noops || ""}}</td>
            <td class="text-center">{{report.events.skips || ""}}</td>
            <td class="text-center">{{report.events.failures || ""}}</td>
            <td class="text-right">
              <span class="glyphicon" ng-class="$ctrl.status(report)"></span>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination ng-if="$ctrl.numItems > $ctrl.perPage"
        ng-change="$ctrl.fetchReports()" ng-model="$ctrl.page"
        num-pages="$ctrl.numPages" items-per-page="$ctrl.perPage"
        boundary-links="$ctrl.numItems > 250" max-size="5" total-items="$ctrl.numItems"
        rotate="false" previous-text="&lsaquo;" next-text="&rsaquo;"
        first-text="&laquo;" last-text="&raquo;">
    </div>
  `,

  controller: class {
    constructor($location, puppetDB) {
      this.$location = $location;
      this.puppetDB = puppetDB;

      this.page = 1;
      this.perPage = 10;
      this.fetchReports();
    }

    // Fetches reports for node and stores them in reports
    fetchReports() {
      this.reports = this.puppetDB.query(
        'reports',
        ['=', 'certname', this.node],
        {
          include_total: true,
          order_by: JSON.stringify([{ field: 'end_time', order: 'desc' }]),
          offset: this.perPage * (this.page - 1),
          limit: this.perPage,
        },
        (data, total) => {
          this.reports = data;
          this.numItems = total;
        }
      );
    }

    // Switch to events view for a specified report
    selectReport(report) {
      this.$location.search('mode', 'report');
      this.$location.search('report', report);
      return this.$location.path('/events');
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
  },
};
