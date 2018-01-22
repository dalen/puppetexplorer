import * as React from 'react';
import { Alert, Card, CardHeader } from 'reactstrap';
import { BarChart, Bar, Legend, Cell } from 'recharts';

import * as PuppetDB from './../../../PuppetDB';
import * as hash from 'object-hash';

// Get all metrics for a category
const categoryMetrics = (
  category: string,
  metrics: ReadonlyArray<PuppetDB.Metric>,
): ReadonlyArray<PuppetDB.Metric> =>
  metrics.filter(metric => metric.category === category);

// Return array of category names
const categories = (
  metrics: ReadonlyArray<PuppetDB.Metric>,
): ReadonlyArray<string> =>
  Array.from(new Set(metrics.map(metric => metric.category)).values());

export default ({
  metrics,
  colors = [
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
  ],
}: {
  readonly metrics: ReadonlyArray<PuppetDB.Metric> | null;
  readonly colors?: ReadonlyArray<string>;
}) => {
  if (metrics == null) {
    return <Alert color="warning">No metrics found</Alert>;
  }

  return (
    <div>
      {categories(metrics).map(categoryName => {
        // Sort the metrics (need to make clone as sort is in place in JS)
        const data = [...categoryMetrics(categoryName, metrics)].sort(
          (a, b) => a.value - b.value,
        );
        return (
          <Card key={categoryName}>
            <CardHeader>{categoryName}</CardHeader>
            <BarChart layout="horizontal" data={data}>
              <Legend />
              <Bar dataKey="value">
                {data.map((metric, index) => (
                  <Cell
                    key={hash(metric)}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </Card>
        );
      })}
    </div>
  );
};
