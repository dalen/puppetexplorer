// @flow
import React from 'react';
import { Alert, Table } from 'react-bootstrap';

import LogListItem from './LogListItem';

type Props = {
  logs: ?(logT[]),
};

export default class EventList extends React.Component<Props> {
  static defaultProps = {
    logs: [],
  };

  render() {
    if (this.props.logs) {
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
            {this.props.logs.map((log, i) => <LogListItem log={log} key={i} />)}
          </tbody>
        </Table>
      );
    }
    return <Alert bsStyle="warning">No logs found</Alert>;
  }
}
