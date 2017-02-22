// @flow
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactListItem from './FactListItem';
import FactTree from '../classes/FactTree';

export default class FactList extends React.Component {
  static defaultProps = {
    indent: 0,
  };

  props: {
    factTree: FactTree,
    activeFactCharts: OrderedSet<factPathT>,
    toggleChart: (graph: factPathT) => void,
    indent: number,
  };

  render() {
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
