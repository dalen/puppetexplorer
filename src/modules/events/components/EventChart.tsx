// @flow
import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { BarChart, Bar, Legend, Cell } from 'recharts';

import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string;
  readonly eventField: string;
  readonly queryParsed: PuppetDB.queryT | null;
  readonly title: string;
  readonly id: string;
};

type State = {
  readonly data?: { readonly name: string; readonly value: number }[];
  readonly labels?: ReadonlyArray<string>;
};

export default class EventChart extends React.Component<Props, State> {
  componentDidMount(): void {
    this.fetchEventValue(
      this.props.eventField,
      this.props.queryParsed,
      this.props.serverUrl,
    );
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.eventField !== this.props.eventField ||
      nextProps.queryParsed !== this.props.queryParsed
    ) {
      this.fetchEventValue(
        nextProps.eventField,
        nextProps.queryParsed,
        nextProps.serverUrl,
      );
    }
  }

  /*
  // When a slice is selected
  // FIXME: modify query
  readonly select = (chart: Chart) => {
    if (this.state.data) {
      const selection = chart.chart.getSelection();
      console.log('Selected', objectDig(this.state.data, objectDig(selection, 0, 'row'), 0));
    }
  }

  readonly chartEvents = [
    {
      eventName: 'select',
      callback: this.select,
    },
  ];
  */

  fetchEventValue(
    eventField: string,
    nodeQuery: PuppetDB.queryT | null,
    serverUrl: string,
  ): void {
    PuppetDB.query(serverUrl, 'events', {
      query: [
        'extract',
        [['function', 'count'], eventField],
        nodeQuery,
        ['group_by', eventField],
      ],
    }).then((data: ReadonlyArray<any>) => {
      this.setState({
        data: data.map(item => ({
          name: item[eventField].toString(),
          value: item.count,
        })),
      });
    });
  }

  render(): React.ReactNode {
    if (this.state.data) {
      const colors = [
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
      ];

      return (
        <Panel header={this.props.title} style={{ overflow: 'hidden' }}>
          <BarChart layout="horizontal" data={this.state.data}>
            <Legend />
            <Bar dataKey="value">
              {this.state.data.map((_, index) => (
                <Cell fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </Panel>
      );
    }
    return null;
  }
}
