// @flow
import React from 'react';
import { List, Range } from 'immutable';
import { ListGroupItem, Glyphicon } from 'react-bootstrap';

import FactList from './FactList';
import FactTree from '../classes/FactTree';

export default class FactListItem extends React.Component {
  state: { expanded: boolean } = { expanded: false };

  props: {
    factTreeItem: FactTree,
    graphFacts: List<factPathElementT[]>,
    addGraph: (graph: factPathElementT[]) => void,
    indent: number,
  };

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  addGraph = () => this.props.addGraph(this.props.factTreeItem.path);

  // Check if this graph is active or not
  isActive(): boolean {
    return (this.props.graphFacts.find(f => f.equals(this.props.factTreeItem.path)) !== undefined);
  }

  indent(): ?React$Element<*> {
    if (this.props.indent > 0) {
      // \u00a0 is a non breaking space in unicode
      return (<span>{Range(0, this.props.indent).map(() => '').join('\u00a0\u00a0\u00a0')}└ </span>);
    }
    return null;
  }

  render(): React$Element<*> {
    const factTree = this.props.factTreeItem;
    if (factTree.children.size === 0 || factTree.arrayLeaf()) {
      return (
        <ListGroupItem onClick={this.addGraph} active={this.isActive()}>
          {this.indent()}<Glyphicon glyph="stats" /> {factTree.name()}
        </ListGroupItem>
      );
    }
    return (
      <div>
        <ListGroupItem disabled={this.state.expanded} onClick={this.toggle}>
          {this.indent()}<Glyphicon glyph={this.state.expanded ? 'collapse-up' : 'expand'} /> {factTree.name()}
        </ListGroupItem>
        { this.state.expanded ? factTree.children.map(child =>
          <FactListItem
            factTreeItem={child} key={child.path.join('.')}
            graphFacts={this.props.graphFacts}
            addGraph={this.props.addGraph}
            indent={this.props.indent + 1}
          />) : null }
      </div>
    );
  }
}
