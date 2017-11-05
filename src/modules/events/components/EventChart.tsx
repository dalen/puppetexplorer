// @flow
import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import objectDig from 'object-dig';

import * as PuppetDB from '../../../PuppetDB';

type Props = {
  serverUrl: string,
  eventField: string,
  queryParsed: PuppetDB.queryT | null,
  title: string,
  id: string,
};

type State = {
  data?: [string, number][],
  labels?: string[],
};

export default class EventChart extends React.Component<Props, State> {
  componentDidMount() {
    this.fetchEventValue(this.props.eventField, this.props.queryParsed, this.props.serverUrl);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.eventField !== this.props.eventField ||
      nextProps.queryParsed !== this.props.queryParsed
    ) {
      this.fetchEventValue(nextProps.eventField, nextProps.queryParsed, nextProps.serverUrl);
    }
  }

  // When a slice is selected
  // FIXME: modify query
  select = (chart: Chart) => {
    if (this.state.data) {
      const selection = chart.chart.getSelection();
      console.log('Selected', objectDig(this.state.data, objectDig(selection, 0, 'row'), 0));
    }
  }

  chartEvents = [
    {
      eventName: 'select',
      callback: this.select,
    },
  ];

  fetchEventValue(eventField: string, nodeQuery: PuppetDB.queryT | null , serverUrl: string) {
    PuppetDB.query(serverUrl, 'events', {
      query: ['extract', [['function', 'count'], eventField], nodeQuery, ['group_by', eventField]],
    }).then((data) => {
      this.setState({ data: data.map(item => [item[eventField].toString(), item.count]) });
    });
  }

  render() {
    if (this.state.data) {
      return (
        <Panel header={this.props.title} style={{ overflow: 'hidden' }}>
          <Chart
            chartType="PieChart"
            data={[['Value', 'Number'], ...this.state.data]}
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
