import * as React from 'react';

import ReportList from './ReportList';
import PaginatedList from '../../../components/PaginatedList';

const PaginatedReportList = PaginatedList(ReportList, 'reports', 'reports');

export default (props: {
  readonly node: string;
  readonly serverUrl: string;
}) => (
  <PaginatedReportList
    serverUrl={props.serverUrl}
    listQuery={[
      'extract',
      ['hash', 'end_time', 'status', 'metrics'],
      ['=', 'certname', props.node],
    ]}
    countQuery={[
      'extract',
      [['function', 'count']],
      ['=', 'certname', props.node],
    ]}
    perPage={10}
  />
);
