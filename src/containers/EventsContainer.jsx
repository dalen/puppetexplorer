// @flow
import React from 'react';
import { Router } from 'react-router';
import type { Location, RouterHistory } from 'react-router-dom';
import { Grid, Col, Row, ControlLabel, FormGroup, Tabs, Tab } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';

import Events from '../components/Events';
import PuppetDB from '../PuppetDB';

type Props = {
  config: {
    serverUrl: string,
  },
  queryParsed: ?queryT,
  location: Location,
  history: RouterHistory,
  params: {
    tab: ?string,
  },
};

export default class EventListContainer extends React.Component {
  // Compute an event query based on date range
  static dateRangeEventQuery(query: ?queryT, dateFrom: string, dateTo: string): ?queryT {
    return (PuppetDB.combine(
      query,
      dateFrom ? ['>=', 'timestamp', moment.utc(dateFrom).startOf('day').toISOString()] : null,
      dateTo ? ['<=', 'timestamp', moment.utc(dateTo).endOf('day').toISOString()] : null,
    ));
  }

  state: {
    dateFrom: string,
    dateTo: string,
  } = {
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location.query.dateFrom !== this.props.location.query.dateFrom) {
      this.setState({ dateFrom: moment.utc(nextProps.location.query.dateFrom).toISOString() });
    }
    if (nextProps.location.query.dateFrom !== this.props.location.query.dateFrom) {
      this.setState({ dateTo: moment.utc(nextProps.location.query.dateTo).toISOString() });
    }
  }

  props: Props;

  selectTab = (tab: string) => {
    this.props.router.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      query: this.props.location.query,
    });
  }

  changeDate = (which: string, value: ?string) => {
    this.setState({ [which]: value });
    this.props.router.push({
      pathname: this.props.location.pathname,
      query: {
        ...this.props.location.query,
        [which]: value ? moment(value).format('YYYY-MM-DD') : undefined,
      },
    });
  }

  render() {
    return (
      <Tabs activeKey={this.props.params.tab || 'latest'} onSelect={this.selectTab} id="event-tabs" unmountOnExit>
        <Tab eventKey={'latest'} title="Latest Report" style={{ paddingTop: 10 }}>
          <Events
            serverUrl={this.props.config.serverUrl}
            queryParsed={this.props.queryParsed}
          />
        </Tab>
        <Tab eventKey={'daterange'} title="Date Range" style={{ paddingTop: 10 }}>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>From:</ControlLabel>
                  <DatePicker
                    placeholder="Start Date"
                    value={this.state.dateFrom}
                    onChange={value => this.changeDate('dateFrom', value)}
                    dateFormat="YYYY-MM-DD"
                    showTodayButton
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>To:</ControlLabel>
                  <DatePicker
                    placeholder="End Date"
                    value={this.state.dateTo}
                    onChange={value => this.changeDate('dateTo', value)}
                    dateFormat="YYYY-MM-DD"
                    showTodayButton
                  />
                </FormGroup>
              </Col>
            </Row>
          </Grid>
          <Events
            serverUrl={this.props.config.serverUrl}
            queryParsed={EventListContainer.dateRangeEventQuery(
              this.props.queryParsed, this.state.dateFrom, this.state.dateTo)}
          />
        </Tab>
      </Tabs>
    );
  }
}
