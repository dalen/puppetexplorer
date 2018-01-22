import * as React from 'react';

import NodeList from './NodeList';
import * as PuppetDB from '../../../PuppetDB';
import PaginatedList from '../../../components/PaginatedList';

const PaginatedNodeList = PaginatedList(NodeList, 'nodes', 'nodes');

export default (props: {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.Query | null;
}) => (
  <PaginatedNodeList
    serverUrl={props.serverUrl}
    listQuery={props.queryParsed}
    countQuery={['extract', [['function', 'count']], props.queryParsed]}
  />
);
