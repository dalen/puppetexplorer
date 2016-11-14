// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import type { nodeT, queryT } from '../types';
import NodeList from '../components/NodeList';

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
  state: {
    nodes: nodeT[],
  };

  state = {};

  componentDidMount() {
    this.fetchNodes();
  }

  componentWillReceiveProps() {
    this.fetchNodes();
  }

  props: {
    config: {
      serverUrl: string,
    },
    queryParsed: queryT,
  };

  fetchNodes = () => {
    PuppetDB.query(this.props.config.serverUrl, 'nodes', this.props.queryParsed)
      .then(data => this.setState({ nodes: data }));
  }

  render() {
    if (this.state.nodes !== undefined) {
      return (
        <NodeList
          nodes={this.state.nodes}
          serverUrl={this.props.config.serverUrl}
        />);
    }
    return (<Label>Loading...</Label>);
  }
}
