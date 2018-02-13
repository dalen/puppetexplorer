import * as React from 'react';
import { Table, Alert } from 'reactstrap';

import * as PuppetDB from '../../../PuppetDB';
import EventListItem from './EventListItem';
import * as hash from 'object-hash';

export default ({
  events = [],
  showNode = true,
}: {
  readonly events: ReadonlyArray<PuppetDB.Event>;
  readonly showNode: boolean;
}) => {
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
          {events.map(event => (
            <EventListItem
              key={hash(event)}
              event={event}
              showNode={showNode}
            />
          ))}
        </tbody>
      </Table>
    );
  }
  return <Alert color="warning">No events found</Alert>;
};
