import * as React from 'react';
import { Table, Label, Alert } from 'reactstrap';

import ReportListItem from './ReportListItem';

import * as PuppetDB from '../../../PuppetDB';

// A list of reports, for a node typically
export default (props: {
  readonly total: number;
  readonly reports: PuppetDB.Report[];
}) =>
  props.total === 0 ? (
    <Alert color="warning">No reports found</Alert>
  ) : (
    <Table striped>
      <thead>
        <tr>
          <th>
            <Label>
              {props.total === 1
                ? '1 report found'
                : `${props.total} reports found`}
            </Label>
          </th>
          <th>Last run</th>
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {props.reports.map((report, i) => (
          <ReportListItem key={i.toString()} report={report} />
        ))}
      </tbody>
    </Table>
  );
