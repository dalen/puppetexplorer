import React from 'react';

export default class NodeDetail extends React.Component {
  render() {
    return (<h1>{this.props.node}</h1>);
  }
}

NodeDetail.propTypes = {
  node: React.PropTypes.string,
};
