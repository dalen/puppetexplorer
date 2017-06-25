// @flow
import React from 'react';
import { Label } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import PuppetDB from '../../../PuppetDB';
import Facts from './Facts';
import FactTree from '../FactTree';

type Props = {
  serverUrl: string,
  queryParsed: ?queryT,
  queryString: ?string,
  updateQuery: (query: string) => void,
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component {
  state: {
    factTree?: FactTree,
    activeFactCharts: OrderedSet<factPathT>,
  } = { activeFactCharts: OrderedSet.of() };

  componentDidMount() {
    this.fetchFactPaths(this.props.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.serverUrl !== this.props.serverUrl) {
      this.fetchFactPaths(nextProps.serverUrl);
    }
  }

  props: Props;

  fetchFactPaths(serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-paths', {
      order_by: [{ field: 'path', order: 'asc' }],
    }).then((data: factPathApiT[]) => {
      this.setState({ factTree: FactTree.fromFactPaths(data) });
    });
  }

  toggleChart = (chart: factPathT) => {
    // FIXME: update URL
    if (this.state.activeFactCharts.has(chart)) {
      this.setState({ activeFactCharts: this.state.activeFactCharts.delete(chart) });
    } else {
      this.setState({ activeFactCharts: this.state.activeFactCharts.add(chart) });
    }
  };

  // A fact value is selected, update query
  factSelect = (fact: factPathT, value: mixed) => {
    let quotedValue;
    if (typeof value === 'number' || typeof value === 'boolean') {
      quotedValue = value.toString();
    } else if (typeof value === 'string') {
      quotedValue = `"${value.replace('\\', '\\\\').replace('"', '\\"')}"`;
    } else {
      throw new TypeError(`Invalid fact value of type ${typeof value}`);
    }
    if (this.props.queryString) {
      this.props.updateQuery(`(this.props.queryString) and ${fact.join('.')}=${quotedValue}`);
    } else {
      this.props.updateQuery(`${fact.join('.')}=${quotedValue}`);
    }
  };

  render() {
    return this.state.factTree !== undefined
      ? <Facts
        serverUrl={this.props.serverUrl}
        factTree={this.state.factTree}
        activeFactCharts={this.state.activeFactCharts}
        toggleChart={this.toggleChart}
        queryParsed={this.props.queryParsed}
        factSelect={this.factSelect}
      />
      : <Label>Loading...</Label>;
  }
}
