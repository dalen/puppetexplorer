import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import EventChart from './EventChart';
import EventList from './EventList';
import PaginatedList from '../../../components/PaginatedList';
import * as PuppetDB from '../../../PuppetDB';

const PaginatedEventList = PaginatedList(EventList, 'events', 'events');

export default (props: { serverUrl: string, queryParsed: PuppetDB.queryT }) =>
  (<div>
    <Grid fluid>
      <Row>
        <Col md={4}>
          <EventChart
            title="Containing Class"
            eventField="containing_class"
            id="containing-class"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
        <Col md={4}>
          <EventChart
            title="Resource Type"
            eventField="resource_type"
            id="resource-type"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
        <Col md={4}>
          <EventChart
            title="Resource Status"
            eventField="status"
            id="resource-status"
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
          />
        </Col>
      </Row>
    </Grid>
    <PaginatedEventList
      serverUrl={props.serverUrl}
      listQuery={props.queryParsed}
      countQuery={['extract', [['function', 'count']], props.queryParsed]}
    />
  </div>);
