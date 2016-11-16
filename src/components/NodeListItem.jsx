// @flow
import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

import ReportsHelper from '../helpers/ReportsHelper';
import PuppetDB from '../PuppetDB';

type props = {
  serverUrl: string,
  node: nodeT,
};

export default class NodeListItem extends React.Component {
  state: {
    metrics: Array<*>,
  } = { metrics: [] };

  componentDidMount() {
    this.fetchMetrics();
  }

  componentWillReceiveProps(nextProps: props) {
    if (nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.node !== this.props.node) {
      this.fetchMetrics();
    }
  }

  props: props;

  fetchMetrics() {
    type metricT = {
      category: string,
      name: string,
      value: number,
    };
    PuppetDB.get(this.props.serverUrl, `pdb/query/v4/reports/${this.props.node.latest_report_hash}/metrics`)
      .then((data: metricT[]) => {
        this.setState({ metrics: data });
      });
  }

  render(): React$Element<*> {
    return (
      <tr>
        <td><Link to={`/node/${this.props.node.certname}`}>{this.props.node.certname}</Link></td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glyph="warning-sign" bsClass="text-warning" />
          <Moment
            fromNow ago title={this.props.node.report_timestamp}
          >{this.props.node.report_timestamp}</Moment>
        </td>
        <td className="text-center">{ReportsHelper.metricValue(this.state.metrics, 'events', 'success')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.state.metrics, 'events', 'noop')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.state.metrics, 'events', 'skip')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.state.metrics, 'events', 'failure')}</td>
        <td className="text-right">
          {ReportsHelper.statusIcon(this.props.node.latest_report_status)}
        </td>
      </tr>
    );
  }
}
