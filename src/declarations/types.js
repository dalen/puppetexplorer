// @flow
/* eslint no-undef: "off" */

// Extend the Location type to include query obj from react-router
declare class Location extends Location {
  query: {[id: string]: string};
}

declare type nodeT = {
  certname: string,
  catalog_timestamp: string,
  latest_report_status: string,
  latest_report_hash: string,
  report_timestamp: string,
};

declare type reportT = {
  certname: string,
  status: string,
  end_time: string,
  metrics: { data: Array<*> },
};

declare type queryT = string | queryT[];

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
