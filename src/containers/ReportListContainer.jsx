// @flow
import React from 'react';

import ReportList from '../components/ReportList';
import paginatedList from '../components/PaginatedList';

const PaginatedReportList = paginatedList(ReportList, 'reports', 'reports');

export default class ReportListContainer extends React.Component {
  props: {
    node: string,
    serverUrl: string,
  };

  render(): React$Element<*> {
    return (<PaginatedReportList
      serverUrl={this.props.serverUrl}
      listQuery={['extract',
        ['hash', 'end_time', 'status', 'metrics'],
        ['=', 'certname', this.props.node]]}
      countQuery={['extract', [['function', 'count']], ['=', 'certname', this.props.node]]}
    />);
  }
}
