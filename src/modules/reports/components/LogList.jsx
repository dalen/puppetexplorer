// @flow
import React from 'react';
import { Alert, Table } from 'react-bootstrap';

import LogListItem from './LogListItem';

export default ({ logs = [] }: { logs: logT[] }) => {
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
        <tbody>{logs.map(log => <LogListItem log={log} />)}</tbody>
      </Table>
    );
  }
  return <Alert bsStyle="warning">No logs found</Alert>;
};
