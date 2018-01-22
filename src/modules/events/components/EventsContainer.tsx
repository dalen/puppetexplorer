import * as React from 'react';
import { History, Location } from 'history';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import * as moment from 'moment';

import Events from './Events';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.Query | null;
  readonly location: Location;
  readonly history: History;
  readonly tab: string | null;
  readonly updateSearch: (updates: { readonly [id: string]: any }) => void;
  readonly search: { readonly [id: string]: any };
};

export default class EventListContainer extends React.Component<Props> {
  // Compute an event query based on date range
  static dateRangeEventQuery(
    query: PuppetDB.Query | null,
    dateFrom: string,
    dateTo: string,
  ): PuppetDB.Query | null {
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
            '<=',
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
      return moment.utc(this.props.search[which]).format('YYYY-MM-DD');
    }
    return moment().format('YYYY-MM-DD');
  }

  readonly selectTab = (tab: any) => {
    this.props.history.push({
      pathname: tab === 'latest' ? '/events' : '/events/daterange',
      search: this.props.location.search,
    });
  };

  readonly changeDate = (which: string, value: string) => {
    console.log(event);
    this.props.updateSearch({
      [which]: moment(value).format('YYYY-MM-DD'),
    });
  };

  render(): JSX.Element {
    const dateFrom = this.getDate('dateFrom');
    const dateTo = this.getDate('dateTo');

    return (
      <Container fluid>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={this.props.tab === 'latest'}
              onClick={() => this.selectTab('latest')}
            >
              Latest Report
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.props.tab === 'daterange'}
              onClick={() => this.selectTab('latest')}
            >
              Date Range
            </NavLink>
          </NavItem>
        </Nav>
        <Container fluid>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>From:</Label>
                <Input
                  value={dateFrom}
                  onChange={event =>
                    this.changeDate('dateFrom', event.target.value)
                  }
                  type="date"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>To:</Label>
                <Input
                  value={dateTo}
                  type="date"
                  onChange={event =>
                    this.changeDate('dateTo', event.target.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        </Container>
        <Events
          serverUrl={this.props.serverUrl}
          queryParsed={EventListContainer.dateRangeEventQuery(
            this.props.queryParsed,
            dateFrom,
            dateTo,
          )}
        />
      </Container>
    );
  }
}
