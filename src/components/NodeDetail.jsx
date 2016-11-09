// @flow
import React from 'react';

export default class NodeDetail extends React.Component {
  props: {
    node: string,
  };

  render() {
    return (<h1>{this.props.node}</h1>);
  }
}
