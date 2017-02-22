// @flow
import React from 'react';
import { Grid, Col, Row, Tabs, Tab, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import Moment from 'react-moment';


import EventList from './EventList';
import LogList from './LogList';
import ReportsHelper from '../helpers/ReportsHelper';

// Given a report for a single node, render a page for it
export default class Report extends React.Component {
  props: {
    report: reportT,
  };

  render() {
    const report = this.props.report;
    let runTime = ReportsHelper.metricValue(report.metrics.data, 'time', 'total');
    if (typeof runTime === 'number') { runTime = runTime.toFixed(1); }
    let configTime = ReportsHelper.metricValue(report.metrics.data, 'time', 'config_retrieval');
    if (typeof configTime === 'number') { configTime = configTime.toFixed(1); }

    return (
      <div>
        <PageHeader>{report.certname}: <Moment format="LLL" title={report.receive_time}>{report.receive_time}</Moment></PageHeader>
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
                <ListGroupItem header="Configuration version">{report.configuration_version}</ListGroupItem>
                <ListGroupItem header="Catalog compiled by">{report.producer}</ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroupItem header="Start time"><Moment format="LLL" title={report.start_time}>{report.start_time}</Moment></ListGroupItem>
                <ListGroupItem header="End time"><Moment format="LLL" title={report.end_time}>{report.end_time}</Moment></ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Grid>

        <Tabs defaultActiveKey={'events'} id="report-tabs">
          <Tab eventKey={'events'} title="Events"><EventList events={report.resource_events.data} showNode={false} /></Tab>
          <Tab eventKey={'logs'} title="Logs"><LogList logs={report.logs.data} /></Tab>
          <Tab eventKey={'metrics'} title="Metrics">
            {/* TODO: move to a separate component, make nicer or delete this */}
            {report.metrics.data.map((metric, i) =>
              <p key={i}>{metric.category}: {metric.name}: {metric.value}</p>,
            )}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
