import * as React from 'react';
import * as ListGroup from 'react-bootstrap/lib/ListGroup';
import { OrderedSet } from 'immutable';

import FactListItem from './FactListItem';
import FactTree from '../FactTree';
import * as PuppetDB from '../../../PuppetDB';

export default (props: {
  readonly factTree: FactTree,
  readonly activeFactCharts: OrderedSet<PuppetDB.factPathT>,
  readonly toggleChart: (graph: PuppetDB.factPathT) => void,
  readonly indent: number,
}): JSX.Element =>  {
  return (
    <ListGroup>
      {props.factTree.children.map(child =>
        (<FactListItem
          factTreeItem={child}
          key={child.path.join('.')}
          activeFactCharts={props.activeFactCharts}
          toggleChart={props.toggleChart}
          indent={props.indent}
        />),
      )}
    </ListGroup>
  );
};
