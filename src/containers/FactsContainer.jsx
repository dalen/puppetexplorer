// @flow
import React from 'react';
import { List } from 'immutable';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import Facts from '../components/Facts';
import FactTree from '../classes/FactTree';

type Props = {
  config: {
    serverUrl: string,
  },
  location: Location,
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component {
  state: {
    factTree?: FactTree,
    graphFacts: List<List<factPathElementT>>,
  } = { graphFacts: List.of() };

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

  addGraph = (graph: List<factPathElementT>) => {
    this.setState({ graphFacts: this.state.graphFacts.push(graph) });
    console.log(graph.toJSON());
  }

  render(): React$Element<*> {
    if (this.state.factTree !== undefined) {
      return (
        <Facts
          serverUrl={this.props.config.serverUrl}
          factTree={this.state.factTree}
          graphFacts={this.state.graphFacts}
          addGraph={this.addGraph}
        />);
    }
    return (<Label>Loading...</Label>);
  }
}
