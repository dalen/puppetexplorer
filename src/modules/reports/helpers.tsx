import * as React from 'react';
import { FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import * as Maybe from 'maybe.ts';

import * as PuppetDB from '../../PuppetDB';

export const statusIcon = (status: string): JSX.Element => {
  switch (status) {
    case 'failed':
      return <FaExclamationCircle className="text-danger" />;
    case 'changed':
      return <FaExclamationTriangle className="text-success" />;
    case 'unchanged':
      return <FaExclamationTriangle className="text-success" />;
    default:
      return <FaExclamationTriangle />;
  }
};

// Create a nested map out of all the metrics
export const metricValue = (
  metrics: ReadonlyArray<PuppetDB.Metric>,
  category: string,
  name: string,
): Maybe.Maybe<number> =>
  Maybe.map(
    metric => metric.value,
    metrics.find(
      metric => metric.category === category && metric.name === name,
    ),
  );
