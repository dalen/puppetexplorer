import * as React from 'react';
import { Label } from 'react-bootstrap';

import * as PuppetDB from '../../../PuppetDB';
import Report from '../components/Report';

type Props = {
  serverUrl: string,
  reportHash: string,
};

type State = { report?: PuppetDB.reportT };

// Fetch a report and pass it to the Report component
export default class ReportContainer extends React.Component<Props, State> {
  componentDidMount() {
    this.fetchReport(this.props.serverUrl, this.props.reportHash);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.reportHash !== this.props.reportHash
    ) {
      this.fetchReport(nextProps.serverUrl, nextProps.reportHash);
    }
  }

  fetchReport(serverUrl: string, reportHash: string) {
    PuppetDB.query(serverUrl, 'reports', {
      query: ['=', 'hash', reportHash],
    }).then((data: PuppetDB.reportT[]) => {
      if (data.length === 1) {
        this.setState({ report: data[0] });
      } else {
        throw new Error(`Could not find report ${reportHash}`);
      }
    });
  }

  render() {
    if (this.state && this.state.report !== undefined) {
      return <Report report={this.state.report} />;
    }
    return <Label>Loading...</Label>;
  }
}
