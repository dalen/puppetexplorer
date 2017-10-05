// @flow
import React from 'react';
import { Alert, Table } from 'react-bootstrap';

import EventListItem from './EventListItem';

export default ({ events = [], showNode = true }: { events: eventT[], showNode: boolean }) => {
  if (events) {
    return (
      <Table hover>
        <thead>
          <tr>
            {showNode && <th>Node</th>}
            <th>Resource</th>
            <th>Status</th>
            <th>Property</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => <EventListItem event={event} showNode={showNode} key={i} />)}
        </tbody>
      </Table>
    );
  }
  return <Alert bsStyle="warning">No events found</Alert>;
};
