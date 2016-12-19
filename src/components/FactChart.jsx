// @flow
import React from 'react';
import { Pie } from 'react-chartjs-2';

import PuppetDB from '../PuppetDB';

type Props = {
  serverUrl: string,
  fact: factPathElementT[],
  queryParsed: queryT,
};

export default class FactChart extends React.Component {
  state: { data?: mixed } = {};

  componentDidMount() {
    this.fetchFactValue(this.props.fact, this.props.queryParsed, this.props.serverUrl);
  }

  /* componentWillReceiveProps(nextProps: Props) {
    if (nextProps.config.serverUrl !== this.props.config.serverUrl ||
      nextProps.params.reportHash !== this.props.params.reportHash) {
      this.fetchReport(nextProps.config.serverUrl, nextProps.params.reportHash);
    }
  } */

  props: Props;

  fetchFactValue(fact: factPathElementT[], nodeQuery: queryT, serverUrl: string) {
    PuppetDB.query(serverUrl, 'fact-contents', {
      query: ['extract',
        [['function', 'count'], 'value'],
        PuppetDB.combine(nodeQuery, ['=', 'path', fact]),
        ['group_by', 'value'],
      ],
    }).then((data) => {
      const labels = data.map(item => item.value);
      const dataset = data.map(item => item.count);
      this.setState({ data: {
        labels,
        datasets: [{
          data: dataset,
          backgroundColor: [
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
        }] } });
    });
  }

  render(): ?React$Element<*> {
    if (this.state.data) {
      return (<Pie data={this.state.data} options={{ legend: { position: 'right' } }} />);
    }
    return null;
  }
}
