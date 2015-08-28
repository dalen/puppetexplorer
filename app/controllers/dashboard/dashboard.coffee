angular.module('app').controller 'DashboardCtrl', class
  constructor: (@$scope, @PuppetDB, @$location) ->
    @$scope.$on('queryChange', @loadMetrics)
    @loadMetrics()

  loadMetrics: () =>
    @getBean('num-nodes', 'activeNodes')
    @getBean('num-resources', 'resources')
    @getBean('avg-resources-per-node', 'avgResources')
    @getBean('pct-resource-dupes', 'resDuplication', 100)

    if DASHBOARD_PANELS?
      @$scope.panels = DASHBOARD_PANELS
    else
      @$scope.panels = []
    for panel, i in @$scope.panels
      panel.count = undefined # reset if we switched server
      callback = (panel) ->
        (count) ->
          panel.count = count
      @getNodeCount panel.query, callback(panel)

    @$scope.panelWidth = Math.max(2, Math.floor(12 / @$scope.panels.length))
    @checkVersion()

  getBean: (name, scopeName, multiply = 1, bean = 'puppetlabs.puppetdb.query.population') ->
    @$scope[scopeName] = undefined
    @PuppetDB.getBean("#{bean}:type=default,name=#{name}")
      .success (data) =>
        @$scope[scopeName] = (angular.fromJson(data).Value * multiply)
          .toLocaleString()
          .replace(/^(.*\..).*/, '$1')
      .error (data, status) ->
        unless status == 0
          throw new Error("Could not fetch metric #{name} from PuppetDB")

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
    @$location.path '/nodes'

  checkVersion: () ->
    @PuppetDB.getVersion()
      .success (data) ->
        major = parseInt(data.version.split('.')[0], 10)
        minor = parseInt(data.version.split('.')[1], 10)
        patch = parseInt(data.version.split('.')[2], 10)
        unless major >= 3
          throw new Error('This version of Puppet Explorer requires PuppetDB version 3.0.0+' +
            ", you are running PuppetDB #{data.version}")
