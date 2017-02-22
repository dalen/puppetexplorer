// @flow
import React from 'react';

import NodeDetail from '../components/NodeDetail';

export default class NodeDetailContainer extends React.Component {
  props: {
    config: {
      serverUrl: string,
    },
    params: {
      node: string,
    },
  };

  render() {
    return (
      <NodeDetail node={this.props.params.node} serverUrl={this.props.config.serverUrl} />);
  }
}
