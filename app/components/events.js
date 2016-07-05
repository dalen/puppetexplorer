import moment from 'moment';

export const events = {
  bindings: {
    query: '<',
  },

  template: `
    <tabset>
      <tab heading="Latest report" active="$ctrl.mode.latest" select="$ctrl.setMode('latest')"></tab>
      <tab heading="Date range" active="$ctrl.mode.daterange" select="$ctrl.setMode('daterange')">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="date-from">Date from:</label>
              <div class="input-group">
                <input datepicker-popup type="text" id="date-from" class="form-control" ng-model="dateFrom" ng-change="$ctrl.setFilters()" is-open="dateFromOpen" close-text="Close">
                <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-disabled="latestReport" ng-click="$ctrl.toggleDatePicker($event,'dateFromOpen')"><span class="glyphicon glyphicon-calendar"></span></button>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="date-to">Date to:</label>
              <div class="input-group">
                <input datepicker-popup type="text" id="date-to" class="form-control" ng-model="dateTo" ng-change="$ctrl.setFilters()" is-open="dateToOpen" close-text="Close">
                <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-disabled="latestReport" ng-click="$ctrl.toggleDatePicker($event,'dateToOpen')"><span class="glyphicon glyphicon-calendar"></span></button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </tab>
      <tab heading="Single report" active="$ctrl.mode.report" select="$ctrl.setMode('report')">
        <div class="form-group">
          <label for="report-hash">Report hash</label>
          <input type="text" class="form-control" id="report-hash" ng-model="reportHash" placeholder="Report hash">
        </div>
      </tab>
    </tabset>

    <div class="row" style="margin-top: 10px">
      <div class="col-md-4">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Containing class</h3>
          </div>
          <div class="panel-body">
            <div google-chart chart="containingChart" on-select="$ctrl.onChartSelect('containing_class', containingChart.data, selectedItem)" on-ready="$ctrl.setChartSelection('containing_class', containingChart.data, chartWrapper)"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Resource type</h3>
          </div>
          <div class="panel-body">
            <div google-chart chart="resourceChart" on-select="$ctrl.onChartSelect('resource_type', resourceChart.data, selectedItem)" on-ready="$ctrl.setChartSelection('resource_type', resourceChart.data, chartWrapper)"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Event status</h3>
          </div>
          <div class="panel-body">
            <div google-chart chart="statusChart" on-select="$ctrl.onChartSelect('status', statusChart.data, selectedItem)" on-ready="$ctrl.setChartSelection('status', statusChart.data, chartWrapper)"></div>
          </div>
        </div>
      </div>
    </div>

    <event-list query="$ctrl.eventQuery"></event-list>
  `,

  controller: class {
    constructor($location, puppetDB) {
      this.puppetDB = puppetDB;

      this.mode = {};

      this.setEventQuery();
    }

    $onChanges() {
      this.setEventQuery();
    }

    setEventQuery() {
      this.eventQuery = ['and', ['subquery', 'nodes', this.query], this.createEventQuery()];
    }

    // Create a event query for current filters
    //
    // exclude - A {String} filter to exclude from the generated query
    //
    // Returns: A {Array} puppetDB query
    createEventQuery(exclude = false) {
      const query = ['and'];
      if (this.mode.current === 'latest') {
        query.push(['=', 'latest_report?', true]);
      } else if (this.mode.current === 'report') {
        query.push(['=', 'report', this.reportHash]);
      } else {
        query.push(['>', 'timestamp', moment.utc(this.dateFrom).toISOString()]);
        query.push(['<', 'timestamp', moment.utc(this.dateTo).add(1, 'days').toISOString()]);
      }

      if ((this.containingClass != null) && exclude !== 'containing_class') {
        let cc = this.containingClass;
        if (cc === 'none') {
          cc = null;
        }
        query.push(['=', 'containing_class', cc]);
      }
      if ((this.resourceType != null) && exclude !== 'resource_type') {
        query.push(['=', 'resource_type', this.resourceType]);
      }
      if ((this.status != null) && exclude !== 'status') {
        query.push(['=', 'status', this.status.toLowerCase()]);
      }

      return query;
    }

  },
};
