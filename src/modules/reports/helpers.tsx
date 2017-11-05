import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as Maybe from 'maybe.ts';

export const statusIcon = (status: string): JSX.Element => {
  switch (status) {
    case 'failed':
      return <Glyphicon glyph="warning" className="text-danger" />;
    case 'changed':
      return <Glyphicon glyph="exclamation-sign" className="text-success" />;
    case 'unchanged':
      return <Glyphicon glyph="exclamation-sign" className="text-success" />;
    default:
      return <Glyphicon glyph="exclamation-sign" />;
  }
};

// Create a nested map out of all the metrics
export const metricValue = (metrics: any[], category: string, name: string): Maybe.Maybe<number> =>
  Maybe.map(
    metric => metric.value,
    metrics.find(metric => metric.category === category && metric.name === name),
  );
