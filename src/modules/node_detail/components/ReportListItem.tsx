import * as React from 'react';
import * as date from 'date-fns';
import { Link } from 'react-router-dom';
import * as Maybe from 'maybe.ts';

import { metricValue, statusIcon } from '../../reports/helpers';
import * as PuppetDB from '../../../PuppetDB';

// Item of a ReportList
export default (props: { readonly report: PuppetDB.Report }) => (
  <tr>
    <td>
      <Link to={`/report/${props.report.hash}/events`}>
        <span title={props.report.end_time}>
          {date.distanceInWordsToNow(date.parse(props.report.end_time))} ago
        </span>
      </Link>
    </td>
    <td className="text-center">
      {Maybe.toValue(
        null,
        metricValue(props.report.metrics.data, 'events', 'success'),
      )}
    </td>
    <td className="text-center">
      {Maybe.toValue(
        null,
        metricValue(props.report.metrics.data, 'events', 'noop'),
      )}
    </td>
    <td className="text-center">
      {Maybe.toValue(
        null,
        metricValue(props.report.metrics.data, 'events', 'skip'),
      )}
    </td>
    <td className="text-center">
      {Maybe.toValue(
        null,
        metricValue(props.report.metrics.data, 'events', 'failure'),
      )}
    </td>
    <td className="text-right">{statusIcon(props.report.status)}</td>
  </tr>
);
