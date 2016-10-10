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

  // Get a URL from server
  static get(serverUrl, path) {
    return fetch(`${serverUrl}${path}`)
    .then(response => response.json());
  }

  // Get a bean value, returns a promise
  static getBean(serverUrl, name) {
    return this.get(serverUrl, `metrics/v1/mbeans/${name}`);
  }

  // Get PuppetDB version, returns a promise
  static getVersion(serverUrl) {
    return this.get(serverUrl, 'pdb/meta/v1/version');
  }
}
