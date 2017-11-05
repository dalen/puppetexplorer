import * as React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { metricValue, statusIcon } from '../../reports';
import * as PuppetDB from '../../../PuppetDB';

// Item of a ReportList
export default (props: { report: PuppetDB.reportT }) => (
  <tr>
    <td>
      <Link to={`/report/${props.report.hash}`}>
        <span title={props.report.end_time}>
          <Moment fromNow ago>
            {props.report.end_time}
          </Moment>
        </span>
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
    <td className="text-right">{statusIcon(props.report.status)}</td>
  </tr>
);
