// @flow
import React from 'react';
import { ListGroupItem, Glyphicon } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactTree from '../FactTree';

export default class FactListItem extends React.Component {
  state: { expanded: boolean } = { expanded: false };

  props: {
    factTreeItem: FactTree,
    activeFactCharts: OrderedSet<factPathT>,
    toggleChart: (graph: factPathT) => void,
    indent: number,
  };

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  toggleChart = () => this.props.toggleChart(this.props.factTreeItem.path);

  // Check if this graph is active or not
  isActive(): boolean {
    return (this.props.activeFactCharts.has(this.props.factTreeItem.path));
  }

  indent(): ?React$Element<*> {
    if (this.props.indent > 0) {
      // \u00a0 is a non breaking space in unicode
      return (<span>{new Array(this.props.indent).map(() => '').join('\u00a0\u00a0\u00a0')}└ </span>);
    }
    return null;
  }

  render() {
    const factTree = this.props.factTreeItem;
    if (factTree.children.length === 0 || factTree.arrayLeaf()) {
      return (
        <ListGroupItem onClick={this.toggleChart} active={this.isActive()}>
          {this.indent()}<Glyphicon glyph="stats" /> {factTree.name()}
        </ListGroupItem>
      );
    }
    return (
      <div style={{ marginBottom: '-1px' }}>
        <ListGroupItem bsStyle={this.state.expanded ? 'info' : null} onClick={this.toggle}>
          {this.indent()}<Glyphicon glyph={this.state.expanded ? 'collapse-up' : 'expand'} /> {factTree.name()}
        </ListGroupItem>
        { this.state.expanded && factTree.children.map(child =>
          (<FactListItem
            factTreeItem={child} key={child.path.join('.')}
            activeFactCharts={this.props.activeFactCharts}
            toggleChart={this.props.toggleChart}
            indent={this.props.indent + 1}
          />)) }
      </div>
    );
  }
}
