angular.module("app").controller "FactsCtrl", class
  constructor: (@$scope, @$rootScope, @$location, @PuppetDB) ->
    @charts = {}
    @getFactNames()
    @$scope.$on('queryChange', @reloadCharts)
    @$scope.$on('$locationChangeSuccess', @syncCharts)
    @syncCharts()

  # Public: Get the list of currently active charts
  #
  # Returns: An {Array} of active charts
  chartList: ->
    @$location.search().facts?.split(',') || []

  # Public: Sync the charts object with the list of charts to display
  #
  # Returns: `undefined`
  syncCharts: =>
    chartList = @chartList()
    for chart in Object.keys(@charts)
      delete @charts[chart] unless chart in chartList
    for chart in chartList
      @addChart(chart) unless chart in Object.keys(@charts)

  # Public: Reload all charts
  #
  # Returns: `undefined`
  reloadCharts: =>
    @addChart fact for fact in @chartList()

  # Public: Fetch the names of available facts
  #
  # Returns: `undefined`
  getFactNames: ->
    @PuppetDB.query("fact-names")
    .success (data, status, headers, config) =>
      @factNames = (fact for fact in angular.fromJson(data) when fact[0] isnt '_')
    .error (data, status, headers, config) ->
      throw new Error(data or "Fetching fact names failed")

  # Public: Add or reload a chart
  #
  # fact - The {String} fact name to add
  #
  # Returns: `undefined`
  addChart: (fact) ->
    facts = @chartList()
    unless fact in facts
      facts.push(fact)
      @$location.search('facts', facts.join(','))
    @charts[fact] =
      type: 'PieChart'
      options:
        backgroundColor: 'transparent'
        width: 450
        height: 300
        chartArea:
          width: "100%"
          height: "100%"
          left: 10
          top: 20
        colors: ['#BBBBBB']
        pieSliceText: 'label'
        enableInteractivity: false
      data: [['Value', 'Number'], ['Loading', 1]]

    @PuppetDB.parseAndQuery('facts',
      @$location.search().query,
      [ "=", "name", fact ],
      {},
      (data, total) =>
        @setChartData(fact, data)
    )

  # Public: Remove a chart
  #
  # fact - The {String} name of the fact to remove
  #
  # Returns: `undefined`
  deleteChart: (fact) ->
    facts = @chartList()
    facts.splice(facts.indexOf(fact), 1)
    @$location.search('facts', facts.join(',') || null)
    delete @charts[fact]

  # Public: Set the data to be drawn on a chart
  #
  # fact - The {String} name of the chart
  # data - The {Array} fact values
  #
  # Returns: `undefined`
  setChartData: (fact, data) ->
    @charts[fact].options.colors = [
      '#A1CF64' # green
      '#FFCC66' # yellow
      '#D95C5C' # red
      '#6ECFF5' # blue
      '#564F8A' # purple
      '#00B5AD' # teal
      '#F05940' # orange
    ]
    @charts[fact].options.pieSliceText = 'percent'
    @charts[fact].enableInteractivity = true
    @charts[fact].data = [['Value', 'Number']]

    # Count occurrences of each value (could be done using reduce instead)
    values = {}
    for f in data
      values[f.value] = values[f.value] + 1 || 1

    # Push the values as rows
    for k, v of values
      @charts[fact].data.push([k, v])

    # Always trigger a redraw of charts
    @$rootScope.$broadcast('resizeMsg')

  chartSelect: (fact, item) ->
    value = @charts[fact].data[item.row + 1][0]
      .replace('\\', '\\\\')
      .replace('"', '\\"')
    query = @$location.search().query
    if query
      @$location.search('query', "(#{query}) and #{fact}=\"#{value}\"")
    else
      @$location.search('query', "#{fact}=\"#{value}\"")
