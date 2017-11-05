import * as React from 'react';

import NodeList from './NodeList';
import * as PuppetDB from '../../../PuppetDB';
import paginatedList from '../../../components/PaginatedList';

const PaginatedNodeList = paginatedList(NodeList, 'nodes', 'nodes');

// FIXME: Rename this to PaginatedNodeList
export default (props: { serverUrl: string, queryParsed: PuppetDB.queryT }) =>
  (<PaginatedNodeList
    serverUrl={props.serverUrl}
    listQuery={props.queryParsed}
    countQuery={['extract', [['function', 'count']], props.queryParsed]}
  />);
