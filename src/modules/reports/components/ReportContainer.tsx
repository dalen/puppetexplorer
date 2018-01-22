import * as React from 'react';
import { Progress } from 'reactstrap';

import * as PuppetDB from '../../../PuppetDB';
import Report from '../components/Report';

type Props = {
  readonly serverUrl: string;
  readonly reportHash: string;
};

type State = { readonly report?: PuppetDB.reportT };

// Fetch a report and pass it to the Report component
export default class ReportContainer extends React.Component<Props, State> {
  componentDidMount(): void {
    this.fetchReport(this.props.serverUrl, this.props.reportHash);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.reportHash !== this.props.reportHash
    ) {
      this.fetchReport(nextProps.serverUrl, nextProps.reportHash);
    }
  }

  fetchReport(serverUrl: string, reportHash: string): void {
    PuppetDB.query(serverUrl, 'reports', {
      query: ['=', 'hash', reportHash],
    }).then((data: ReadonlyArray<PuppetDB.reportT>) => {
      if (data.length === 1) {
        this.setState({ report: data[0] });
      } else {
        throw new Error(`Could not find report ${reportHash}`);
      }
    });
  }

  render(): JSX.Element {
    if (this.state && this.state.report !== undefined) {
      return <Report report={this.state.report} />;
    }
    return (
      <Progress animated value={100}>
        Loading...
      </Progress>
    );
  }
}
