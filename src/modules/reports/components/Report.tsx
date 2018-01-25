import * as React from 'react';
import Moment from 'react-moment';
import * as Maybe from 'maybe.ts';
import { Route, Switch } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';

import RouterNavLink from '../../../components/RouterNavLink';
import EventList from '../../events/components/EventList';
import LogList from './LogList';
import ReportMetrics from './ReportMetrics';
import { metricValue } from '../helpers';
import * as PuppetDB from '../../../PuppetDB';

// type Tab = 'events' | 'logs' | 'metrics';

// Given a report for a single node, render a page for it
export default ({ report }: { readonly report: PuppetDB.Report }) => {
  const runTime = Maybe.map(
    val => val.toFixed(1),
    metricValue(report.metrics.data, 'time', 'total'),
  );

  const configTime = Maybe.map(
    val => val.toFixed(1),
    metricValue(report.metrics.data, 'time', 'config_retrieval'),
  );

  return (
    <div>
      <h1>
        {report.certname}:{' '}
        <span title={report.receive_time}>
          <Moment format="LLL">{report.receive_time}</Moment>
        </span>
      </h1>
      <Container>
        <Row>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem>
                <ListGroupItemHeading>Environment</ListGroupItemHeading>
                <ListGroupItemText>{report.environment}</ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>Puppet version</ListGroupItemHeading>
                <ListGroupItemText>{report.puppet_version}</ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem>
                <ListGroupItemHeading>Run time</ListGroupItemHeading>
                <ListGroupItemText>{runTime} s</ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>
                  Catalog retrieval time
                </ListGroupItemHeading>
                <ListGroupItemText>{configTime} s</ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem>
                <ListGroupItemHeading>
                  Configuration version
                </ListGroupItemHeading>
                <ListGroupItemText>
                  {report.configuration_version}
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>Catalog compiled by</ListGroupItemHeading>
                <ListGroupItemText>{report.producer}</ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem>
                <ListGroupItemHeading>Start time</ListGroupItemHeading>
                <ListGroupItemText>
                  <span title={report.start_time}>
                    <Moment format="LLL">{report.start_time}</Moment>
                  </span>
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>End time</ListGroupItemHeading>
                <ListGroupItemText>
                  <span title={report.end_time}>
                    <Moment format="LLL">{report.end_time}</Moment>
                  </span>
                </ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Nav tabs>
        <NavItem>
          <RouterNavLink to={`/report/${report.hash}/events`}>
            Events
          </RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to={`/report/${report.hash}/logs`}>Logs</RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to={`/report/${report.hash}/metrics`}>
            Metrics
          </RouterNavLink>
        </NavItem>
      </Nav>

      <Switch>
        <Route
          path="/report/:report/events"
          render={({}) => (
            <EventList events={report.resource_events.data} showNode={false} />
          )}
        />
        <Route
          path="/report/:report/logs"
          render={({}) => <LogList logs={report.logs.data} />}
        />
        <Route
          path="/report/:report/metrics"
          render={({}) => <ReportMetrics metrics={report.metrics.data} />}
        />
      </Switch>
    </div>
  );
};
