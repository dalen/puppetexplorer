import * as React from 'react';
import { ListGroupItem, Glyphicon } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactTree from '../FactTree';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  factTreeItem: FactTree,
  activeFactCharts: OrderedSet<PuppetDB.factPathT>,
  toggleChart: (graph: PuppetDB.factPathT) => void,
  indent: number,
};

type State = { expanded: boolean };

export default class FactListItem extends React.Component<Props, State> {
  state = { expanded: false };

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  toggleChart = () => this.props.toggleChart(this.props.factTreeItem.path);

  // Check if this graph is active or not
  isActive(): boolean {
    return this.props.activeFactCharts.has(this.props.factTreeItem.path);
  }

  indent(): JSX.Element | null {
    if (this.props.indent > 0) {
      // \u00a0 is a non breaking space in unicode
      return (
        <span>
          {[this.props.indent].map(() => '').join('\u00a0\u00a0\u00a0')}└{' '}
        </span>
      );
    }
    return null;
  }

  render(): JSX.Element {
    const factTree = this.props.factTreeItem;
    if (factTree.children.length === 0 || factTree.arrayLeaf()) {
      return (
        <ListGroupItem onClick={this.toggleChart} active={this.isActive()}>
          {this.indent()}
          <Glyphicon glyph="stats" /> {factTree.name()}
        </ListGroupItem>
      );
    }
    return (
      <div style={{ marginBottom: '-1px' }}>
        <ListGroupItem bsStyle={this.state.expanded ? 'info' : ''} onClick={this.toggle}>
          {this.indent()}
          <Glyphicon glyph={this.state.expanded ? 'collapse-up' : 'expand'} /> {factTree.name()}
        </ListGroupItem>
        {this.state.expanded &&
          factTree.children.map(child =>
            (<FactListItem
              factTreeItem={child}
              key={child.path.join('.')}
              activeFactCharts={this.props.activeFactCharts}
              toggleChart={this.props.toggleChart}
              indent={this.props.indent + 1}
            />),
          )}
      </div>
    );
  }
}
