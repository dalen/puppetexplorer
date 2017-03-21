// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import EventChart from './EventChart';
import EventList from './EventList';
import paginatedList from '../../../components/PaginatedList';

const PaginatedEventList = paginatedList(EventList, 'events', 'events');

export default class Events extends React.Component {
  props: {
    serverUrl: string,
    queryParsed: ?queryT,
  };

  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col md={4}>
              <EventChart
                title="Containing Class"
                eventField="containing_class"
                id="containing-class"
                serverUrl={this.props.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
            <Col md={4}>
              <EventChart
                title="Resource Type"
                eventField="resource_type"
                id="resource-type"
                serverUrl={this.props.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
            <Col md={4}>
              <EventChart
                title="Resource Status"
                eventField="status"
                id="resource-status"
                serverUrl={this.props.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
          </Row>
        </Grid>
        <PaginatedEventList
          serverUrl={this.props.serverUrl}
          listQuery={this.props.queryParsed}
          countQuery={['extract', [['function', 'count']], this.props.queryParsed]}
        />
      </div>
    );
  }
}
