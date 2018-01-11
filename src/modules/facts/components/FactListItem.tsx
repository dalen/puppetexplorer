import * as React from 'react';
import { ListGroupItem, Glyphicon } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly fact: PuppetDB.FactPath.FactPath;
  readonly factPaths: ReadonlyArray<PuppetDB.FactPath.FactPath>;
  readonly activeFactCharts: OrderedSet<PuppetDB.FactPath.FactPath>;
  readonly toggleChart: (graph: PuppetDB.FactPath.FactPath) => void;
  readonly indent: number;
};

type State = { readonly expanded: boolean };

export default class FactListItem extends React.Component<Props, State> {
  readonly state = { expanded: false };

  readonly toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  readonly toggleChart = () => this.props.toggleChart(this.props.fact);

  // Check if this graph is active or not
  isActive(): boolean {
    return this.props.activeFactCharts.has(this.props.fact);
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
    const { fact, factPaths } = this.props;
    if (
      PuppetDB.FactPath.isLeaf(fact, factPaths) ||
      PuppetDB.FactPath.isArrayLeaf(fact, factPaths)
    ) {
      return (
        <ListGroupItem onClick={this.toggleChart} active={this.isActive()}>
          {this.indent()}
          <Glyphicon glyph="stats" /> {PuppetDB.FactPath.name(fact)}
        </ListGroupItem>
      );
    }
    return (
      <div style={{ marginBottom: '-1px' }}>
        <ListGroupItem
          bsStyle={this.state.expanded ? 'info' : ''}
          onClick={this.toggle}
        >
          {this.indent()}
          <Glyphicon glyph={this.state.expanded ? 'collapse-up' : 'expand'} />
          {PuppetDB.FactPath.name(fact)}
        </ListGroupItem>
        {this.state.expanded &&
          PuppetDB.FactPath.directChildren(fact, factPaths).map(child => (
            <FactListItem
              fact={child}
              factPaths={factPaths}
              key={child.path.join('.')}
              activeFactCharts={this.props.activeFactCharts}
              toggleChart={this.props.toggleChart}
              indent={this.props.indent + 1}
            />
          ))}
      </div>
    );
  }
}
