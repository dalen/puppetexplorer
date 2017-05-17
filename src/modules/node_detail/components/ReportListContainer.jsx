// @flow
import React from 'react';

import ReportList from './ReportList';
import paginatedList from '../../../components/PaginatedList';

const PaginatedReportList = paginatedList(ReportList, 'reports', 'reports');

export default (props: {
  node: string,
  serverUrl: string,
}) => (
  <PaginatedReportList
    serverUrl={props.serverUrl}
    listQuery={['extract',
      ['hash', 'end_time', 'status', 'metrics'],
      ['=', 'certname', props.node]]}
    countQuery={['extract', [['function', 'count']], ['=', 'certname', props.node]]}
    perPage={10}
  />
);
