import * as React from 'react';
import { Table, Alert, Label } from 'reactstrap';

import NodeListItem from './NodeListItem';
import * as PuppetDB from '../../../PuppetDB';

export default (props: {
  readonly nodes: ReadonlyArray<PuppetDB.Node>;
  readonly total: number;
  readonly serverUrl: string;
}) =>
  props.total === 0 ? (
    <Alert color="warning">No nodes found</Alert>
  ) : (
    <Table striped>
      <thead>
        <tr>
          <th>
            {props.total === undefined ? null : (
              <Label>
                {props.total === 1
                  ? '1 node found'
                  : `${props.total} nodes found`}
              </Label>
            )}
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
        {props.nodes.map(node => (
          <NodeListItem
            node={node}
            serverUrl={props.serverUrl}
            key={node.certname}
          />
        ))}
      </tbody>
    </Table>
  );
