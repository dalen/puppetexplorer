angular.module("app").controller "EventsCtrl", class
  constructor: (@$scope, @$rootScope, @$location, @PuppetDB) ->
    @$scope.$on('queryChange', @reset)
    @$scope.$on('pageChange', @fetchEvents)
    @$scope.$on('$locationChangeSuccess', @setFields)
    @$scope.$on('filterChange', @reset)
    @$scope.perPage = 50
    @mode = {}
    @setFields()

  # Sets fields values to match the URL parameters
  setFields: (event, exclude) =>
    @mode.current = @$location.search().mode || 'latest'
    @mode[@mode.current] = true
    @$scope.reportHash = @$location.search().report
    @$scope.dateFrom = @$location.search().date_from || moment.utc().format('YYYY-MM-DD')
    @$scope.dateTo = @$location.search().date_to || moment.utc().format('YYYY-MM-DD')
    @reset(event, exclude)

  reset: (event, exclude) =>
    if event && event.name == 'pageChange'
      console.log(event)
      @setFields()
    @$location.search('page', null)
    @$scope.numItems = undefined
    @fetchEvents()
    @fetchContainingClasses() unless exclude == 'containing_class'
    @fetchResourceCounts() unless exclude == 'resource_type'
    @fetchStatusCounts() unless exclude == 'status'

  setMode: (mode) ->
    @mode.current = mode
    @$location.search('mode', mode)
    @setFilters()

  # Public: Set URL to match currently selected filters
  setFilters: () ->
    @$location.search('report', @$scope.reportHash)
    @$location.search('date_from', moment(@$scope.dateFrom).format('YYYY-MM-DD'))
    @$location.search('date_to', moment(@$scope.dateTo).format('YYYY-MM-DD'))
    @$rootScope.$broadcast('filterChange')

  # Public: Create a event query for current filters
  #
  # exclude - A {String} filter to exclude from the generated query
  #
  # Returns: A {Array} PuppetDB query
  createEventQuery: (exclude = false) ->
    query = ["and"]
    if @mode.current == 'latest'
      query.push ["=", "latest-report?", true]
    else if @mode.current == 'report'
      query.push ["=", "report", @$scope.reportHash]
    else
      moment = require('moment')
      query.push [">", "timestamp", moment.utc(@$scope.dateFrom).toISOString()]
      query.push ["<", "timestamp", moment.utc(@$scope.dateTo).add(1, 'days').toISOString()]

    if @$location.search().containing_class? and exclude != 'containing_class'
      cc = @$location.search().containing_class
      if cc is 'none'
        cc = null
      query.push([ "=", "containing-class", cc])
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
        offset: @$scope.perPage * ((@$location.search().page || 1) - 1)
        limit: @$scope.perPage
        "order-by": angular.toJson([ field: "timestamp", order: "desc" ]),
      }
      (data, total) =>
        @$scope.numItems = total
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
        backgroundColor: 'transparent'
        colors: colors
        pieSliceText: sliceText
        enableInteractivity: enableInteractivity
        height: 250
        chartArea:
          width: "100%"
          height: "85%"
      data: [['Type', 'Number']].concat(data)
    # Always trigger a redraw of charts
    @$rootScope.$broadcast('resizeMsg')

  # Public: Return the CSS class event states should correspond to
  #
  # status - The {String} event status
  #
  # Returns: A {String} with the CSS class
  color: (status) ->
    switch status
      when "success"
        "success"
      when "noop"
        "text-muted"
      when "failure"
        "danger"
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
    return unless chart.getOptions().enableInteractivity
    selected = @$location.search()[param]
    if selected?
      row = null
      for r, i in data
        row = i if r[0] == selected
      if row
        chart.getChart().setSelection([{row: row - 1}])

  toggleDatePicker: ($event, name) ->
    $event.preventDefault()
    $event.stopPropagation()
    @$scope[name] = !@$scope[name]

  # Switch to events view for a specified report
  selectReport: (report) ->
    @$scope.reportHash = report
    @setMode('report')
