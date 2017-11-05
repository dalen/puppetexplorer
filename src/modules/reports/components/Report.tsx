import * as React from 'react';
import { Grid, Col, Row, Tabs, Tab, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import Moment from 'react-moment';

import EventList from '../../events/components/EventList';
import LogList from './LogList';
import ReportMetrics from './ReportMetrics';
import { metricValue } from '../helpers';
import * as PuppetDB from '../../../PuppetDB';

// Given a report for a single node, render a page for it
export default ({ report }: { report: PuppetDB.reportT }) => {
  const runTime = metricValue(report.metrics.data, 'time', 'total')
    .andThen(val => val.toFixed(1))
    .unwrapOr(null);

  const configTime = metricValue(report.metrics.data, 'time', 'config_retrieval')
    .andThen(val => val.toFixed(1))
    .unwrapOr(null);

  return (
    <div>
      <PageHeader>
        {report.certname}:{' '}
        <span title={report.receive_time}>
        <Moment format="LLL">
          {report.receive_time}
        </Moment>
        </span>
      </PageHeader>
      <Grid>
        <Row>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Environment">{report.environment}</ListGroupItem>
              <ListGroupItem header="Puppet version">{report.puppet_version}</ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Run time">{runTime} s</ListGroupItem>
              <ListGroupItem header="Catalog retrieval time">{configTime} s</ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Configuration version">
                {report.configuration_version}
              </ListGroupItem>
              <ListGroupItem header="Catalog compiled by">{report.producer}</ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem header="Start time">
                <span title={report.start_time}>
                  <Moment format="LLL">{report.start_time}</Moment>
                </span>
              </ListGroupItem>
              <ListGroupItem header="End time">
                <span title={report.end_time}>
                  <Moment format="LLL">
                    {report.end_time}
                  </Moment>
                </span>
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
    </div > ;
  )
};
