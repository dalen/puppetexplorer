import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import NodeListItem from './NodeListItem';

export default class NodeList extends React.Component {
  render() {
    if (this.props.nodes === undefined) { // FIXME: Move to container instead?
      return (<Label>Loading...</Label>);
    } else if (this.props.nodes.length === 0) {
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
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr></thead>
        <tbody>
          {this.props.nodes.map(node =>
            <NodeListItem
              node={node} serverUrl={this.props.serverUrl} key={node.certname}
            />)}
        </tbody>
      </Table>
    );
  }
}

NodeList.propTypes = {
  nodes: React.PropTypes.array, // TODO: specify
  serverUrl: React.PropTypes.string,
};
