// @flow
import React from 'react';
import { FormControl, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { browserHistory as history } from 'react-router';

import Events from '../components/Events';

export default class EventListContainer extends React.Component {
  props: {
    config: {
      serverUrl: string,
    },
    queryParsed: queryT,
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

  render() {
    return (
      <Tabs activeKey={this.props.params.tab || 'latest'} onSelect={this.selectTab} id="controlled-tab-example">
        <Tab eventKey={'latest'} title="Latest Report" style={{ paddingTop: 10 }}>
          <Events
            serverUrl={this.props.config.serverUrl}
            queryParsed={this.props.queryParsed}
          />
        </Tab>
        <Tab eventKey={'daterange'} title="Date Range" style={{ paddingTop: 10 }}>
          <InputGroup>
            <FormControl type="text" />
          </InputGroup>
          <Events
            serverUrl={this.props.config.serverUrl}
            queryParsed={this.props.queryParsed}
          />
        </Tab>
      </Tabs>
    );
  }
}
