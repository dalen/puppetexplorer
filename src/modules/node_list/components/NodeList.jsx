// @flow
import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import NodeListItem from './NodeListItem';

export default class NodeList extends React.Component {
  props: {
    nodes: nodeT[],
    total: number,
    serverUrl: string,
  };

  render() {
    if (this.props.total === 0) {
      return (
        <Alert bsStyle="warning">No nodes found</Alert>
      );
    }

    return (
      <Table striped>
        <thead><tr>
          <th><Label>
            { this.props.total === 1 ?
            '1 node found' : `${this.props.total} nodes found`}
          </Label></th>
          <th>Last run</th>
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr></thead>
        <tbody>
          {this.props.nodes.map(node =>
            (<NodeListItem
              node={node}
              serverUrl={this.props.serverUrl}
              key={node.certname}
            />))}
        </tbody>
      </Table>
    );
  }
}
