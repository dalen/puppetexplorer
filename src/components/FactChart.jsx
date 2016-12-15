// @flow
import React from 'react';
import { Pie } from 'react-chartjs';

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
        PuppetDB.combine(nodeQuery, ['=', 'path', fact.toJS()]),
        ['group_by', 'value'],
      ],
    }).then((data) => {
      const labels = data.map(item => item.value);
      const dataset = data.map(item => item.count);
      this.setState({ data: {
        labels,
        datasets: [{
          data: dataset,
        }] } });
    });
  }

  render(): React$Element<*> {
    if (this.state.data) {
      return (<Pie data={this.state.data} />);
    }
    return null;
  }
}
