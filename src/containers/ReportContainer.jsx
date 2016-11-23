// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import Report from '../components/Report';

type Props = {
  config: {
    serverUrl: string,
  },
  params: {
    reportHash: string,
  },
};

// Fetch a report and pass it to the Report component
export default class ReportContainer extends React.Component {
  state: { report?: reportT } = {};

  componentDidMount() {
    this.fetchReport(this.props.config.serverUrl, this.props.params.reportHash);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.params.reportHash !== this.props.params.reportHash) {
      this.fetchReport(nextProps.config.serverUrl, nextProps.params.reportHash);
    }
  }

  props: Props;

  fetchReport(serverUrl: string, reportHash: string) {
    PuppetDB.query(serverUrl, 'reports', {
      query: ['=', 'hash', reportHash],
    }).then((data: reportT[]) => {
      if (data.length === 1) {
        this.setState({ report: data[0] });
      } else {
        throw new Error(`Could not find report ${reportHash}`);
      }
    });
  }

  render(): React$Element<*> {
    if (this.state.report !== undefined) {
      return (<Report report={this.state.report} />);
    }
    return (<Label>Loading...</Label>);
  }
}
