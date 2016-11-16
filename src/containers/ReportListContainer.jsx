// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import type { reportT } from '../types';
import ReportList from '../components/ReportList';

// Takes care of feching reports and passing it to report list
//
export default class ReportListContainer extends React.Component {
  state: {
    reports: reportT[],
  };

  state = {};

  componentDidMount() {
    this.fetchReports();
  }

  componentWillReceiveProps() {
    this.fetchReports();
  }

  props: {
    node: string,
    serverUrl: string,
  };

  fetchReports = () => {
    PuppetDB.query(this.props.serverUrl, 'reports',
      ['extract',
        ['hash', 'end_time', 'status', 'metrics'],
        ['=', 'certname', this.props.node]])
      .then(data => this.setState({ reports: data }));
  }

  render(): React$Element<*> {
    if (this.state.reports !== undefined) {
      return (
        <ReportList
          reports={this.state.reports}
        />);
    }
    return (<Label>Loading...</Label>);
  }
}
