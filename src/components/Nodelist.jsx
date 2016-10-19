import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import NodeListItem from './NodeListItem';

class NodeList extends React.Component {
  render() {
    if (this.props.nodes.length === 0) {
      return (
        <Alert bsStyle="warning">No nodes found</Alert>
      );
    }

    return (
      <Table striped>
        <thead><tr>
          <th><Label>
            { this.props.nodes.length === 1 ?
               '1 node found' : `${this.props.nodes.length} nodes found`}
          </Label></th>
          <th>Last run</th>
          <th style={{ 'text-align': 'center' }}>Successes</th>
          <th style={{ 'text-align': 'center' }}>Noops</th>
          <th style={{ 'text-align': 'center' }}>Skips</th>
          <th style={{ 'text-align': 'center' }}>Failures</th>
          <th />
        </tr></thead>
        <tbody>
          {this.nodes.map(node =>
            <NodeListItem node={node} />
          )}
        </tbody>
      </Table>
    );
  }
}

NodeList.propTypes = {
  nodes: React.PropTypes.array, // TODO: specify
};


NodeList.defaultProps = {
  nodes: [],
};

export default NodeList;
