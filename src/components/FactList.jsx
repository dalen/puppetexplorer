// @flow
import React from 'react';
import { List } from 'immutable';
import { ListGroup } from 'react-bootstrap';

import FactListItem from './FactListItem';
import FactTree from '../classes/FactTree';

export default class FactList extends React.Component {
  static defaultProps = {
    indent: 0,
  };

  props: {
    factTree: FactTree,
    graphFacts: List<factPathElementT[]>,
    addGraph: (graph: factPathElementT[]) => void,
    indent: number,
  };

  render(): React$Element<*> {
    return (
      <ListGroup>
        {this.props.factTree.children.map(child =>
          <FactListItem
            factTreeItem={child} key={child.path.join('.')}
            graphFacts={this.props.graphFacts}
            addGraph={this.props.addGraph}
            indent={this.props.indent}
          />)}
      </ListGroup>
    );
  }
}
