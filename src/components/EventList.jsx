// @flow
import React from 'react';
import { Table } from 'react-bootstrap';

import EventListItem from './EventListItem';

export default class EventList extends React.Component {
  static defaultProps = {
    events: [],
    showNode: true,
  };

  props: {
    events: eventT[],
    showNode: boolean,
  };

  render(): React$Element<*> {
    return (
      <Table hover>
        <thead><tr>
          { this.props.showNode ? <th>Node</th> : null }
          <th>Resource</th>
          <th>Status</th>
          <th>Property</th>
          <th>From</th>
          <th>To</th>
        </tr></thead>
        <tbody>
          {this.props.events.map((event, i) => <EventListItem
            event={event}
            showNode={this.props.showNode}
            key={i}
          />)}
        </tbody>
      </Table>
    );
  }
}
