// @flow

import puppetdbquery from 'node-puppetdbquery';

import type { queryT } from './types';

export default class PuppetDB {
  // Combine queries together
  static combine(...queries: queryT[]): queryT | null {
    const actualQueries = queries.filter(q => q != null);
    if (actualQueries.length === 0) {
      return null;
    } else if (actualQueries.length === 1) {
      return actualQueries[0];
    }
    return ['and', ...actualQueries];
  }

  // Parse a query
  static parse(query: string): queryT | null {
    if (query) {
      return puppetdbquery.parse(query);
    }
    return null;
  }

  // Get a URL from server
  static get(serverUrl: string, path: string): Promise<*> {
    return fetch(`${serverUrl}/${path}`, {
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
  static query(serverUrl: string, endpoint: string, query: null | queryT) {
    if (query) {
      return this.get(serverUrl, `pdb/query/v4/${endpoint}?query=${encodeURIComponent(JSON.stringify(query))}`);
    }
    return this.get(serverUrl, `pdb/query/v4/${endpoint}`);
  }
}
