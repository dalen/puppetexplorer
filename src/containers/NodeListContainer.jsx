// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import NodeList from '../components/NodeList';

type Props = {
  config: {
    serverUrl: string,
  },
  queryParsed: queryT,
};

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
  state: {
    nodes?: nodeT[],
    count?: number,
    page: number,
  } = {
    page: 1,
  };

  componentDidMount() {
    this.fetchNodes(this.props.config.serverUrl, this.props.queryParsed);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.queryParsed !== this.props.queryParsed) {
      this.fetchNodes(nextProps.config.serverUrl, nextProps.queryParsed);
      this.fetchNodes(nextProps.config.serverUrl, nextProps.queryParsed);
    }
  }

  props: Props;

  fetchNodes(serverUrl: string, queryParsed: queryT) {
    PuppetDB.query(serverUrl, 'nodes', {
      query: queryParsed,
      order_by: [{ field: 'certname', order: 'asc' }],
    }).then(data => this.setState({ nodes: data }));
  }

  fetchNodeCount(serverUrl: string, queryParsed: queryT) {
    PuppetDB.query(serverUrl, 'nodes', {
      query: ['extract', [['function', 'count']], queryParsed],
    }).then(data => this.setState({ count: data }));
  }

  render(): React$Element<*> {
    if (this.state && this.state.nodes !== undefined) {
      return (
        <NodeList
          nodes={this.state.nodes}
          serverUrl={this.props.config.serverUrl}
        />);
    }
    return (<Label>Loading...</Label>);
  }
}
