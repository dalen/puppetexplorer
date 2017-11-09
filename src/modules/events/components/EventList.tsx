import * as React from 'react';
import * as Alert from 'react-bootstrap/lib/Alert';
import * as Table from 'react-bootstrap/lib/Table';

import * as PuppetDB from '../../../PuppetDB';
import EventListItem from './EventListItem';

export default ({
  events = [],
  showNode = true
}: {
  readonly events: ReadonlyArray<PuppetDB.eventT>;
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
            <EventListItem event={event} showNode={showNode} />
          ))}
        </tbody>
      </Table>
    );
  }
  return <Alert bsStyle="warning">No events found</Alert>;
};
