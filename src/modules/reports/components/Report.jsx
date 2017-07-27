// @flow
import React from 'react';
import { Grid, Col, Row, Tabs, Tab, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import Moment from 'react-moment';

import { EventList } from '../../events';
import LogList from './LogList';
import ReportMetrics from './ReportMetrics';
import { metricValue } from '../helpers';

// Given a report for a single node, render a page for it
export default (props: { report: reportT }) => {
  const report = props.report;
  const maybeRunTime = metricValue(report.metrics.data, 'time', 'total');
  const runTime = typeof maybeRunTime === 'number' ? maybeRunTime.toFixed(1) : maybeRunTime;

  const maybeConfigTime = metricValue(report.metrics.data, 'time', 'config_retrieval');
  const configTime =
    typeof maybeConfigTime === 'number' ? maybeConfigTime.toFixed(1) : maybeConfigTime;

  return (
    <div>
      <PageHeader>
        {report.certname}:{' '}
        <Moment format="LLL" title={report.receive_time}>
          {report.receive_time}
        </Moment>
      </PageHeader>
      <Grid>
        <Row>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Environment">
                {report.environment}
              </ListGroupItem>
              <ListGroupItem header="Puppet version">
                {report.puppet_version}
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Run time">
                {runTime} s
              </ListGroupItem>
              <ListGroupItem header="Catalog retrieval time">
                {configTime} s
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Configuration version">
                {report.configuration_version}
              </ListGroupItem>
              <ListGroupItem header="Catalog compiled by">
                {report.producer}
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Start time">
                <Moment format="LLL" title={report.start_time}>
                  {report.start_time}
                </Moment>
              </ListGroupItem>
              <ListGroupItem header="End time">
                <Moment format="LLL" title={report.end_time}>
                  {report.end_time}
                </Moment>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Grid>

      <Tabs defaultActiveKey={'events'} id="report-tabs" unmountOnExit>
        <Tab eventKey={'events'} title="Events">
          <EventList events={report.resource_events.data} showNode={false} />
        </Tab>
        <Tab eventKey={'logs'} title="Logs">
          <LogList logs={report.logs.data} />
        </Tab>
        <Tab eventKey={'metrics'} title="Metrics">
          <ReportMetrics metrics={report.metrics.data} />
        </Tab>
      </Tabs>
    </div>
  );
};
