import * as React from 'react';
import { ListGroup } from 'reactstrap';
import { OrderedSet } from 'immutable';

import FactListItem from './FactListItem';
import * as PuppetDB from '../../../PuppetDB';

export default (props: {
  readonly factPaths: ReadonlyArray<PuppetDB.FactPath.FactPath>;
  readonly activeFactCharts: OrderedSet<PuppetDB.FactPath.FactPath>;
  readonly toggleChart: (graph: PuppetDB.FactPath.FactPath) => void;
  readonly indent: number;
}): JSX.Element => {
  return (
    <ListGroup>
      {PuppetDB.FactPath.topLevel(props.factPaths).map(child => (
        <FactListItem
          fact={child}
          factPaths={props.factPaths}
          key={child.path.join('.')}
          activeFactCharts={props.activeFactCharts}
          toggleChart={props.toggleChart}
          indent={props.indent}
        />
      ))}
    </ListGroup>
  );
};
