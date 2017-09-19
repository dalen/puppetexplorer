// @flow
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactListItem from './FactListItem';
import FactTree from '../FactTree';

type Props = {
  factTree: FactTree,
  activeFactCharts: OrderedSet<factPathT>,
  toggleChart: (graph: factPathT) => void,
  indent: number,
};

export default class FactList extends React.Component<Props> {
  static defaultProps = {
    indent: 0,
  };

  render() {
    return (
      <ListGroup>
        {this.props.factTree.children.map(child =>
          (<FactListItem
            factTreeItem={child}
            key={child.path.join('.')}
            activeFactCharts={this.props.activeFactCharts}
            toggleChart={this.props.toggleChart}
            indent={this.props.indent}
          />),
        )}
      </ListGroup>
    );
  }
}
