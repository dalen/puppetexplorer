// @flow
export type nodeT = {
  certname: string,
  catalog_timestamp: string,
  latest_report_status: string,
  latest_report_hash: string,
  report_timestamp: string,
};

export type queryT = string | queryT[];

export type dashBoardPanelT = {
  title: string,
  style:
    'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger',
  bean: string,
  beanValue: string,
  multiply: number,
  unit: string,
  serverUrl: string,
};
