// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import NodeList from '../components/NodeList';

type props = {
  config: {
    serverUrl: string,
  },
  queryParsed: queryT,
};

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
  state: {
    nodes: nodeT[],
  };

  componentDidMount() {
    this.fetchNodes(this.props.config.serverUrl, this.props.queryParsed);
  }

  componentWillReceiveProps(nextProps: props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.queryParsed !== this.props.queryParsed) {
      this.fetchNodes(nextProps.config.serverUrl, nextProps.queryParsed);
    }
  }

  props: props;

  fetchNodes = (serverUrl: string, queryParsed: queryT) =>
    PuppetDB.query(serverUrl, 'nodes', queryParsed)
      .then(data => this.setState({ nodes: data }));

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
