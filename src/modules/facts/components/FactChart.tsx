import * as React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
} from 'recharts';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string;
  readonly fact: PuppetDB.FactPath.FactPath;
  readonly queryParsed: PuppetDB.queryT | null;
  readonly onSelect: (value: string) => void;
};

type State = {
  readonly data?: ReadonlyArray<{
    readonly value: string;
    readonly count: number;
  }>;
  readonly labels?: ReadonlyArray<string>;
};

export default class FactChart extends React.Component<Props, State> {
  readonly state: State = {};

  componentDidMount(): void {
    this.fetchFactValue(
      this.props.fact,
      this.props.queryParsed,
      this.props.serverUrl,
    );
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.fact !== this.props.fact ||
      nextProps.queryParsed !== this.props.queryParsed
    ) {
      this.fetchFactValue(
        nextProps.fact,
        nextProps.queryParsed,
        nextProps.serverUrl,
      );
    }
  }

  /*
  // When a slice is selected
  // FIXME: modify query
  readonly select = (chart: Chart) => {
    this.props.onSelect(
      dig(this.state.data, dig(chart.chart.getSelection(), 0, 'row'), 0),
    );
    console.log(
      'Selected',
      dig(this.state.data, dig(chart.chart.getSelection(), 0, 'row'), 0),
    );
  }

  readonly chartEvents: ReadonlyArray<any> = [
    {
      eventName: 'select',
      callback: this.select,
    },
  ];
  */

  fetchFactValue(
    fact: PuppetDB.FactPath.FactPath,
    nodeQuery: PuppetDB.queryT | null,
    serverUrl: string,
  ): void {
    PuppetDB.query(serverUrl, 'fact-contents', {
      query: [
        'extract',
        [['function', 'count'], 'value'],
        PuppetDB.combine(nodeQuery, ['=', 'path', [...fact.path]]),
        ['group_by', 'value'],
      ],
    }).then(
      (
        data: ReadonlyArray<{
          readonly value: string | boolean | number;
          readonly count: number;
        }>,
      ) => {
        this.setState({
          data: data.map(item => ({ ...item, value: item.value.toString() })),
        });
      },
    );
  }

  render(): JSX.Element | null {
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
      const factName = this.props.fact.path.join('.');
      return (
        <Card style={{ overflow: 'hidden' }}>
          <CardHeader>{factName}</CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[...this.state.data]}>
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" label>
                  {this.state.data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      );
    }
    return null;
  }
}

/*

              <Bar dataKey="value" label>
                {this.state.data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
*/
