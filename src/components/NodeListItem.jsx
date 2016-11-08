import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

import PuppetDB from '../PuppetDB';

export default class NodeListItem extends React.Component {
  static statusIcon(status) {
    switch (status) {
      case 'failed': return (<Glyphicon glyph="warning" className="text-danger" />);
      case 'changed': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
      case 'unchanged': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
      default: return (<Glyphicon glyph="exclamation-sign" />);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      metrics: {
        events: {},
      },
    };
  }

  componentDidMount() {
    this.fetchNodes();
  }

  componentWillReceiveProps() {
    this.fetchNodes();
  }

  fetchNodes() {
    PuppetDB.get(this.props.serverUrl, `pdb/query/v4/reports/${this.props.node.latest_report_hash}/metrics`)
      .then((data) => {
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
    const node = this.props.node;
    return (
      <tr>
        <td><Link to={`/node/${this.props.node.certname}`}>{this.props.node.certname}</Link></td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glyph="warning-sign" bsClass="text-warning" />
          <Moment fromNow ago title={node.report_timestamp}>{node.report_timestamp}</Moment>
        </td>
        <td className="text-center">{this.state.metrics.events.success}</td>
        <td className="text-center">{this.state.metrics.events.noop}</td>
        <td className="text-center">{this.state.metrics.events.skip}</td>
        <td className="text-center">{this.state.metrics.events.failure}</td>
        <td className="text-right">
          {NodeListItem.statusIcon(node.latest_report_status)}
        </td>
      </tr>
    );
  }
}

NodeListItem.propTypes = {
  serverUrl: React.PropTypes.string,
  node: React.PropTypes.shape({
    certname: React.PropTypes.string,
    catalog_timestamp: React.PropTypes.string,
    latest_report_status: React.PropTypes.string,
    latest_report_hash: React.PropTypes.string,
  }).isRequired, // TODO: specify shape
};
