// @flow
import React from 'react';
import { List, OrderedSet } from 'immutable';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import Facts from '../components/Facts';
import FactTree from '../classes/FactTree';

type Props = {
  config: {
    serverUrl: string,
  },
  location: Location,
  queryParsed: queryT,
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component {
  state: {
    factTree?: FactTree,
    activeFactCharts: OrderedSet<List<factPathElementT>>,
  } = { activeFactCharts: OrderedSet.of() };

  componentDidMount() {
    this.fetchFactPaths(this.props.config.serverUrl);
  }

  /* componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.params.reportHash !== this.props.params.reportHash) {
      this.fetchReport(nextProps.config.serverUrl, nextProps.params.reportHash);
    }
  } */

  props: Props

  fetchFactPaths(serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-paths', {
      order_by: [{ field: 'path', order: 'asc' }],
    }).then((data: factPathT[]) => {
      this.setState({ factTree: FactTree.fromFactPaths(data) });
    });
  }

  toggleChart = (graph: List<factPathElementT>) => {
    if (this.state.activeFactCharts.find(f => f.equals(graph)) === undefined) {
      this.setState({ activeFactCharts: this.state.activeFactCharts.add(graph) });
    } else {
      this.setState({ activeFactCharts: this.state.activeFactCharts.delete(graph) });
    }
  }

  render(): React$Element<*> {
    if (this.state.factTree !== undefined) {
      return (
        <Facts
          serverUrl={this.props.config.serverUrl}
          factTree={this.state.factTree}
          activeFactCharts={this.state.activeFactCharts}
          toggleChart={this.toggleChart}
          queryParsed={this.props.queryParsed}
        />);
    }
    return (<Label>Loading...</Label>);
  }
}
