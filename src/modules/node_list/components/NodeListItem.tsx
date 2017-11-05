import * as React from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

import { metricValue, statusIcon } from '../../reports';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  serverUrl: string,
  node: PuppetDB.nodeT,
};

type State = {
  metrics: any[],
};

export default class NodeListItem extends React.Component<Props, State> {
  state = { metrics: [] };

  componentDidMount() {
    this.fetchMetrics();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.serverUrl !== this.props.serverUrl || nextProps.node !== this.props.node) {
      this.fetchMetrics();
    }
  }

  fetchMetrics() {
    type metricT = {
      category: string,
      name: string,
      value: number,
    };
    PuppetDB.get(
      this.props.serverUrl,
      `pdb/query/v4/reports/${this.props.node.latest_report_hash}/metrics`,
    ).then((data: metricT[]) => {
      this.setState({ metrics: data });
    });
  }

  render() {
    return (
      <tr>
        <td>
          <Link to={`/node/${this.props.node.certname}`}>
            {this.props.node.certname}
          </Link>
        </td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glyph="warning-sign" bsClass="text-warning" />
          <Moment fromNow ago title={this.props.node.report_timestamp}>
            {this.props.node.report_timestamp}
          </Moment>
        </td>
        <td className="text-center">
          {metricValue(this.state.metrics, 'events', 'success').unwrapOr(null)}
        </td>
        <td className="text-center">
          {metricValue(this.state.metrics, 'events', 'noop').unwrapOr(null)}
        </td>
        <td className="text-center">
          {metricValue(this.state.metrics, 'events', 'skip').unwrapOr(null)}
        </td>
        <td className="text-center">
          {metricValue(this.state.metrics, 'events', 'failure').unwrapOr(null)}
        </td>
        <td className="text-right">
          {statusIcon(this.props.node.latest_report_status)}
        </td>
      </tr>
    );
  }
}
