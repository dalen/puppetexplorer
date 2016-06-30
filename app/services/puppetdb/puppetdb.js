/* global angular PUPPETDB_SERVERS */
import puppetdbquery from 'node-puppetdbquery';
angular.module('app').factory('PuppetDB', ($http, $location, $q) =>
  new class PuppetDB {
    constructor() {
      this.apiVersion = 'v4';
      this.cancel = this.cancel.bind(this);
      this.servers = PUPPETDB_SERVERS.map(srv => srv[0]);
      this.canceller = $q.defer();
    }

    // Public: Get/Set server
    //
    // server - The String name of the server to set
    //
    // Returns: the String current server
    server(server) {
      if (server) {
        return $location.search('server', server);
      }
      return $location.search().server || PUPPETDB_SERVERS[0][0];
    }

    // Public: Get URL of current server
    //
    // Returns: The {String} URL
    serverUrl() {
      for (const server of PUPPETDB_SERVERS) {
        if (server[0] === this.server()) { return server[1]; }
      }
      throw new Error('Server config not found');
    }

    // Public: Get config properties of current server
    //
    // Returns: The {Object} config
    serverConfig() {
      for (const server of PUPPETDB_SERVERS) {
        if (server[0] === this.server()) {
          if (server[2]) {
            return server[2];
          }
          return ({});
        }
      }
      throw new Error('Server config not found');
    }

    // Public: Parse a query
    //
    // query     - The {String} query to parse
    //
    // Returns: The resulting query
    parse(query) {
      if (query) {
        return puppetdbquery.parse(query);
      }
      return null;
    }

    // Public: Basic function to get a path from current server
    //
    // path - The {String} path to get
    // params - A {Object} with query parameters
    //
    // Returns: A promise from $http
    get(path, params = {}) {
      const config = this.serverConfig();
      config.params = params;
      config.timeout = this.canceller.promise;
      return $http.get(`${this.serverUrl()}/${path}`, config);
    }

    // Like get, but for current API query path
    getQuery(path, params = {}) {
      return this.get(`pdb/query/${this.apiVersion}/${path}`, params);
    }

    // Public: Query a endpoint and handle parsing return data and errors
    //
    // endpoint - The {String} endpoint to query
    // params   - The {Object} query parameters
    query(endpoint, query, params = {}, success) {
      params.query = angular.toJson(query);
      return this.handleResponse(this.getQuery(endpoint, params), success);
    }

    // Combine queries together
    combine(...queries) {
      const actualQueries = queries.filter(q => q != null);
      if (actualQueries.length === 0) {
        return null;
      } else if (actualQueries.length === 1) {
        return actualQueries[0];
      }
      return ['and', ...actualQueries];
    }

    // Generically handle a response on a HTTP promise object
    //
    // promise - {HttpPromise}
    // success - {Function} that takes a data and optional total argument
    handleResponse(promise, success) {
      return promise.then(
        (resp) => success(angular.fromJson(resp.data, resp.headers('X-Records'))),
        (resp) => {
          if (resp.status > 0) {
            throw new Error(`Failed to fetch ${resp.config.url}
${resp.status}: ${resp.statusText}`);
          }
        }
      );
    }

    cancel() {
      this.canceller.resolve('user cancelled');
      this.canceller = $q.defer();
    }

    // Public: Combined function to both parse and query PuppetDB.
    //
    // endpoint        - The {String} endpoint to query
    // nodeQuery       - The {String} query to parse
    // additionalQuery - The {Array} a raw API query that is added to the nodeQuery
    // params          - The {Object} additional parameters to the endpoint
    // success         - The {Function} callback on success
    //
    // Returns: The {Promise} from $http
    parseAndQuery(endpoint, nodeQuery, additionalQuery, params = {}, success) {
      // Handle all the parsing of the query and putting them together
      let query = this.combine(this.parse(nodeQuery), additionalQuery);
      if (!query) { // no query and no additional query either
        if (['reports', 'events', 'event-count', 'aggregate-event-count'].includes(endpoint)) {
          // PuppetDB really requires a valid query for some endpoints even
          // if we want to query all. So we just make something up that will
          // match all of them...
          query = ['>', 'timestamp', '1970-01-01T00:00:00.000Z'];
        }
      }

      if (['nodes', 'reports', 'events', 'facts'].includes(endpoint)) {
        params.include_total = true;
      }

      // Start querying
      return this.query(endpoint, query, params, success);
    }

    // Public: Get a bean value, returns a promise just like $http
    //
    // name - The {String} bean name
    //
    // Returns: A promise from $http
    getBean(name) {
      return this.get(`metrics/v1/mbeans/${name}`);
    }

    // Public: Get PuppetDB version, returns a promise just like $http
    //
    // Returns: A promise from $http
    getVersion() {
      return this.get('pdb/meta/v1/version');
    }
  }()
);
