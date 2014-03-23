angular.module("app").controller "EventsCtrl", class
  constructor: (@$scope, @$rootScope, @$location, @PuppetDB, @Pagination) ->
    @$scope.$on('queryChange', @reset)
    @$scope.$on('pageChange', @fetchEvents)
    @$scope.$on('filterChange', @reset)
    @$scope.latestReport = @$location.search().latest != 'false'
    @$scope.dateFrom = @$location.search().date_from || moment.utc().format('YYYY-MM-DD')
    @$scope.dateTo = @$location.search().date_to || moment.utc().format('YYYY-MM-DD')
    @reset()

  reset: (event, exclude) =>
    @Pagination.reset()
    @fetchEvents()
    @fetchContainingClasses() unless exclude == 'containing_class'
    @fetchResourceCounts() unless exclude == 'resource_type'
    @fetchStatusCounts() unless exclude == 'status'

  setFilters: () ->
    if @$scope.latestReport
      @$location.search('latest', null)
    else
      @$location.search('latest', 'false')
    @$location.search('date_from', @$scope.dateFrom)
    @$location.search('date_to', @$scope.dateTo)
    @$rootScope.$broadcast('filterChange')

  # Public: Create a event query for current filters
  #
  # exclude - A {String} filter to exclude from the generated query
  #
  # Returns: A {Array} PuppetDB query
  createEventQuery: (exclude = false) ->
    query = ["and"]
    if @$scope.latestReport
      query.push ["=", "latest-report?", true]
    else
      moment = require('moment')
      query.push [">", "timestamp", moment.utc(@$scope.dateFrom).toISOString()]
      query.push ["<", "timestamp", moment.utc(@$scope.dateTo).add('days', 1).toISOString()]

    if @$location.search().containing_class? and exclude != 'containing_class'
      query.push([ "=", "containing-class", @$location.search().containing_class])
    if @$location.search().resource_type? and exclude != 'resource_type'
      query.push([ "=", "resource-type", @$location.search().resource_type])
    if @$location.search().status? and exclude != 'status'
      query.push([ "=", "status", @$location.search().status.toLowerCase()])

    query

  # Public: Fetch the list of events for the currect page
  #
  # Returns: `undefined`
  fetchEvents: =>
    @events = undefined

    @PuppetDB.parseAndQuery("events",
      @$location.search().query,
      @createEventQuery(),
      {
        offset: @Pagination.offset(),
        limit: @Pagination.perPage,
        "order-by": angular.toJson([ field: "timestamp", order: "desc" ]),
      }
      (data, total) =>
        @Pagination.numItems(total)
        @events = data
    )

  # Public: Toggle the display of a row in the event table
  #
  # event - The {Object} for the event
  #
  # Returns: `undefined`
  toggleRow: (event) ->
    event.show = !event.show

  fetchContainingClasses: =>
    @drawChart('containingChart', 'Containing class')
    @PuppetDB.parseAndQuery("event-counts",
      @$location.search().query
      @createEventQuery('containing_class')
      {
        'summarize-by': 'containing-class'
      }
      (data, total) =>
        chartData = []
        for item in data
          key = item.subject.title || "none"
          value = item.failures + item.successes + item.noops + item.skips
          chartData.push [key, value]
        @drawChart('containingChart', 'Containing class', chartData)
    )

  fetchResourceCounts: =>
    @drawChart('resourceChart', 'Resource')
    @PuppetDB.parseAndQuery("event-counts",
      @$location.search().query
      @createEventQuery('resource_type')
      {
        'summarize-by': 'resource'
      }
      (data, total) =>
        chartData = []
        types = {}
        for item in data
          types[item.subject.type] ||= 0
          types[item.subject.type] += item.failures + item.successes + item.noops + item.skips
        for key, value of types
          chartData.push [key, value]
        @drawChart('resourceChart', 'Resource type', chartData)
    )

  fetchStatusCounts: =>
    @drawChart('statusChart', 'Event status')
    @PuppetDB.parseAndQuery("aggregate-event-counts",
      @$location.search().query
      @createEventQuery('status')
      {
        'summarize-by': 'resource'
      }
      (data, total) =>
        chartData = [
          ['Success', data.successes]
          ['Skipped', data.skips]
          ['Failure', data.failures]
          ['Noop', data.noops]
        ]
        @drawChart('statusChart', 'Event status', chartData)
    )

  drawChart: (name, title, data) =>
    if data
      colors = [
        '#A1CF64' # green
        '#FFCC66' # yellow
        '#D95C5C' # red
        '#6ECFF5' # blue
        '#564F8A' # purple
        '#00B5AD' # teal
        '#F05940' # orange
      ]
      sliceText = 'percent'
      enableInteractivity = true
    else
      colors = ['#BBBBBB']
      sliceText = 'label'
      data = [['Loading', 1]]
      enableInteractivity = false
    @$scope[name] =
      type: 'PieChart'
      options:
        title: title
        titleTextStyle:
          fontSize: 15
        colors: colors
        pieSliceText: sliceText
        enableInteractivity: enableInteractivity
        height: 250
        chartArea:
          width: "100%"
          height: "85%"
      data: [['Type', 'Number']].concat(data)

  # Public: Return the CSS class event states should correspond to
  #
  # status - The {String} event status
  #
  # Returns: A {String} with the CSS class
  color: (status) ->
    switch status
      when "success"
        "positive"
      when "noop"
        "disabled"
      when "failure"
        "negative"
      when "skipped"
        "warning"
      else
        ""

  # Public: Set the current chart selection on click
  #
  # param - The {String} name of the url parameter
  # data  - The {Object} data values in the chart
  # item  - The {Object} selected item
  #
  # Returns: `undefined`
  onChartSelect: (param, data, item) ->
    if item
      @$location.search(param, data[item.row + 1][0])
    else
      @$location.search(param, null)
    @$rootScope.$broadcast('filterChange', param)

  # Public: Set the chart selection when the chart is loaded
  #
  # param - The {String} name of the url parameter
  # data  - The {Object} data values in the chart
  # chart - The {Object} ChartWrapper object
  #
  # Returns: `undefined`
  setChartSelection: (param, data, chart) ->
    selected = @$location.search()[param]
    if selected?
      row = null
      for r, i in data
        row = i if r[0] == selected
      chart.getChart().setSelection([{row: row - 1}])
