// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import EventChart from '../components/EventChart';
import EventList from '../components/EventList';
import paginatedList from '../components/PaginatedList';

const PaginatedNodeList = paginatedList(EventList, 'events', 'events');

export default class EventListContainer extends React.Component {
  props: {
    config: {
      serverUrl: string,
    },
    queryParsed: queryT,
  };

  render(): React$Element<*> {
    return (
      <div>
        <Grid>
          <Row>
            <Col md={4}>
              <EventChart
                title="Containing Class"
                eventField="containing_class"
                id="containing-class"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
            <Col md={4}>
              <EventChart
                title="Resource Type"
                eventField="resource_type"
                id="resource-type"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
            <Col md={4}>
              <EventChart
                title="Resource Status"
                eventField="status"
                id="resource-status"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Col>
          </Row>
        </Grid>
        <PaginatedNodeList
          serverUrl={this.props.config.serverUrl}
          listQuery={this.props.queryParsed}
          countQuery={['extract', [['function', 'count']], this.props.queryParsed]}
        />
      </div>
    );
  }
}
