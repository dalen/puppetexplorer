import puppetdbquery from 'node-puppetdbquery';

export default class PuppetDB {
  // Combine queries together
  static combine(...queries) {
    const actualQueries = queries.filter(q => q != null);
    if (actualQueries.length === 0) {
      return null;
    } else if (actualQueries.length === 1) {
      return actualQueries[0];
    }
    return ['and', ...actualQueries];
  }

  // Parse a query
  static parse(query) {
    if (query) {
      return puppetdbquery.parse(query);
    }
    return null;
  }

  // Get URL of the named server
  static serverUrl(name, servers) {
    return servers.find((server) => server.name === name).url;
  }

  // Get a URL from server
  static get(server, servers, path) {
    return fetch(`${this.serverUrl(server, servers)}${path}`)
    .then((response) => response.json());
  }

  // Get a bean value, returns a promise
  static getBean(server, servers, name) {
    return this.get(server, servers, `metrics/v1/mbeans/${name}`);
  }

  // Get PuppetDB version, returns a promise
  static getVersion(server, servers) {
    return this.get(server, servers, 'pdb/meta/v1/version');
  }
}
