/* global angular DASHBOARD_PANELS */
import moment from 'moment';
angular.module('app').controller('EventsCtrl', class {
  constructor($scope, $rootScope, $location, PuppetDB) {
    this.setFields = this.setFields.bind(this);
    this.reset = this.reset.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.fetchContainingClasses = this.fetchContainingClasses.bind(this);
    this.fetchResourceCounts = this.fetchResourceCounts.bind(this);
    this.fetchStatusCounts = this.fetchStatusCounts.bind(this);
    this.drawChart = this.drawChart.bind(this);
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.PuppetDB = PuppetDB;
    this.$scope.$on('queryChange', this.reset);
    this.$scope.$on('pageChange', this.fetchEvents);
    this.$scope.$on('$locationChangeSuccess', this.setFields);
    this.$scope.$on('filterChange', this.reset);
    this.$scope.perPage = 50;
    this.mode = {};
    this.setFields();
  }

  // Sets fields values to match the URL parameters
  setFields(event, exclude) {
    this.mode.current = this.$location.search().mode || 'latest';
    this.mode[this.mode.current] = true;
    this.$scope.reportHash = this.$location.search().report;
    this.$scope.dateFrom = this.$location.search().date_from || moment.utc().format('YYYY-MM-DD');
    this.$scope.dateTo = this.$location.search().date_to || moment.utc().format('YYYY-MM-DD');
    return this.reset(event, exclude);
  }

  reset(event, exclude) {
    if (event && event.name === 'pageChange') {
      this.setFields();
    }
    this.$location.search('page', null);
    this.$scope.numItems = undefined;
    this.fetchEvents();
    if (exclude !== 'containing_class') { this.fetchContainingClasses(); }
    if (exclude !== 'resource_type') { this.fetchResourceCounts(); }
    if (exclude !== 'status') { return this.fetchStatusCounts(); }
    return event;
  }

  // Switch mode to 'latest' or 'report'
  // either vieeing latest report of a specified report
  setMode(mode) {
    this.mode.current = mode;
    this.$location.search('mode', mode);
    return this.setFilters();
  }

  // Public: Set URL to match currently selected filters
  setFilters() {
    this.$location.search('report', this.$scope.reportHash);
    this.$location.search('date_from', moment(this.$scope.dateFrom).format('YYYY-MM-DD'));
    this.$location.search('date_to', moment(this.$scope.dateTo).format('YYYY-MM-DD'));
    return this.$rootScope.$broadcast('filterChange');
  }

  // Public: Create a event query for current filters
  //
  // exclude - A {String} filter to exclude from the generated query
  //
  // Returns: A {Array} PuppetDB query
  createEventQuery(exclude = false) {
    const query = ['and'];
    if (this.mode.current === 'latest') {
      query.push(['=', 'latest_report?', true]);
    } else if (this.mode.current === 'report') {
      query.push(['=', 'report', this.$scope.reportHash]);
    } else {
      query.push(['>', 'timestamp', moment.utc(this.$scope.dateFrom).toISOString()]);
      query.push(['<', 'timestamp', moment.utc(this.$scope.dateTo).add(1, 'days').toISOString()]);
    }

    if ((this.$location.search().containing_class != null) && exclude !== 'containing_class') {
      let cc = this.$location.search().containing_class;
      if (cc === 'none') {
        cc = null;
      }
      query.push(['=', 'containing_class', cc]);
    }
    if ((this.$location.search().resource_type != null) && exclude !== 'resource_type') {
      query.push(['=', 'resource_type', this.$location.search().resource_type]);
    }
    if ((this.$location.search().status != null) && exclude !== 'status') {
      query.push(['=', 'status', this.$location.search().status.toLowerCase()]);
    }

    return query;
  }

  // Public: Fetch the list of events for the currect page
  //
  // Returns: `undefined`
  fetchEvents() {
    this.events = undefined;

    this.PuppetDB.parseAndQuery('events',
      this.$location.search().query,
      this.createEventQuery(),
      {
        offset: this.$scope.perPage * ((this.$location.search().page || 1) - 1),
        limit: this.$scope.perPage,
        order_by: angular.toJson([{ field: 'timestamp', order: 'desc' }]),
      },
      (data, total) => {
        this.$scope.numItems = total;
        this.events = data;
      }
    );
  }

  // Public: Toggle the display of a row in the event table
  //
  // event - The {Object} for the event
  //
  // Returns: `undefined`
  toggleRow(event) {
    event.show = !event.show;
  }

  fetchContainingClasses() {
    this.drawChart('containingChart', 'Containing class');
    this.PuppetDB.parseAndQuery('event-counts',
      this.$location.search().query,
      this.createEventQuery('containing_class'),
      {
        summarize_by: 'containing_class',
      },
      (data) => {
        const chartData = [];
        for (const item of data) {
          const key = item.subject.title || 'none';
          const value = item.failures + item.successes + item.noops + item.skips;
          chartData.push([key, value]);
        }
        this.drawChart('containingChart', 'Containing class', chartData);
      }
    );
  }

  fetchResourceCounts() {
    this.drawChart('resourceChart', 'Resource');
    this.PuppetDB.query('events',
      ['extract', [['function', 'count'], 'resource_type'],
        this.PuppetDB.combine(
          this.PuppetDB.parse(this.$location.search().query),
          this.createEventQuery('resource_type')
        ),
        ['group_by', 'resource_type']],
      null,
      (data) => {
        const chartData = data.map(i => [i.resource_type || 'none', i.count]);
        this.drawChart('resourceChart', 'Resource type', chartData);
      }
    );
  }

  fetchStatusCounts() {
    this.drawChart('statusChart', 'Event status');
    this.PuppetDB.query('events',
      ['extract', [['function', 'count'], 'status'],
        this.PuppetDB.combine(
          this.PuppetDB.parse(this.$location.search().query),
          this.createEventQuery('status')
        ),
        ['group_by', 'status']],
      null,
      (data) => {
        const dataHash = {};
        for (const item of data) {
          dataHash[item.status] = item.count;
        }
        const chartData = [
          ['Success', dataHash.success || 0],
          ['Skipped', dataHash.skipped || 0],
          ['Failure', dataHash.failure || 0],
          ['Noop', dataHash.noop || 0],
        ];
        this.drawChart('statusChart', 'Event status', chartData);
      }
    );
  }

  drawChart(name, title, data) {
    let colors;
    let sliceText;
    let enableInteractivity;
    if (data) {
      colors = [
        '#A1CF64', // green
        '#FFCC66', // yellow
        '#D95C5C', // red
        '#6ECFF5', // blue
        '#564F8A', // purple
        '#00B5AD', // teal
        '#F05940', // orange
      ];
      sliceText = 'percent';
      enableInteractivity = true;
    } else {
      colors = ['#BBBBBB'];
      sliceText = 'label';
      enableInteractivity = false;
    }
    this.$scope[name] = {
      type: 'PieChart',
      options: {
        backgroundColor: 'transparent',
        colors,
        pieSliceText: sliceText,
        enableInteractivity,
        height: 250,
        chartArea: {
          width: '100%',
          height: '85%',
        },
      },
      data: [['Type', 'Number']].concat(data || [['Loading', 1]]),
    };
    // Always trigger a redraw of charts
    this.$rootScope.$broadcast('resizeMsg');
  }

  // Public: Return the CSS class event states should correspond to
  //
  // status - The {String} event status
  //
  // Returns: A {String} with the CSS class
  color(status) {
    switch (status) {
      case 'success':
        return 'success';
      case 'noop':
        return 'text-muted';
      case 'failure':
        return 'danger';
      case 'skipped':
        return 'warning';
      default:
        return '';
    }
  }

  // Public: Set the current chart selection on click
  //
  // param - The {String} name of the url parameter
  // data  - The {Object} data values in the chart
  // item  - The {Object} selected item
  //
  // Returns: `undefined`
  onChartSelect(param, data, item) {
    if (item) {
      this.$location.search(param, data[item.row + 1][0]);
    } else {
      this.$location.search(param, null);
    }
    this.$rootScope.$broadcast('filterChange', param);
  }

  // Public: Set the chart selection when the chart is loaded
  //
  // param - The {String} name of the url parameter
  // data  - The {Object} data values in the chart
  // chart - The {Object} ChartWrapper object
  //
  // Returns: `undefined`
  setChartSelection(param, data, chart) {
    if (!chart.getOptions().enableInteractivity) { return; }
    const selected = this.$location.search()[param];
    if (selected != null) {
      let row = null;
      for (let i = 0; i < data.length; i++) {
        const r = data[i];
        if (r[0] === selected) { row = i; }
      }
      if (row) {
        chart.getChart().setSelection([{ row: row - 1 }]);
      }
    }
  }

  toggleDatePicker($event, name) {
    $event.preventDefault();
    $event.stopPropagation();
    this.$scope[name] = !this.$scope[name];
  }

  // Switch to events view for a specified report
  selectReport(report) {
    this.$scope.reportHash = report;
    this.setMode('report');
  }
});
