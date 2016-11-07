import React from 'react';

import PuppetDB from '../PuppetDB';
import NodeList from '../components/NodeList';

// Takes care of feching nodes and passing it to node list
//
class NodeListContainer extends React.Component {
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
  queryParsed: React.PropTypes.array,
};

export default NodeListContainer;
