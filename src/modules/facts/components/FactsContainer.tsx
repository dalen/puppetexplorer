import * as React from 'react';
import { Progress } from 'reactstrap';
import { OrderedSet } from 'immutable';

import * as PuppetDB from '../../../PuppetDB';
import Facts from './Facts';

type Props = {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.Query | null;
  readonly queryString: string | null;
  readonly updateQuery: (query: string) => void;
};

type State = {
  readonly factPaths?: ReadonlyArray<PuppetDB.FactPath.FactPath>;
  readonly activeFactCharts: OrderedSet<PuppetDB.FactPath.FactPath>;
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component<Props, State> {
  readonly state: State = { activeFactCharts: OrderedSet.of() };

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
    }).then((data: ReadonlyArray<PuppetDB.FactPath.FactPath>) => {
      this.setState({ factPaths: data });
    });
  }

  readonly toggleChart = (chart: PuppetDB.FactPath.FactPath) => {
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
  };

  // A fact value is selected, update query
  readonly factSelect = (fact: PuppetDB.FactPath.FactPath, value: any) => {
    const quotedValue =
      typeof value === 'number' || typeof value === 'boolean'
        ? value.toString()
        : typeof value === 'string'
          ? `"${value.replace('\\', '\\\\').replace('"', '\\"')}"`
          : null;

    if (quotedValue == null) {
      throw new TypeError(`Invalid fact value of type ${typeof value}`);
    }

    if (this.props.queryString != null) {
      this.props.updateQuery(
        `(this.props.queryString) and ${fact.path.join('.')}=${quotedValue}`,
      );
    } else {
      this.props.updateQuery(`${fact.path.join('.')}=${quotedValue}`);
    }
  };

  render(): JSX.Element {
    return this.state.factPaths !== undefined ? (
      <Facts
        serverUrl={this.props.serverUrl}
        factPaths={this.state.factPaths}
        activeFactCharts={this.state.activeFactCharts}
        toggleChart={this.toggleChart}
        queryParsed={this.props.queryParsed}
        factSelect={this.factSelect}
      />
    ) : (
      <Progress animated value={100}>
        Loading...
      </Progress>
    );
  }
}
