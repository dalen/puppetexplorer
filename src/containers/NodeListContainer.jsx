// @flow
import React from 'react';

import NodeList from '../components/NodeList';
import paginatedList from '../components/PaginatedList';

const PaginatedNodeList = paginatedList(NodeList, 'nodes', 'nodes');

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
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
