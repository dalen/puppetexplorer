// @flow
import React from 'react';
import { Table, Label, Alert } from 'react-bootstrap';

import NodeListItem from './NodeListItem';

export default (props: { nodes: nodeT[], total: number, serverUrl: string }) =>
  (props.total === 0
    ? <Alert bsStyle="warning">No nodes found</Alert>
    : <Table striped>
      <thead>
        <tr>
          <th>
            <Label>
              {props.total === 1 ? '1 node found' : `${props.total} nodes found`}
            </Label>
          </th>
          <th>Last run</th>
          <th style={{ textAlign: 'center' }}>Successes</th>
          <th style={{ textAlign: 'center' }}>Noops</th>
          <th style={{ textAlign: 'center' }}>Skips</th>
          <th style={{ textAlign: 'center' }}>Failures</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {props.nodes.map(node =>
          <NodeListItem node={node} serverUrl={props.serverUrl} key={node.certname} />,
        )}
      </tbody>
    </Table>);
