// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import Facts from '../components/Facts';

type Props = {
  config: {
    serverUrl: string,
  },
  location: Location,
};

// Fetch a report and pass it to the Report component
export default class FactsContainer extends React.Component {
  state: {
    factNames?: string[],
    factPaths?: factPathT[],
    factTree?: factTreeT,
  } = {};

  componentDidMount() {
    this.fetchFactNames(this.props.config.serverUrl);
    this.fetchFactPaths(this.props.config.serverUrl);
  }

  /* componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.params.reportHash !== this.props.params.reportHash) {
      this.fetchReport(nextProps.config.serverUrl, nextProps.params.reportHash);
    }
  } */

  props: Props;

  fetchFactNames(serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-names').then((data: string[]) => {
      this.setState({ factNames: data });
    });
  }

  fetchFactPaths(serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-paths', {
      order_by: [{ field: 'path', order: 'asc' }],
    }).then((data: factPathT[]) => {
      this.setState({ factPaths: data });
    });
  }

  render(): React$Element<*> {
    if (this.state.factNames !== undefined) {
      return (<Facts serverUrl={this.props.config.serverUrl} factNames={this.state.factNames} />);
    }
    return (<Label>Loading...</Label>);
  }
}
