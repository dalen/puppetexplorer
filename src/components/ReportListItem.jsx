// @flow
import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router';

import ReportsHelper from '../helpers/ReportsHelper';

// Item of a ReportList
export default class ReportListItem extends React.Component {
  props: {
    report: reportT,
  };

  render() {
    return (
      <tr>
        <td><Link to={`/report/${this.props.report.hash}`}>
          <Moment fromNow ago title={this.props.report.end_time}>
            {this.props.report.end_time}</Moment></Link>
        </td>
        <td className="text-center">{ReportsHelper.metricValue(this.props.report.metrics.data, 'events', 'success')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.props.report.metrics.data, 'events', 'noop')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.props.report.metrics.data, 'events', 'skip')}</td>
        <td className="text-center">{ReportsHelper.metricValue(this.props.report.metrics.data, 'events', 'failure')}</td>
        <td className="text-right">
          {ReportsHelper.statusIcon(this.props.report.status)}
        </td>
      </tr>
    );
  }
}
