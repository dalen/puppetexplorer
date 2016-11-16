// @flow
import React from 'react';
// import { Label } from 'react-bootstrap';

import ReportList from '../components/ReportList';
import paginatedList from '../components/PaginatedList';

// Takes care of feching nodes and passing it to node list
//
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
