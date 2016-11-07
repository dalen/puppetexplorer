import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

class NodeListItem extends React.Component {
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
    this.state = {};
  }

  render() {
    const node = this.props.node;
    return (
      <tr>
        <td><Link>{this.props.node.certname}</Link></td>
        <td title={this.props.node.catalog_timestamp}>
          <Glyphicon glyph="warning-sign" bsClass="text-warning" />
          <Moment fromNow ago title={node.report_timestamp}>{node.report_timestamp}</Moment>
        </td>
        <td className="text-center">{this.state.success}</td>
        <td className="text-center">{this.state.noop}</td>
        <td className="text-center">{this.state.skip}</td>
        <td className="text-center">{this.state.failure}</td>
        <td className="text-right">
          {NodeListItem.statusIcon(node.latest_report_status)}
        </td>
      </tr>
    );
  }
}

NodeListItem.propTypes = {
  node: React.PropTypes.object.isRequired, // TODO: specify shape
};

export default NodeListItem;
