import * as React from 'react';
import { Alert, Card, CardHeader } from 'reactstrap';
import { BarChart, Bar, Legend, Cell } from 'recharts';
import { List, Set } from 'immutable';

import * as PuppetDB from './../../../PuppetDB';

// Get all metrics for a category
const categoryMetrics = (
  category: string,
  metrics: List<PuppetDB.Metric>,
): List<PuppetDB.Metric> =>
  metrics.filter(metric => metric.category === category).toList();

// Return array of category names
const categories = (metrics: List<PuppetDB.Metric>): List<string> =>
  Set(metrics.map(metric => metric.category).values()).toList();

export default ({
  metrics,
  colors = List([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
  ]),
}: {
  readonly metrics: List<PuppetDB.Metric> | null;
  readonly colors?: List<string>;
}) => {
  if (metrics == null) {
    return <Alert color="warning">No metrics found</Alert>;
  }

  return (
    <div>
      {categories(List(metrics)).map(categoryName => {
        // Sort the metrics (need to make clone as sort is in place in JS)
        const data = categoryMetrics(categoryName, metrics).sort(
          (a, b) => a.value - b.value,
        );
        return (
          <Card key={categoryName}>
            <CardHeader>{categoryName}</CardHeader>
            <BarChart layout="horizontal" data={data.toArray()}>
              <Legend />
              <Bar dataKey="value">
                {data.map((_metric, index) => (
                  <Cell fill={colors.get(index % colors.size)} />
                ))}
              </Bar>
            </BarChart>
          </Card>
        );
      })}
    </div>
  );
};
