angular.module("app").controller "NodeDetailCtrl", class
  constructor: (@$location, @$routeParams, @$scope, @PuppetDB) ->
    @node = @$routeParams.node
    # Reload nodes if either the page changes
    @$scope.$on('pageChange', @fetchReports)
    @$scope.perPage = 10
    @reset()

  reset: =>
    @reports = undefined
    @$location.search('page', null)
    @$scope.numItems = undefined
    @fetchReports()
    @fetchFacts()

  # Public: Fetches reports for node and stores them in @reports
  fetchReports: () =>
    @reports = @PuppetDB.parseAndQuery(
      "reports"
      @$location.search().query
      ["=", "certname", @node]
      {
        'order-by': angular.toJson([field: "end-time", order: "desc"])
        'offset': @$scope.perPage * ((@$location.search().page || 1) - 1)
        'limit': @$scope.perPage
      }
      (data, total) =>
        @reports = data
        @$scope.numItems = total
        @reports.forEach (report) =>
          @PuppetDB.parseAndQuery(
            "event-counts"
            null
            ["=", "report", report.hash]
            {
              'summarize-by': 'certname'
            }
            (data, total) ->
              report.events = data[0]
            )
      )

  # Public: Fetch facts and store them in @facts
  #
  # Returns: `undefined`
  fetchFacts: () =>
    @PuppetDB.parseAndQuery(
      "fact-contents"
      null
      ["=", "certname", @node]
      { 'order-by': angular.toJson([field: "name", order: "asc"]) }
      (data, total) =>
        @facts = data.filter((fact) ->
          fact.name[0] isnt '_'
        ).map((fact) ->
          # insert some spaces to break lines
          fact.value = String(fact.value).replace(/(.{25})/g,"\u200B$1")
          fact
        )
      )

  # Public: Get the list of important facts to show in detail view
  #
  # Returns: A {Array} of important facts {String}.
  importantFacts: () ->
    @facts.filter((fact) ->
      NODE_FACTS.indexOf(fact.name) != -1
    ).sort((a,b) -> NODE_FACTS.indexOf(a.name) - NODE_FACTS.indexOf(b.name))

  # Public: Return the status of a node
  #
  # node - The {Object} node
  #
  # Returns: The {String} "failure", "skipped", "noop", "success" or "none"
  #          of `null` if no status known.
  #
  # TODO: This is largely duplicated from nodelist, but can be simplified
  #       significantly when the PuppetDB 3.0 v4 API is released and moved to
  #       a common file (PuppetDB service likely).
  status: (report) ->
    return 'glyphicon-refresh spin' if report == undefined
    return 'glyphicon-question-sign' if report == null
    return 'glyphicon-warning-sign text-danger' if report.status == 'failed'
    return 'glyphicon-exclamation-sign text-success' if report.status == 'changed'
    return 'glyphicon-warning-sign text-danger' if report.events?.failures > 0
    return 'glyphicon-exclamation-sign text-warning' if report.events?.skips > 0
    return 'glyphicon-exclamation-sign text-info' if report.events?.noops > 0
    return 'glyphicon-exclamation-sign text-success' if report.events?.successes > 0
    return 'glyphicon-ok-sign text-muted'

  # Switch to events view for a specified report
  selectReport: (report) ->
    @$location.search "mode", "report"
    @$location.search "report", report
    @$location.path "/events"
