// @flow

import puppetdbquery from 'node-puppetdbquery';

export default class PuppetDB {
  // Combine queries together
  static combine(...queries: queryT[]): ?queryT {
    const actualQueries = queries.filter(q => q != null);
    if (actualQueries.length === 0) {
      return null;
    } else if (actualQueries.length === 1) {
      return actualQueries[0];
    }
    return ['and', ...actualQueries];
  }

  // Parse a query
  static parse(query: string): ?queryT {
    if (query) {
      return puppetdbquery.parse(query);
    }
    return null;
  }

  // Get a URL from server
  static get(serverUrl: string, path: string, params: {[id: string]: mixed } = {}): Promise<*> {
    let url = `${serverUrl}/${path}`;
    if (Object.keys(params).length > 0) {
      url = `${url}?${Object.keys(params)
        .map((k: string): string => {
          const v = params[k]; // TODO: Use Object.enties in the future
          if (v instanceof String) {
            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
          }
          return `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`;
        })
        .join('&')}`;
    }
    return fetch(url, {
      headers: { Accept: 'application/json' },
    })
    .then(response => response.json());
  }

  // Get a bean value, returns a promise
  static getBean(serverUrl: string, name: string): Promise<*> {
    return this.get(serverUrl, `metrics/v1/mbeans/${name}`);
  }

  // Get PuppetDB version, returns a promise
  static getVersion(serverUrl: string): Promise<*> {
    return this.get(serverUrl, 'pdb/meta/v1/version');
  }

  // Do a query against the server
  static query(
    serverUrl: string,
    endpoint: string,
    params: {[id: string]: mixed } = {},
  ): Promise<*> {
    return this.get(serverUrl, `pdb/query/v4/${endpoint}`, params);
  }
}
