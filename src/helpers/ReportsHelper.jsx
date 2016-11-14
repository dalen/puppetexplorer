// @flow
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class ReportsHelper {
  static statusIcon(status) {
    switch (status) {
      case 'failed': return (<Glyphicon glyph="warning" className="text-danger" />);
      case 'changed': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
      case 'unchanged': return (<Glyphicon glyph="exclamation-sign" className="text-success" />);
      default: return (<Glyphicon glyph="exclamation-sign" />);
    }
  }

  // Create a nested hash out of all the metrics
  static calculateMetrics(metrics: Array<*>) {
    const result = {};
    metrics.forEach((metric) => {
      if (result[metric.category] == null) { result[metric.category] = {}; }
      result[metric.category][metric.name] = metric.value;
    });
  }
}
