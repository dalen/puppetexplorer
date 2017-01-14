// @flow
import React from 'react';
import { Label } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

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
    activeFactCharts: OrderedSet<factPathT>,
  } = { activeFactCharts: OrderedSet.of() };

  componentDidMount() {
    this.fetchFactPaths(this.props.config.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl) {
      this.fetchFactPaths(nextProps.config.serverUrl);
    }
  }

  props: Props

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
