import * as React from 'react';
import * as Table from 'react-bootstrap/lib/Table';
import * as Alert from 'react-bootstrap/lib/Alert';

import LogListItem from './LogListItem';
import * as PuppetDB from '../../../PuppetDB';

export default ({ logs = [] }: { readonly logs?: ReadonlyArray<PuppetDB.logT> }) => {
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
