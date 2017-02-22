// @flow
import React from 'react';
import { Alert, Panel } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

export default class ReportMetrics extends React.Component {
  static defaultProps = {
    colors: [
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
  }

  props: {
    metrics: ?metricT[],
    colors: string[],
  };

  render() {
    if (this.props.metrics) {
      // Create a nested Map with category -> name -> value for the metrics
      const categories = this.props.metrics.reduce((ret, metric) => {
        if (!ret.has(metric.category)) {
          ret.set(metric.category, new Map());
        }
        ret.get(metric.category).set(metric.name, metric.value);
        return ret;
      }, new Map());

      return (
        <div>
          {Array.from(categories.entries()).map((metricCategory) => {
            const [categoryName, metrics] = metricCategory;
            // Add color and annotation to each data row, then sort them by value
            const data = Array.from(metrics.entries()).map(
              (item, i) => [...item, this.props.colors[i], item[1]]).sort(
              (a, b) => a[1] - b[1]);
            return (<Panel header={categoryName} key={categoryName}>
              <Chart
                chartType="BarChart"
                data={[['Metric', 'Value', { role: 'style' }, { role: 'annotation' }], ...data]}
                options={{
                  legend: false,
                  chartArea: {
                    left: 200,
                    top: 0,
                    bottom: 30,
                  },
                  width: 500,
                  height: (metrics.size * 30) + 30,
                  tooltip: { trigger: 'none' },
                  fontSize: 15,
                }}
                height={`${(metrics.size * 30) + 30}px`}
                graph_id={categoryName}
              />
            </Panel>);
          })
          }
        </div>
      );
    }
    return (<Alert bsStyle="warning">No metrics found</Alert>);
  }
}
