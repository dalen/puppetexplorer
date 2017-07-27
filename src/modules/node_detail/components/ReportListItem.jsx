// @flow
import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import { metricValue, statusIcon } from '../../reports';

// Item of a ReportList
export default (props: { report: reportT }) =>
  (<tr>
    <td>
      <Link to={`/report/${props.report.hash}`}>
        <Moment fromNow ago title={props.report.end_time}>
          {props.report.end_time}
        </Moment>
      </Link>
    </td>
    <td className="text-center">
      {metricValue(props.report.metrics.data, 'events', 'success').unwrapOr(null)}
    </td>
    <td className="text-center">
      {metricValue(props.report.metrics.data, 'events', 'noop').unwrapOr(null)}
    </td>
    <td className="text-center">
      {metricValue(props.report.metrics.data, 'events', 'skip').unwrapOr(null)}
    </td>
    <td className="text-center">
      {metricValue(props.report.metrics.data, 'events', 'failure').unwrapOr(null)}
    </td>
    <td className="text-right">
      {statusIcon(props.report.status)}
    </td>
  </tr>);
