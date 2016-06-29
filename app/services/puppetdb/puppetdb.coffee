angular.module('app').factory 'PuppetDB', ($http, $location, $q) ->
  new class PuppetDB

    apiVersion: 'v4'

    constructor: ->
      @servers = PUPPETDB_SERVERS.map (srv) -> srv[0]
      @puppetdbquery = require('node-puppetdbquery')
      @canceller = $q.defer()

    # Public: Get/Set server
    #
    # server - The String name of the server to set
    #
    # Returns: the String current server
    server: (server) ->
      if server
        $location.search 'server', server
      else
        $location.search().server or
          PUPPETDB_SERVERS[0][0]

    # Public: Get URL of current server
    #
    # Returns: The {String} URL
    serverUrl: () ->
      for server in PUPPETDB_SERVERS
        return server[1] if server[0] == @server()

    # Public: Get config properties of current server
    #
    # Returns: The {Object} config
    serverConfig: () ->
      for server in PUPPETDB_SERVERS
        if server[0] == @server()
          if server[2]
            return server[2]
          else
            return {}

    # Public: Parse a query
    #
    # query     - The {String} query to parse
    #
    # Returns: The resulting query
    parse: (query) ->
      if query
        @puppetdbquery.parse query
      else
        null

    # Public: Basic function to get a path from current server
    #
    # path - The {String} path to get
    # params - A {Object} with query parameters
    #
    # Returns: A promise from $http
    get: (path, params = {}) ->
      config = @serverConfig()
      config.params = params
      config.timeout = @canceller.promise
      $http.get("#{@serverUrl()}/#{path}", config)

    # Like get, but for current API query path
    getQuery: (path, params = {}) ->
      @get("pdb/query/#{@apiVersion}/#{path}", params)

    # Public: Query a endpoint and handle parsing return data and errors
    #
    # endpoint - The {String} endpoint to query
    # params   - The {Object} query parameters
    query: (endpoint, query, params = {}, success) ->
      params.query = angular.toJson(query)
      @handleResponse(@getQuery(endpoint, params), success)

    # Combine queries together
    combine: (queries...) ->
      queries = queries.filter (q) -> q?
      if queries.length == 0
        null
      else if queries.length == 1
        queries[0]
      else
        ['and', queries...]

    # Generically handle a response on a HTTP promise object
    #
    # promise - {HttpPromise}
    # success - {Function} that takes a data and optional total argument
    handleResponse: (promise, success) ->
      promise.then(
        (resp) ->
          success(angular.fromJson resp.data, resp.headers 'X-Records')
        (resp) ->
          throw new Error("Failed to fetch #{resp.config.url}\n#{resp.status}: #{resp.statusText}") unless resp.status <= 0
      )

    cancel: =>
      @canceller.resolve('user cancelled')
      @canceller = $q.defer()

    # Public: Combined function to both parse and query PuppetDB.
    #
    # endpoint        - The {String} endpoint to query
    # nodeQuery       - The {String} query to parse
    # additionalQuery - The {Array} a raw API query that is added to the nodeQuery
    # params          - The {Object} additional parameters to the endpoint
    # success         - The {Function} callback on success
    #
    # Returns: The {Promise} from $http
    parseAndQuery: (endpoint, nodeQuery, additionalQuery, params = {}, success) ->
      # Handle all the parsing of the query and putting them together
      if nodeQuery
        query = @parse nodeQuery
      else
        query = null
      query = @combine query, additionalQuery
      unless query # no query and no additional query either
        if endpoint in ['reports', 'events', 'event-count', 'aggregate-event-count']
          # PuppetDB really requires a valid query for some endpoints even
          # if we want to query all. So we just make something up that will
          # match all of them...
          query = [ '>', 'timestamp', '1970-01-01T00:00:00.000Z' ]

      if endpoint in ['nodes', 'reports', 'events', 'facts']
        params['include_total'] = true

      # Start querying
      @query endpoint, query, params, success

    # Public: Get a bean value, returns a promise just like $http
    #
    # name - The {String} bean name
    #
    # Returns: A promise from $http
    getBean: (name) ->
      @get("metrics/v1/mbeans/#{name}")

    # Public: Get PuppetDB version, returns a promise just like $http
    #
    # Returns: A promise from $http
    getVersion: ->
      @get('pdb/meta/v1/version')
