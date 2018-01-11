import * as puppetdbquery from 'node-puppetdbquery';
import * as FactPath from './PuppetDB/FactPath';

export { FactPath };

export type queryT = puppetdbquery.Query;

export type nodeT = {
  readonly certname: string;
  readonly catalog_timestamp: string;
  readonly latest_report_status: 'failed' | 'changed' | 'unchanged';
  readonly latest_report_hash: string;
  readonly report_timestamp: string;
};

export type eventT = {
  readonly certname: string;
  readonly old_value: string;
  readonly property: string;
  readonly timestamp: string;
  readonly resource_type: string;
  readonly resource_title: string;
  readonly new_value: string;
  readonly message: string;
  readonly report: string;
  readonly status: 'success' | 'failure' | 'noop' | 'skipped';
  readonly file: string | null;
  readonly line: number | null;
  readonly containment_path: ReadonlyArray<string>;
  readonly containing_class: string;
  readonly run_start_time: string;
  readonly run_end_time: string;
  readonly report_receive_time: string;
};

export type logT = {
  readonly file: string | null;
  readonly line: number | null;
  readonly level: string;
  readonly message: string;
  readonly source: string;
  readonly tags: ReadonlyArray<string>;
  readonly time: string;
};

export type metricT = {
  readonly category: string;
  readonly name: string;
  readonly value: number;
};

export type FactContent = {
  readonly certname?: string;
  readonly environment?: string;
  readonly name: string;
  readonly path: FactPath.FactPath;
  readonly facts: boolean | string | number;
};

export type reportT = {
  readonly hash: string;
  readonly puppet_version: string;
  readonly receive_time: string;
  readonly report_format: number;
  readonly start_time: string;
  readonly end_time: string;
  readonly producer_timestamp: string;
  readonly producer: string;
  readonly transaction_uuid: string;
  readonly status: 'failed' | 'changed' | 'unchanged';
  readonly noop: boolean;
  readonly noop_pending: boolean;
  readonly environment: string;
  readonly configuration_version: string;
  readonly certname: string;
  readonly code_id: string;
  readonly catalog_uuid: string;
  readonly cached_catalog_status: string;
  readonly resource_events: {
    readonly href: string;
    readonly data: ReadonlyArray<eventT>;
  };
  readonly metrics: {
    readonly href: string;
    readonly data: ReadonlyArray<metricT>;
  };
  readonly logs: { readonly href: string; readonly data: ReadonlyArray<logT> };
};

// Combine queries together
export const combine = (...queries: (queryT | null)[]): queryT | null => {
  const actualQueries = queries.filter(q => q != null);
  switch (actualQueries.length) {
    case 0:
      return null;
    case 1:
      return actualQueries[0];
    default:
      return ['and', ...actualQueries];
  }
};

// Parse a query
export const parse = (query: string): queryT | null => {
  return query ? puppetdbquery.parse(query) : null;
};

// Get a URL from server
// params is converted into a query string automatically
export const get = (
  serverUrl: string,
  path: string,
  params: { readonly [id: string]: any } = {},
): Promise<any> => {
  const baseUrl = `${serverUrl}/${path}`;
  const url =
    Object.keys(params).length > 0
      ? `${baseUrl}?${Object.keys(params)
          .map((k: string): string => {
            const v = params[k]; // TODO: Use Object.enties in the future
            return typeof v === 'string'
              ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
              : `${encodeURIComponent(k)}=${encodeURIComponent(
                  JSON.stringify(v),
                )}`;
          })
          .join('&')}`
      : baseUrl;

  return fetch(url, {
    headers: { Accept: 'application/json' },
  }).then(response => response.json());
};

// Get a bean value
export const getBean = (serverUrl: string, name: string): Promise<any> => {
  return get(serverUrl, `metrics/v1/mbeans/${name}`);
};

// Get PuppetDB version
export const getVersion = (serverUrl: string): Promise<any> => {
  return get(serverUrl, 'pdb/meta/v1/version');
};

// Do a query against the server
export const query = (
  serverUrl: string,
  endpoint: string,
  params: { readonly [id: string]: any } = {},
): Promise<any> => {
  return get(serverUrl, `pdb/query/v4/${endpoint}`, params);
};
