// @flow
import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import ReportListItem from './ReportListItem';

// A list of reports, for a node typically
export default class ReportList extends React.Component {
  props: {
    total: number,
    reports: reportT[],
  };

  render() {
    if (this.props.total === 0) {
      return (
        <Alert bsStyle="warning">No reports found</Alert>
      );
    }

    return (
      <Table striped>
        <thead><tr>
          <th><Label>
            { this.props.total === 1 ?
            '1 report found' : `${this.props.total} reports found`}
          </Label></th>
          <th>Last run</th>
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr></thead>
        <tbody>
          {this.props.reports.map((report, i) =>
            (<ReportListItem
              key={i.toString()}
              report={report}
            />))}
        </tbody>
      </Table>
    );
  }
}
