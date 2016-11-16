// @flow
import React from 'react';
import { Label } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';
import ReportList from '../components/ReportList';

// Takes care of feching reports and passing it to report list
//
export default class ReportListContainer extends React.Component {
  state: {
    reports?: reportT[],
    count?: number,
    page: number,
  } = {
    page: 1,
  };

  componentDidMount() {
    this.fetchReports(this.props.config.serverUrl);
  }

  componentWillReceiveProps() {
    this.fetchReports(this.props.config.serverUrl);
  }

  props: {
    node: string,
    serverUrl: string,
  };

  fetchReports(serverUrl: string, page: number) {
    PuppetDB.query(serverUrl, 'reports', {
      query: ['extract',
        ['hash', 'end_time', 'status', 'metrics'],
        ['=', 'certname', this.props.node]],
    }).then(data => this.setState({ reports: data }));
  }

  changePage = (page: number) => {
    this.setState({ page, nodes: [] });
    this.fetchReports(this.props.config.serverUrl, page);
  }

  render(): React$Element<*> {
    if (this.state.reports !== undefined) {
      return (
        <div>
          <ReportList
            reports={this.state.reports}
          />
          <Pagination
            count={this.state.count}
            perPage={this.props.perPage}
            activePage={this.state.page}
            onSelect={this.changePage}
          />
        </div>);
    }
    return (<Label>Loading...</Label>);
  }
}
