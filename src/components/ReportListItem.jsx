// @flow
import React from 'react';
import Moment from 'react-moment';

import ReportsHelper from '../helpers/ReportsHelper';

export default class NodeListItem extends React.Component {
  props: {
    report: reportT,
  };

  render(): React$Element<*> {
    return (
      <tr>
        <td>
          <Moment fromNow ago title={this.props.report.end_time}>
            {this.props.report.end_time}</Moment>
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
