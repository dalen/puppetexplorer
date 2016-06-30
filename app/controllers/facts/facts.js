/* global angular */
angular.module('app').controller('FactsCtrl', class {
  constructor($scope, $rootScope, $location, PuppetDB) {
    this.syncCharts = this.syncCharts.bind(this);
    this.reloadCharts = this.reloadCharts.bind(this);
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.PuppetDB = PuppetDB;
    this.charts = new Map();
    this.getFactNames();
    this.$scope.$on('queryChange', this.reloadCharts);
    this.$scope.$on('$locationChangeSuccess', this.syncCharts);
    this.syncCharts();
  }

  // Turn a fact path into a string
  //
  // fact - The {Array} fact path
  factPathToString(path) {
    return path.map((pathComponent) => {
      if (typeof(pathComponent) === 'number') {
        return String(pathComponent);
      }
      if (/^[.\d]+$/.test(pathComponent)) {
        return `\"${pathComponent}\"`;
      }
      return pathComponent;
    }).join('.');
  }

  // Turn a fact path string into a path array
  //
  // This is somewhat naive and assumes that facts don't contain
  // certain characters
  factPathFromString(name) {
    return name.split('.').map((pathComponent) => {
      if (/^\d+$/.test(pathComponent)) {
        return parseInt(pathComponent, 10);
      } else if (pathComponent[0] === '"') {
        return pathComponent.slice(1, -1);
      }
      return pathComponent;
    });
  }

  // Public: Get the list of currently active charts
  //
  // Returns: An {Array} of active charts
  chartList() {
    if (this.$location.search().facts) {
      return this.$location.search().facts.split(',');
    }
    return [];
  }

  // Check if a chart is activated or not
  //
  // Returns: A {Boolean} indicating if the chart is active
  chartActive(chart) {
    return this.chartList().indexOf(this.factPathToString(chart)) !== -1;
  }

  // Public: Sync the charts object with the list of charts to display
  //
  // Returns: `undefined`
  syncCharts() {
    const chartList = this.chartList();
    for (const chart of Object.keys(this.charts)) {
      if (chartList.includes(chart)) { delete this.charts[chart]; }
    }
    for (const chart of chartList) {
      if (!Object.keys(this.charts).includes(chart)) {
        this.addChart(this.factPathFromString(chart));
      }
    }
  }

  // Public: Reload all charts
  //
  // Returns: `undefined`
  reloadCharts() {
    for (const [, chart] of this.charts) {
      this.addChart(chart.factPath);
    }
  }

  // Public: Fetch the names of available facts
  //
  // Returns: `undefined`
  getFactNames() {
    this.PuppetDB.query('fact-paths',
      null,
      { order_by: angular.toJson([{ field: 'path', order: 'asc' }]) },
      data => {
        this.factPaths = angular.fromJson(data).filter(fact => fact.path[0][0] !== '_')
          .map(fact => fact.path);
      }
      );
  }

  // Public: Toggle display of a chart
  toggleChart(fact) {
    if (this.chartActive(fact)) {
      this.deleteChart(this.factPathToString(fact));
    } else {
      this.addChart(fact);
    }
  }

  // Public: Add or reload a chart
  //
  // fact - The {Array} fact path to add
  //
  // Returns: `undefined`
  addChart(fact) {
    const facts = this.chartList();
    if (!facts.includes(this.factPathToString(fact))) {
      facts.push(this.factPathToString(fact));
      this.$location.search('facts', facts.join(','));
    }
    this.charts[this.factPathToString(fact)] = {
      factPath: fact,
      type: 'PieChart',
      options: {
        backgroundColor: 'transparent',
        width: 450,
        height: 300,
        chartArea: {
          width: '100%',
          height: '100%',
          left: 10,
          top: 20,
        },
        colors: ['#BBBBBB'],
        pieSliceText: 'label',
        enableInteractivity: false,
      },
      data: [['Value', 'Number'], ['Loading', 1]],
    };

    return this.PuppetDB.parseAndQuery('fact-contents',
      this.$location.search().query,
      ['=', 'path', fact],
      {},
      (data) => { this.setChartData(fact, data); }
    );
  }

  // Public: Remove a chart
  //
  // fact - The {String} path of the fact to remove
  //
  // Returns: `undefined`
  deleteChart(fact) {
    const facts = this.chartList();
    facts.splice(facts.indexOf(fact, 1));
    this.$location.search('facts', facts.join(',') || null);
    return delete this.charts[fact];
  }

  // Public: Set the data to be drawn on a chart
  //
  // fact - The {Array} path of the fact to chart
  // data - The {Array} fact values
  //
  // Returns: `undefined`
  setChartData(fact, data) {
    const factString = this.factPathToString(fact);
    this.charts[factString].options.colors = [
      '#A1CF64', // green
      '#FFCC66', // yellow
      '#D95C5C', // red
      '#6ECFF5', // blue
      '#564F8A', // purple
      '#00B5AD', // teal
      '#F05940', // orange
    ];
    this.charts[factString].options.pieSliceText = 'percent';
    this.charts[factString].options.enableInteractivity = true;
    this.charts[factString].data = [['Value', 'Number']];

    // Count occurrences of each value
    const values = new Map();
    for (const f of data) {
      let quotedVal;
      if (typeof(f.value) === 'string') {
        quotedVal = `\"${f.value.replace('"', '\\"')}\"`;
      } else {
        quotedVal = `${f.value}`;
      }
      values[quotedVal] = values[quotedVal] + 1 || 1;
    }

    // Push the values as rows
    for (const k of values) {
      const v = values[k];
      this.charts[factString].data.push([k, v]);
    }

    // Always trigger a redraw of charts
    return this.$rootScope.$broadcast('resizeMsg');
  }

  chartSelect(fact, item) {
    const value = this.charts[fact].data[item.row + 1][0];
    const { query } = this.$location.search();
    if (query) {
      this.$location.search('query', `(${query}) and ${fact}=${value}`);
    } else {
      this.$location.search('query', `${fact}=${value}`);
    }
  }
});
