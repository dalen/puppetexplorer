import * as React from 'react';
import { Table, Alert } from 'reactstrap';

import LogListItem from './LogListItem';
import * as PuppetDB from '../../../PuppetDB';
import * as hash from 'object-hash';

export default ({
  logs = [],
}: {
  readonly logs?: ReadonlyArray<PuppetDB.Log>;
}) => {
  if (logs) {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => <LogListItem key={hash(log)} log={log} />)}
        </tbody>
      </Table>
    );
  }
  return <Alert color="warning">No logs found</Alert>;
};
