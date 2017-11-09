import * as React from 'react';
import { History, Location } from 'history';
import * as Grid from 'react-bootstrap/lib/Grid';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Tabs from 'react-bootstrap/lib/Tabs';
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel';
import * as FormGroup from 'react-bootstrap/lib/FormGroup';
import * as Tab from 'react-bootstrap/lib/Tab';
import * as DatePicker from 'react-bootstrap-date-picker';
import * as moment from 'moment';

import Events from './Events';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string,
  readonly queryParsed: PuppetDB.queryT | null,
  readonly location: Location,
  readonly history: History,
  readonly tab: string | null,
  readonly updateSearch: (updates: { readonly [id: string]: any }) => void,
  readonly search: { readonly [id: string]: any },
};

export default class EventListContainer extends React.Component<Props> {
  // Compute an event query based on date range
  static dateRangeEventQuery(query:
     PuppetDB.queryT | null,
                             dateFrom: string, dateTo: string): PuppetDB.queryT |null {
    return PuppetDB.combine(
      query,
      dateFrom
        ? [
          '>=',
          'timestamp',
          moment
            .utc(dateFrom)
            .startOf('day')
            .toISOString(),
        ]
        : null,
      dateTo
        ? [
          '<=' ,
          'timestamp',
          moment
            .utc(dateTo)
            .endOf('day')
            .toISOString(),
        ]
        : null,
    );
  }

  getDate(which: string): string {
    if (typeof this.props.search[which] === 'string') {
      return moment.utc(this.props.search[which]).toISOString();
    }
    return new Date().toISOString();
  }

  readonly selectTab = (tab: any) => {
    this.props.history.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      search: this.props.location.search,
    });
  }

  readonly changeDate = (which: string, value: string | null) => {
    this.props.updateSearch({ [which]: value ? moment(value).format('YYYY-MM-DD') : undefined });
  }

  render(): JSX.Element {
    const dateFrom = this.getDate('dateFrom');
    const dateTo = this.getDate('dateTo');

    return (
      <Tabs
        activeKey={this.props.tab || 'latest'}
        onSelect={this.selectTab}
        id="event-tabs"
        unmountOnExit
      >
        <Tab eventKey={'latest'} title="Latest Report" style={{ paddingTop: 10 }}>
          <Events serverUrl={this.props.serverUrl} queryParsed={this.props.queryParsed} />
        </Tab>
        <Tab eventKey={'daterange'} title="Date Range" style={{ paddingTop: 10 }}>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>From:</ControlLabel>
                  <DatePicker
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
              this.props.queryParsed,
              dateFrom,
              dateTo,
            )}
          />
        </Tab>
      </Tabs>
    );
  }
}
