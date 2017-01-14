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
          <Col md={4}>
            <Row>
              <EventChart
                title="Containing Class"
                eventField="containing_class"
                id="containing-class"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Row>
          </Col>
          <Col md={4}>
            <Row>
              <EventChart
                title="Resource Type"
                eventField="resource_type"
                id="resource-type"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Row>
          </Col>
          <Col md={4}>
            <Row>
              <EventChart
                title="Resource Status"
                eventField="status"
                id="resource-status"
                serverUrl={this.props.config.serverUrl}
                queryParsed={this.props.queryParsed}
              />
            </Row>
          </Col>
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
