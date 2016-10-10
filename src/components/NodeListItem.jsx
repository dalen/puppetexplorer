import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';

class NodeListItem extends React.Component {
  status() {
    switch (this.props.node.latest_report_status) {
      case 'failed': return (<Glyphicon glygh="warning" bsClass="text-danger" />);
      case 'changed': return (<Glyphicon glygh="exclamation-sign" bsClass="text-success" />);
      case 'unchanged': return (<Glyphicon glygh="exclamation-sign" bsClass="text-success" />);
      default: return (<Glyphicon glygh="exclamation-sign" />);
    }
  }

  render() {
    return (
      <tr>
        <td><Link>{this.props.node.certname}</Link></td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glygh="warning-sign" bsClass="text-warning" />
          {this.props.node.report_timestamp}
        </td>
        <td className="text-center">{this.props.node.metrics.events.success}</td>
        <td className="text-center">{this.props.node.metrics.events.noop}</td>
        <td className="text-center">{this.props.node.metrics.events.skip}</td>
        <td className="text-center">{this.props.node.metrics.events.failure}</td>
        <td className="text-right" ui-sref="root.events({node: node.certname})">
          {this.status()}
        </td>
      </tr>
    );
  }
}

NodeListItem.propTypes = {
  node: React.PropTypes.object.isRequired, // TODO: specify shape
};

export default NodeList;
