import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import ReportListItem from './ReportListItem';
import type { reportT } from '../types';

export default class ReportList extends React.Component {
  props: {
    reports: reportT[],
  };

  render() {
    if (this.props.reports.length === 0) {
      return (
        <Alert bsStyle="warning">No reports found</Alert>
      );
    }

    return (
      <Table striped>
        <thead><tr>
          <th><Label>
            { this.props.reports.length === 1 ?
            '1 report found' : `${this.props.reports.length} reports found`}
          </Label></th>
          <th>Last run</th>
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr></thead>
        <tbody>
          {this.props.reports.map(report =>
            <ReportListItem
              report={report} key={report.certname}
            />)}
        </tbody>
      </Table>
    );
  }
}
