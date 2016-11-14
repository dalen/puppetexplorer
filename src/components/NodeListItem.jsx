// @flow
import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

import ReportsHelper from '../helpers/ReportsHelper';
import PuppetDB from '../PuppetDB';

import type { nodeT } from '../types';

export default class NodeListItem extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      metrics: {
        events: {},
      },
    };
  }

  state: {
    metrics: {
      [id:string]: {[id:string]: number}
    },
  };

  componentDidMount() {
    this.fetchNodes();
  }

  componentWillReceiveProps() {
    this.fetchNodes();
  }

  props: {
    serverUrl: string,
    node: nodeT,
  };

  fetchNodes() {
    type metricT = {
      category: string,
      name: string,
      value: number,
    };
    PuppetDB.get(this.props.serverUrl, `pdb/query/v4/reports/${this.props.node.latest_report_hash}/metrics`)
      .then((data: metricT[]) => {
        const metrics = {};
        // Create a nested hash out of all the metrics
        data.forEach((metric) => {
          if (metrics[metric.category] == null) { metrics[metric.category] = {}; }
          metrics[metric.category][metric.name] = metric.value;
        });
        this.setState({ metrics });
      });
  }

  render() {
    return (
      <tr>
        <td><Link to={`/node/${this.props.node.certname}`}>{this.props.node.certname}</Link></td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glyph="warning-sign" bsClass="text-warning" />
          <Moment
            fromNow ago title={this.props.node.report_timestamp}
          >{this.props.node.report_timestamp}</Moment>
        </td>
        <td className="text-center">{this.state.metrics.events.success}</td>
        <td className="text-center">{this.state.metrics.events.noop}</td>
        <td className="text-center">{this.state.metrics.events.skip}</td>
        <td className="text-center">{this.state.metrics.events.failure}</td>
        <td className="text-right">
          {ReportsHelper.statusIcon(this.props.node.latest_report_status)}
        </td>
      </tr>
    );
  }
}
