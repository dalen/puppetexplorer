import React from 'react';

import NodeDetail from '../components/NodeDetail';

class NodeDetailContainer extends React.Component {
  render() {
    return (
      <NodeDetail node={this.props.params.node} />);
  }
}

NodeDetailContainer.propTypes = {
  params: React.PropTypes.shape({
    node: React.PropTypes.string,
  }),
};

export default NodeDetailContainer;
