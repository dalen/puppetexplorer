// @flow
import React from 'react';
import { OrderedSet } from 'immutable';
import { ListGroup } from 'react-bootstrap';

import FactListItem from './FactListItem';
import FactTree from '../classes/FactTree';

export default class FactList extends React.Component {
  static defaultProps = {
    indent: 0,
  };

  props: {
    factTree: FactTree,
    activeFactCharts: OrderedSet<factPathElementT[]>,
    toggleChart: (graph: factPathElementT[]) => void,
    indent: number,
  };

  render(): React$Element<*> {
    return (
      <ListGroup>
        {this.props.factTree.children.map(child =>
          <FactListItem
            factTreeItem={child} key={child.path.join('.')}
            activeFactCharts={this.props.activeFactCharts}
            toggleChart={this.props.toggleChart}
            indent={this.props.indent}
          />)}
      </ListGroup>
    );
  }
}
