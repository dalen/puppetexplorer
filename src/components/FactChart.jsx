// @flow
import React from 'react';
import { Panel } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import dig from 'object-dig';

import PuppetDB from '../PuppetDB';

type Props = {
  serverUrl: string,
  fact: factPathT,
  queryParsed: queryT,
};

export default class FactChart extends React.Component {
  state: {
    data?: [string, number][],
    labels?: string[],
  } = {};

  componentDidMount() {
    this.fetchFactValue(this.props.fact, this.props.queryParsed, this.props.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.fact !== this.props.fact ||
      nextProps.queryParsed !== this.props.queryParsed) {
      this.fetchFactValue(nextProps.fact, nextProps.queryParsed, nextProps.serverUrl);
    }
  }

  props: Props;

  // When a slice is selected
  // FIXME: modify query
  select = (chart: Chart) => {
    console.log('Selected', dig(this.state.data, dig(chart.chart.getSelection(), 0, 'row'), 0));
  }

  chartEvents = [
    {
      eventName: 'select',
      callback: this.select,
    },
  ];

  fetchFactValue(fact: factPathT, nodeQuery: queryT, serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-contents', {
      query: ['extract',
        [['function', 'count'], 'value'],
        PuppetDB.combine(nodeQuery, (['=', 'path', fact]: queryT)),
        ['group_by', 'value'],
      ],
    }).then((data) => {
      this.setState({ data: data.map(item => [item.value.toString(), item.count]) });
    });
  }

  render() {
    if (this.state.data) {
      const factName = this.props.fact.join('.');
      return (
        <Panel header={factName} style={{ overflow: 'hidden' }}>
          <Chart
            chartType="PieChart"
            data={[['Value', 'Number']].concat(this.state.data)}
            options={{
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
              chartArea: {
                width: '100%',
                height: '100%',
                left: 10,
                top: 20,
              },
              pieSliceText: 'label',
            }}
            graph_id={factName}
            width="450px"
            height="300px"
            legend_toggle
            chartEvents={this.chartEvents}
          />
        </Panel>
      );
    }
    return null;
  }
}
