angular.module("app").controller "NodeListCtrl", class
  constructor: (@$location, @$scope, @PuppetDB) ->
    # Reload nodes if either the page changes
    @$scope.$on('pageChange', @fetchNodes)
    # Reset pagination and reload nodes if query changes
    @$scope.$on('queryChange', @reset)
    @$scope.perPage = 50
    @reset()

  reset: =>
    @$location.search('page', null)
    @$scope.numItems = undefined
    @fetchNodes()

  # Public: Fetch the list of nodes for the current query
  #
  # Returns: `undefined`
  fetchNodes: =>
    @nodes = undefined
    @PuppetDB.parseAndQuery(
      "nodes"
      @$location.search().query
      null
      {
        offset: @$scope.perPage * ((@$location.search().page || 1) - 1)
        limit: @$scope.perPage
        "order-by": angular.toJson([field: "certname", order: "asc"])
      }
      (data, total) =>
        @$scope.numItems = total
        @nodes = data
        for node in @nodes
          @fetchNodeEventCount(node)
          @fetchNodeStatus(node)
        if @$location.search().node?
          @fetchSelectedNode()
      )

  # Public: Fetch node event counts
  #
  # node - The {Object} node to fetch event counts for
  #
  # Returns: `undefined`
  fetchNodeEventCount: (node) =>
    @PuppetDB.parseAndQuery(
      "event-counts"
      null
      ["and", ["=", "certname", node.certname], ["=", "latest-report?", true]]
      {
        'summarize-by': 'certname'
        'order-by': angular.toJson([field: "certname", order: "asc"])
      }
      do (node) ->
        (data, total) ->
          if data.length
            node.events = data[0]
          else # The node didn't have any events
            node.events =
              failures: 0
              skips: 0
              noops: 0
              successes: 0
      )

  # Public: Fetch node report status
  #
  # node - The {Object} node to fetch status for
  #
  # Returns: `undefined`
  fetchNodeStatus: (node) =>
    @PuppetDB.parseAndQuery(
      "reports"
      null
      ["=", "certname", node.certname]
      {
        'order-by': angular.toJson([field: "receive-time", order: "desc"])
        'limit': 1
      }
      do (node) ->
        (data, total) ->
          if data.length
            node.report = data[0]
          else # The node didn't have any report
            node.report = null
      )

  # Public: Fetch facts for a node and store them in it
  #
  # node - The node {Object}
  #
  # Returns: `undefined`
  fetchNodeFacts: (node) =>
    return if node.facts?
    @PuppetDB.parseAndQuery(
      "fact-contents"
      null
      ["=", "certname", node.certname]
      { 'order-by': angular.toJson([field: "name", order: "asc"]) }
      do (node) ->
        (data, total) ->
          node.facts = data.filter((fact) ->
            fact.name[0] isnt '_'
          ).map((fact) ->
            # insert some spaces to break lines
            fact.value = String(fact.value).replace(/(.{25})/g,"\u200B$1")
            fact
          )
      )

  # Public: Fetch the currently selected node
  #
  # Returns: `undefined`
  fetchSelectedNode: () =>
    for node in @nodes
      if node.certname == @$location.search().node
        @selectNode(node)


  # Public: Get the list of important facts to show in detail view
  #
  # Returns: A {Array} of important facts {String}.
  importantFacts: (node) ->
    node.facts.filter((fact) ->
      NODE_FACTS.indexOf(fact.name) != -1
    ).sort((a,b) -> NODE_FACTS.indexOf(a.name) - NODE_FACTS.indexOf(b.name))

  # Public: Select a node to show info for
  #
  # node - The node {Object}
  #
  # Returns: `undefined`
  selectNode: (node) =>
    if @selectedNode == node
      @$location.search('node', null)
      @selectedNode = null
    else
      @$location.search('node', node.certname)
      @selectedNode = node
      unless node.facts?
        @fetchNodeFacts(node)

  # Public: set the query to find a node and show events for it
  #
  # node - The {String} name of the node
  #
  # Returns: `undefined`
  showEvents: (node) ->
    @$location.search "query", "\"#{node}\""
    @$location.path "/events"

  # Public: Return the status of a node
  #
  # node - The {Object} node
  #
  # Returns: The {String} "failure", "skipped", "noop", "success" or "none"
  #          of `null` if no status known.
  nodeStatus: (node) ->
    return 'glyphicon-refresh spin' if node.report == undefined
    return 'glyphicon-question-sign' if node.report == null
    return 'glyphicon-warning-sign text-danger' if node.report.status == 'failed'
    return 'glyphicon-exclamation-sign text-success' if node.report.status == 'changed'
    return 'glyphicon-warning-sign text-danger' if node.events?.failures > 0
    return 'glyphicon-exclamation-sign text-warning' if node.events?.skips > 0
    return 'glyphicon-exclamation-sign text-info' if node.events?.noops > 0
    return 'glyphicon-exclamation-sign text-success' if node.events?.successes > 0
    return 'glyphicon-ok-sign text-muted'

  # Return if a node is unresponsive or not
  nodeUnresponsive: (node) ->
    return true unless node['report-timestamp']?
    if UNRESPONSIVE_HOURS?
      hours = UNRESPONSIVE_HOURS
    else
      hours = 2
    return moment(node['report-timestamp']).isBefore(moment.utc().subtract(hours,'hours'))
