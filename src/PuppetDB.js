// @flow

import puppetdbquery from 'node-puppetdbquery';

export default class PuppetDB {
  // Combine queries together
  static combine(...queries: (queryT | null | void)[]): ?queryT {
    const actualQueries = queries.filter(q => q != null);
    switch (actualQueries.length) {
      case 0:
        return null;
      case 1:
        return actualQueries[0];
      default:
        return ['and', ...actualQueries];
    }
  }

  // Parse a query
  static parse(query: string): ?queryT {
    return (query ?
      puppetdbquery.parse(query)
    :
      null);
  }

  // Get a URL from server
  // params is converted into a query string automatically
  static get(serverUrl: string, path: string, params: {[id: string]: mixed } = {}): Promise<*> {
    const baseUrl = `${serverUrl}/${path}`;
    const url = (Object.keys(params).length > 0) ?
      `${baseUrl}?${Object.keys(params)
        .map((k: string): string => {
          const v = params[k]; // TODO: Use Object.enties in the future
          return (v instanceof String) ?
            `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          :
            `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`;
        })
        .join('&')}`
    : baseUrl;

    return fetch(url, {
      headers: { Accept: 'application/json' },
    }).then(response => response.json());
  }

  // Get a bean value
  static getBean(serverUrl: string, name: string): Promise<*> {
    return this.get(serverUrl, `metrics/v1/mbeans/${name}`);
  }

  // Get PuppetDB version
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
