// @flow
import React from 'react';
import type { Location, RouterHistory } from 'react-router-dom';
import { Grid, Col, Row, ControlLabel, FormGroup, Tabs, Tab } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';

import Events from './Events';
import PuppetDB from '../../../PuppetDB';

type Props = {
  serverUrl: string,
  queryParsed: ?queryT,
  location: Location,
  history: RouterHistory,
  tab: ?string,
  updateSearch: (updates: { [id: string]: mixed }) => void,
  search: { [id: string]: mixed },
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

  getDate(which: string): string {
    if (typeof this.props.search[which] === 'string') {
      return moment.utc(this.props.search[which]).toISOString();
    }
    return new Date().toISOString();
  }

  props: Props;

  selectTab = (tab: string) => {
    this.props.history.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      search: this.props.location.search,
    });
  }

  changeDate = (which: string, value: ?string) => {
    this.props.updateSearch({ [which]: value ? moment(value).format('YYYY-MM-DD') : undefined });
  }

  render() {
    const dateFrom = this.getDate('dateFrom');
    const dateTo = this.getDate('dateTo');

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
                    value={dateFrom}
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
                    value={dateTo}
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
              this.props.queryParsed, dateFrom, dateTo)}
          />
        </Tab>
      </Tabs>
    );
  }
}
