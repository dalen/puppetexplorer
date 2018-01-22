import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';

import EventChart from './EventChart';
import EventList from './EventList';
import PaginatedList from '../../../components/PaginatedList';
import * as PuppetDB from '../../../PuppetDB';

const PaginatedEventList = PaginatedList(EventList, 'events', 'events');

export default (props: {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.queryT | null;
}) => (
  <div>
    <Container fluid>
      <Row>
        <Col>
          <EventChart
            title="Containing Class"
            eventField="containing_class"
            id="containing-class"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
        <Col>
          <EventChart
            title="Resource Type"
            eventField="resource_type"
            id="resource-type"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
        <Col>
          <EventChart
            title="Resource Status"
            eventField="status"
            id="resource-status"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
      </Row>
    </Container>
    <PaginatedEventList
      serverUrl={props.serverUrl}
      listQuery={props.queryParsed}
      countQuery={['extract', [['function', 'count']], props.queryParsed]}
    />
  </div>
);
