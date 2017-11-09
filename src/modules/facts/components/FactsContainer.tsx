import * as React from 'react';
import * as Label from 'react-bootstrap/lib/Label';
import { OrderedSet } from 'immutable';

import * as PuppetDB from '../../../PuppetDB';
import Facts from './Facts';
import FactTree from '../FactTree';

type Props = {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.queryT | null;
  readonly queryString: string | null;
  readonly updateQuery: (query: string) => void;
};

type State = {
  readonly factTree?: FactTree;
  readonly activeFactCharts: OrderedSet<PuppetDB.factPathT>;
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component<Props, State> {
  static readonly state: Partial<State> = { activeFactCharts: OrderedSet.of() };

  componentDidMount(): void {
    this.fetchFactPaths(this.props.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.serverUrl !== this.props.serverUrl) {
      this.fetchFactPaths(nextProps.serverUrl);
    }
  }

  fetchFactPaths(serverUrl: string): void {
    PuppetDB.query(serverUrl, 'fact-paths', {
      order_by: [{ field: 'path', order: 'asc' }],
    }).then((data: ReadonlyArray<PuppetDB.factPathApiT>) => {
      this.setState({ factTree: FactTree.fromFactPaths(data) });
    });
  }

  readonly toggleChart = (chart: PuppetDB.factPathT) => {
    // FIXME: update URL
    if (this.state.activeFactCharts.has(chart)) {
      this.setState({
        activeFactCharts: this.state.activeFactCharts.delete(chart),
      });
    } else {
      this.setState({
        activeFactCharts: this.state.activeFactCharts.add(chart),
      });
    }
  }

  // A fact value is selected, update query
  readonly factSelect = (fact: PuppetDB.factPathT, value: any) => {
    const quotedValue =
      typeof value === 'number' || typeof value === 'boolean'
        ? value.toString()
        : typeof value === 'string'
          ? `"${value.replace('\\', '\\\\').replace('"', '\\"')}"`
          : null;

    if (quotedValue == null) {
      throw new TypeError(`Invalid fact value of type ${typeof value}`);
    }

    if (this.props.queryString) {
      this.props.updateQuery(
        `(this.props.queryString) and ${fact.join('.')}=${quotedValue}`,
      );
    } else {
      this.props.updateQuery(`${fact.join('.')}=${quotedValue}`);
    }
  }

  render(): JSX.Element {
    return this.state.factTree !== undefined ? (
      <Facts
        serverUrl={this.props.serverUrl}
        factTree={this.state.factTree}
        activeFactCharts={this.state.activeFactCharts}
        toggleChart={this.toggleChart}
        queryParsed={this.props.queryParsed}
        factSelect={this.factSelect}
      />
    ) : (
      <Label>Loading...</Label>
    );
  }
}
