angular.module('app').controller 'NodeListCtrl', class
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
      'nodes'
      @$location.search().query
      null
      {
        offset: @$scope.perPage * ((@$location.search().page || 1) - 1)
        limit: @$scope.perPage
        order_by: angular.toJson([field: 'certname', order: 'asc'])
      }
      (data, total) =>
        @$scope.numItems = total
        @nodes = data
        for node in @nodes
          @fetchNodeEventCount(node)
        if @$location.search().node?
          @fetchSelectedNode()
      )

  # Public: Fetch node event counts
  #
  # node - The {Object} node to fetch event counts for
  #
  # Returns: `undefined`
  fetchNodeEventCount: (node) =>
    @PuppetDB.query(
      'event-counts'
      ['and', ['=', 'certname', node.certname], ['=', 'latest_report?', true]]
      {
        summarize_by: 'certname'
        order_by: angular.toJson([field: 'certname', order: 'asc'])
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

  # Public: Select a node to show info for
  #
  # node - The node {Object}
  #
  # Returns: `undefined`
  selectNode: (node) =>
    @$location.path "/node/#{node.certname}"

  # Public: set the query to find a node and show events for it
  #
  # node - The {String} name of the node
  #
  # Returns: `undefined`
  showEvents: (node) ->
    @$location.search 'query', "\"#{node}\""
    @$location.path '/events'

  # Public: Return the status of a node
  #
  # node - The {Object} node
  #
  # Returns: The {String} "failure", "skipped", "noop", "success" or "none"
  #          of `null` if no status known.
  nodeStatus: (node) ->
    switch node.latest_report_status
      when 'failed' then 'glyphicon-warning-sign text-danger'
      when 'changed' then 'glyphicon-exclamation-sign text-success'
      when 'unchanged' then 'glyphicon-exclamation-sign text-success'
      else 'glyphicon-question-sign'

  # Return if a node is unresponsive or not
  nodeUnresponsive: (node) ->
    return true unless node.report_timestamp?
    if UNRESPONSIVE_HOURS?
      hours = UNRESPONSIVE_HOURS
    else
      hours = 2
    return moment(node.report_timestamp).isBefore(moment.utc().subtract(hours,'hours'))
