// @flow
import React from 'react';
import type { Location, RouterHistory } from 'react-router-dom';
import { Grid, Col, Row, ControlLabel, FormGroup, Tabs, Tab } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';
import queryString from 'query-string';

import Events from '../components/Events';
import PuppetDB from '../PuppetDB';

type Props = {
  serverUrl: string,
  queryParsed: ?queryT,
  location: Location,
  history: RouterHistory,
  tab: ?string,
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
    const query = queryString.parse(this.props.location.search);
    const nextQuery = queryString.parse(nextProps.location.search);
    if (nextQuery.dateFrom !== query.dateFrom) {
      this.setState({ dateFrom: moment.utc(nextQuery.dateFrom).toISOString() });
    }
    if (nextQuery.dateFrom !== query.dateFrom) {
      this.setState({ dateTo: moment.utc(nextQuery.dateTo).toISOString() });
    }
  }

  props: Props;

  selectTab = (tab: string) => {
    this.props.history.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      search: this.props.location.search,
    });
  }

  changeDate = (which: string, value: ?string) => {
    this.setState({ [which]: value });
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: {
        ...queryString.parse(this.props.location.search),
        [which]: value ? moment(value).format('YYYY-MM-DD') : undefined,
      },
    });
  }

  render() {
    console.debug('EventsContainer', this.props);
    return (
      <Tabs activeKey={this.props.tab || 'latest'} onSelect={this.selectTab} id="event-tabs" unmountOnExit>
        <Tab eventKey={'latest'} title="Latest Report" style={{ paddingTop: 10 }}>
          <Events
            serverUrl={this.props.serverUrl}
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
            serverUrl={this.props.serverUrl}
            queryParsed={EventListContainer.dateRangeEventQuery(
              this.props.queryParsed, this.state.dateFrom, this.state.dateTo)}
          />
        </Tab>
      </Tabs>
    );
  }
}
