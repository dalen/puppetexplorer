angular.module('app').controller 'DashboardCtrl', class
  constructor: (@$scope, @PuppetDB, @$location) ->
    @getBean('num-nodes', 'activeNodes')
    @getBean('num-resources', 'resources')
    @getBean('avg-resources-per-node', 'avgResources')
    @getBean('pct-resource-dupes', 'resDuplication', 100)

    @$scope.panels = DASHBOARD_PANELS || []
    for panel, i in @$scope.panels
      callback = (panel) ->
        (count) ->
          panel.count = count
      @getNodeCount panel.query, callback(panel)

    @$scope.panelWidth = Math.max(2, 12 / @$scope.panels.length)

  getBean: (name, scopeName, multiply = 1, bean = 'com.puppetlabs.puppetdb.query.population') ->
    @PuppetDB.query("metrics/mbean/#{bean}:type=default,name=#{name}")
      .success (data) =>
        @$scope[scopeName] = (angular.fromJson(data).Value * multiply)
          .toLocaleString()
          .replace(/^(.*\..).*/, "$1")
      .error (data) ->
        console?.log "Could not get #{name} from PuppetDB"

  getNodeCount: (query, callback) ->
    @PuppetDB.parseAndQuery(
      'nodes'
      query
      null
      { limit: 1 }
      (data, total) ->
        callback(total)
      )

  setQuery: (query) ->
    @$location.search('query', query)
    @$location.path "/nodes"
