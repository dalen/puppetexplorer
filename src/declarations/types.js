// @flow
/* eslint no-undef: "off" */

// Extend the Location type to include query obj from react-router
declare class Location extends Location {
  query: {[id: string]: string};
}

declare type nodeT = {
  certname: string,
  catalog_timestamp: string,
  latest_report_status: 'failed' | 'changed' | 'unchanged',
  latest_report_hash: string,
  report_timestamp: string,
};

declare type eventT = {
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
  file: ?string,
  line: ?number,
  containment_path: string[],
  containing_class: string,
  run_start_time: string,
  run_end_time: string,
  report_receive_time: string,
};

declare type logT = {
  file: ?string,
  line: ?number,
  level: string,
  message: string,
  source: string,
  tags: string[],
  time: string,
};

declare type metricT = {
  category: string,
  name: string,
  value: number,
};

declare type reportT = {
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

declare type factPathElementT = string | number;

// Fact paths as returned by the API
declare type factPathT = {
  path: factPathElementT[],
  type: 'string' | 'integer' | 'boolean' | 'float',
};

declare type queryElementT = string | number | boolean | queryElementT[];
declare type queryT = queryElementT[];

declare type dashBoardPanelT = {
  title: string,
  style: 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger',
  bean: string,
  beanValue?: string,
  multiply?: number,
  unit?: string,
  serverUrl?: string,
};
