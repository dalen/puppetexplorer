// @flow
import React from 'react';
import { Panel } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

import PuppetDB from '../PuppetDB';

type Props = {
  serverUrl: string,
  eventField: string,
  queryParsed: queryT,
  title: string,
  id: string,
};

export default class EventChart extends React.Component {
  state: {
    data?: [string, number][],
    labels?: string[],
  } = {};

  componentDidMount() {
    this.fetchEventValue(this.props.eventField, this.props.queryParsed, this.props.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.eventField !== this.props.eventField ||
      nextProps.queryParsed !== this.props.queryParsed) {
      this.fetchEventValue(nextProps.eventField, nextProps.queryParsed, nextProps.serverUrl);
    }
  }

  props: Props;

  // When a slice is selected
  // FIXME: modify query
  select = (chart: Chart) => {
    if (this.state.data) {
      console.log(chart);
      console.log(chart.chart.getSelection());
      const selection = chart.chart.getSelection();
      if (selection[0]) {
        console.log('Selected ', this.state.data[selection[0].row][0]);
      }
    }
  }

  chartEvents = [
    {
      eventName: 'select',
      callback: this.select,
    },
  ];

  fetchEventValue(eventField: string, nodeQuery: queryT, serverUrl: string) {
    PuppetDB.query(serverUrl, 'events', {
      query: ['extract',
        [['function', 'count'], eventField],
        nodeQuery,
        ['group_by', eventField],
      ],
    }).then((data) => {
      this.setState({ data: data.map(item => [item[eventField].toString(), item.count]) });
    });
  }

  render(): ?React$Element<*> {
    if (this.state.data) {
      return (
        <Panel header={this.props.title}>
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
                height: '85%',
              },
              pieSliceText: 'label',
            }}
            graph_id={this.props.id}
            height="250px"
            legend_toggle
            chartEvents={this.chartEvents}
          />
        </Panel>
      );
    }
    return null;
  }
}
