// @flow
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export const statusIcon = (status: string): React$Element<Glyphicon> => {
  switch (status) {
    case 'failed': return (<Glyphicon glyph="warning" className="text-danger" />);
    case 'changed': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
    case 'unchanged': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
    default: return (<Glyphicon glyph="exclamation-sign" />);
  }
};

// Create a nested map out of all the metrics
export const metricValue = (metrics: Array<*>, category: string, name: string): ?number => {
  const ret = metrics.find(metric => metric.category === category && metric.name === name);
  if (ret) { return ret.value; }
  return ret;
};
