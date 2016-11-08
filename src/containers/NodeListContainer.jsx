import React from 'react';

import PuppetDB from '../PuppetDB';
import PropTypes from '../PropTypes';
import NodeList from '../components/NodeList';

// Takes care of feching nodes and passing it to node list
//
export default class NodeListContainer extends React.Component {
  // FIXME useless?
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchNodes();
  }

  componentWillReceiveProps() {
    this.fetchNodes();
  }

  props: {
    config: string,
  };

  fetchNodes() {
    PuppetDB.query(this.props.config.serverUrl, 'nodes', this.props.queryParsed)
      .then(data => this.setState({ nodes: data }));
  }

  render() {
    return (
      <NodeList
        nodes={this.state.nodes}
        serverUrl={this.props.config.serverUrl}
      />);
  }
}

NodeListContainer.propTypes = {
  config: React.PropTypes.shape({
    serverUrl: React.PropTypes.string,
  }),
  queryParsed: PropTypes.query,
};
