// @flow
import React from 'react';
import { Grid, Col, Row, ControlLabel, FormGroup, Tabs, Tab } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import { browserHistory as history } from 'react-router';
import moment from 'moment';

import Events from '../components/Events';

export default class EventListContainer extends React.Component {
  // Compute an event query based on date range
  static dateRangeEventQuery(query: ?queryT, dateFrom: string, dateTo: string): ?queryT {
    if (query || dateFrom || dateTo) {
      return (
      ['and']
        .concat(query ? [query] : [])
        .concat(dateFrom ? [['>=', 'timestamp', moment.utc(dateFrom).startOf('day').toISOString()]] : [])
        .concat(dateTo ? [['<=', 'timestamp', moment.utc(dateTo).endOf('day').toISOString()]] : [])
      );
    }
    return null;
  }

  state: {
    dateFrom: string,
    dateTo: string,
  } = {
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
  };

  props: {
    config: {
      serverUrl: string,
    },
    queryParsed: ?queryT,
    location: Location,
    params: {
      tab: ?string,
    },
  };

  selectTab = (tab: string) => {
    history.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      query: this.props.location.query,
    });
  }

  changeDate = (which: string, value: string) => {
    this.setState({ [which]: value });
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
