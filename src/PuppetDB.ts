import * as puppetdbquery from 'node-puppetdbquery';

// TODO: make this a bit stricter, but self-recursive doesn't work
export type queryT = any[];


export type nodeT = {
  certname: string,
  catalog_timestamp: string,
  latest_report_status: 'failed' | 'changed' | 'unchanged',
  latest_report_hash: string,
  report_timestamp: string,
};

export type eventT = {
  certname: string,
  old_value: string,
  property: string,
  timestamp: string,
  resource_type: string,
  resource_title: string,
  new_value: string,
  message: string,
  report: string,
  status: 'success' | 'failure' | 'noop' | 'skipped',
  file: string | null,
  line: number | null,
  containment_path: string[],
  containing_class: string,
  run_start_time: string,
  run_end_time: string,
  report_receive_time: string,
};

export type logT = {
  file: string | null,
  line: number | null,
  level: string,
  message: string,
  source: string,
  tags: string[],
  time: string,
};

export type metricT = {
  category: string,
  name: string,
  value: number,
};

export type reportT = {
  hash: string,
  puppet_version: string,
  receive_time: string,
  report_format: number,
  start_time: string,
  end_time: string,
  producer_timestamp: string,
  producer: string,
  transaction_uuid: string,
  status: 'failed' | 'changed' | 'unchanged',
  noop: boolean,
  noop_pending: boolean,
  environment: string,
  configuration_version: string,
  certname: string,
  code_id: string,
  catalog_uuid: string,
  cached_catalog_status: string,
  resource_events: { href: string, data: eventT[] },
  metrics: { href: string, data: metricT[] },
  logs: { href: string, data: logT[] },
};

export type factPathElementT = string | number;
export type factPathT = factPathElementT[];

// Fact paths as returned by the API
export type factPathApiT = {
  path: factPathT,
  type: 'string' | 'integer' | 'boolean' | 'float',
};


  // Combine queries together
export const combine = (...queries: (queryT | null | void)[]): queryT | null => {
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
  params: { [id: string]: any } = {},
): Promise<any> => {
  const baseUrl = `${serverUrl}/${path}`;
  const url =
    Object.keys(params).length > 0
      ? `${baseUrl}?${Object.keys(params)
        .map((k: string): string => {
          const v = params[k]; // TODO: Use Object.enties in the future
          return v instanceof String
            ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
            : `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`;
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
  params: { [id: string]: any } = {},
): Promise<any> => {
  return get(serverUrl, `pdb/query/v4/${endpoint}`, params);
};
