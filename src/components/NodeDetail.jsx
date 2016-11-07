import React from 'react';

class NodeDetail extends React.Component {
  render() {
    return (<h1>{this.props.node}</h1>);
  }
}

NodeDetail.propTypes = {
  node: React.PropTypes.string,
};

export default NodeDetail;
