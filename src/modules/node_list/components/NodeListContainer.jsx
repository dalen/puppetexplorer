// @flow
import React from 'react';

import NodeList from './NodeList';
import paginatedList from '../../../components/PaginatedList';

const PaginatedNodeList = paginatedList(NodeList, 'nodes', 'nodes');

// FIXME: Rename this to PaginatedNodeList
//
export default class NodeListContainer extends React.Component {
  props: {
    serverUrl: string,
    queryParsed: ?queryT,
  };

  render() {
    return (<PaginatedNodeList
      serverUrl={this.props.serverUrl}
      listQuery={this.props.queryParsed}
      countQuery={['extract', [['function', 'count']], this.props.queryParsed]}
    />);
  }
}
