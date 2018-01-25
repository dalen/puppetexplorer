import * as React from 'react';
import { History, Location } from 'history';
import { Switch, Route } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import * as moment from 'moment';
import * as qs from 'qs';

import { updateSearch } from '../../../util';
import RouterNavLink from '../../../components/RouterNavLink';
import Events from './Events';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.Query | null;
  readonly location: Location;
  readonly history: History;
  readonly tab: string | null;
  readonly search: { readonly [id: string]: any };
};

const changeDate = (history: History, which: string, value: string) => {
  updateSearch(history, {
    [which]: moment(value).format('YYYY-MM-DD'),
  });
};

const dateRangeEventQuery = (
  query: PuppetDB.Query | null,
  dateFrom: string,
  dateTo: string,
): PuppetDB.Query | null => {
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
};

// Compute an event query based on date range
const getDate = (search: string, which: string): string => {
  const searchParsed = qs.parse(search);
  if (typeof searchParsed[which] === 'string') {
    return moment.utc(searchParsed[which]).format('YYYY-MM-DD');
  }
  return moment().format('YYYY-MM-DD');
};

export default (props: Props) => {
  const dateFrom = getDate(props.history.location.search, 'dateFrom');
  const dateTo = getDate(props.history.location.search, 'dateTo');

  return (
    <Container fluid>
      <Nav tabs>
        <NavItem>
          <RouterNavLink exact to={`/events`}>
            Latest Report
          </RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to={`/events/daterange`}>Date Range</RouterNavLink>
        </NavItem>
      </Nav>
      <Switch>
        <Route
          path="/events/daterange"
          render={({ history }) => (
            <Container fluid>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>From:</Label>
                    <Input
                      value={dateFrom}
                      onChange={event =>
                        changeDate(history, 'dateFrom', event.target.value)
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
                        changeDate(history, 'dateTo', event.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          )}
        />
      </Switch>
      <Events
        serverUrl={props.serverUrl}
        queryParsed={dateRangeEventQuery(props.queryParsed, dateFrom, dateTo)}
      />
    </Container>
  );
};
