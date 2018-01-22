import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Maybe from 'maybe.ts';

import * as PuppetDB from '../../PuppetDB';

export const statusIcon = (status: string): JSX.Element => {
  switch (status) {
    case 'failed':
      return <Icon name="warning" className="text-danger" />;
    case 'changed':
      return <Icon name="exclamation-sign" className="text-success" />;
    case 'unchanged':
      return <Icon name="exclamation-sign" className="text-success" />;
    default:
      return <Icon name="exclamation-sign" />;
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
