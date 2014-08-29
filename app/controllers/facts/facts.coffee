angular.module("app").controller "FactsCtrl", class
  constructor: (@$scope, @$rootScope, @$location, @PuppetDB) ->
    @charts = {}
    @getFactNames()
    @$scope.$on('queryChange', @reloadCharts)
    @$scope.$on('$locationChangeSuccess', @syncCharts)
    @syncCharts()

  # Turn a fact path into a string
  #
  # fact - The {Array} fact path
  factPathToString: (path) ->
    str = path.map (pathComponent) ->
      if typeof(pathComponent) == 'number'
        String(pathComponent)
      else
        if /^[.\d]+$/.test(pathComponent)
          "\"#{pathComponent}\""
        else
          pathComponent
    .join('.')

  # Turn a fact path string into a path array
  #
  # This is somewhat naive and assumes that facts don't contain
  # certain characters
  factPathFromString: (name) ->
    name.split('.').map (pathComponent) ->
      if /^\d+$/.test(pathComponent)
        parseInt(pathComponent, 10)
      else if pathComponent[0] == '"'
        pathComponent.slice(1, -1)
      else
        pathComponent

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
      @addChart(@factPathFromString(chart)) unless chart in Object.keys(@charts)

  # Public: Reload all charts
  #
  # Returns: `undefined`
  reloadCharts: =>
    @addChart chart.factPath for chartName, chart of @charts

  # Public: Fetch the names of available facts
  #
  # Returns: `undefined`
  getFactNames: ->
    @PuppetDB.query("fact-paths", { "order-by": angular.toJson([ field: "path", order: "asc" ]) })
    .success (data, status, headers, config) =>
      @factPaths = (fact.path for fact in angular.fromJson(data) when fact.path[0][0] isnt '_')
    .error (data, status, headers, config) ->
      throw new Error(data or "Fetching fact names failed")

  # Public: Add or reload a chart
  #
  # fact - The {Array} fact path to add
  #
  # Returns: `undefined`
  addChart: (fact) ->
    facts = @chartList()
    unless @factPathToString(fact) in facts
      facts.push(@factPathToString(fact))
      @$location.search('facts', facts.join(','))
    @charts[@factPathToString(fact)] =
      factPath: fact
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

    @PuppetDB.parseAndQuery('fact-contents',
      @$location.search().query,
      [ "=", "path", fact ],
      {},
      (data, total) =>
        @setChartData(fact, data)
    )

  # Public: Remove a chart
  #
  # fact - The {String} path of the fact to remove
  #
  # Returns: `undefined`
  deleteChart: (fact) ->
    facts = @chartList()
    facts.splice(facts.indexOf(fact), 1)
    @$location.search('facts', facts.join(',') || null)
    delete @charts[fact]

  # Public: Set the data to be drawn on a chart
  #
  # fact - The {Array} path of the fact to chart
  # data - The {Array} fact values
  #
  # Returns: `undefined`
  setChartData: (fact, data) ->
    factString = @factPathToString(fact)
    @charts[factString].options.colors = [
      '#A1CF64' # green
      '#FFCC66' # yellow
      '#D95C5C' # red
      '#6ECFF5' # blue
      '#564F8A' # purple
      '#00B5AD' # teal
      '#F05940' # orange
    ]
    @charts[factString].options.pieSliceText = 'percent'
    @charts[factString].enableInteractivity = true
    @charts[factString].data = [['Value', 'Number']]

    # Count occurrences of each value (could be done using reduce instead)
    values = {}
    for f in data
      if typeof(f.value) == 'string'
        quotedVal = "\"#{f.value.replace('"', '\\"')}\""
      else
        quotedVal = "#{f.value}"
      values[quotedVal] = values[quotedVal] + 1 || 1

    # Push the values as rows
    for k, v of values
      @charts[factString].data.push([k, v])

    # Always trigger a redraw of charts
    @$rootScope.$broadcast('resizeMsg')

  chartSelect: (fact, item) ->
    value = @charts[fact].data[item.row + 1][0]
    query = @$location.search().query
    if query
      @$location.search('query', "(#{query}) and #{fact}=#{value}")
    else
      @$location.search('query', "#{fact}=#{value}")
