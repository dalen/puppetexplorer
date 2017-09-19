// @flow
import React from 'react';
import { Alert, Table } from 'react-bootstrap';

import EventListItem from './EventListItem';

type Props = {
  events: ?(eventT[]),
  showNode: boolean,
};

export default class EventList extends React.Component<Props> {
  static defaultProps = {
    events: [],
    showNode: true,
  };

  render() {
    if (this.props.events) {
      return (
        <Table hover>
          <thead>
            <tr>
              {this.props.showNode && <th>Node</th>}
              <th>Resource</th>
              <th>Status</th>
              <th>Property</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {this.props.events.map((event, i) =>
              <EventListItem event={event} showNode={this.props.showNode} key={i} />,
            )}
          </tbody>
        </Table>
      );
    }
    return <Alert bsStyle="warning">No events found</Alert>;
  }
}
