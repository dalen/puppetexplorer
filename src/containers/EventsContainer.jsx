// @flow
import React from 'react';

import EventList from '../components/EventList';
import paginatedList from '../components/PaginatedList';

const PaginatedNodeList = paginatedList(EventList, 'events', 'events');

// Takes care of feching events and passing it to event list
//
export default class EventListContainer extends React.Component {
  props: {
    config: {
      serverUrl: string,
    },
    queryParsed: queryT,
  };

  render(): React$Element<*> {
    return (<PaginatedNodeList
      serverUrl={this.props.config.serverUrl}
      listQuery={this.props.queryParsed}
      countQuery={['extract', [['function', 'count']], this.props.queryParsed]}
    />);
  }
}
