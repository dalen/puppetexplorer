import * as React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/lib/fa';
import * as date from 'date-fns';
import * as Maybe from 'maybe.ts';

import { metricValue, statusIcon } from '../../reports/index';
import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly serverUrl: string;
  readonly node: PuppetDB.Node;
};

type State = {
  readonly metrics: ReadonlyArray<any>;
};

export default class NodeListItem extends React.Component<Props, State> {
  readonly state = { metrics: [] };

  componentDidMount(): void {
    this.fetchMetrics();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.serverUrl !== this.props.serverUrl ||
      nextProps.node !== this.props.node
    ) {
      this.fetchMetrics();
    }
  }

  fetchMetrics(): void {
    type metricT = {
      readonly category: string;
      readonly name: string;
      readonly value: number;
    };
    PuppetDB.get(
      this.props.serverUrl,
      `pdb/query/v4/reports/${this.props.node.latest_report_hash}/metrics`,
    ).then((data: ReadonlyArray<metricT>) => {
      this.setState({ metrics: data });
    });
  }

  render(): JSX.Element {
    return (
      <tr>
        <td>
          <Link to={`/node/${this.props.node.certname}`}>
            {this.props.node.certname}
          </Link>
        </td>
        <td title={this.props.node.catalog_timestamp}>
          <FaExclamationTriangle className="text-warning" />
          <span title={this.props.node.report_timestamp}>
            {date.distanceInWordsToNow(
              date.parse(this.props.node.report_timestamp),
            )}{' '}
            ago
          </span>
        </td>
        <td className="text-center">
          {Maybe.toValue(
            null,
            metricValue(this.state.metrics, 'events', 'success'),
          )}
        </td>
        <td className="text-center">
          {Maybe.toValue(
            null,
            metricValue(this.state.metrics, 'events', 'noop'),
          )}
        </td>
        <td className="text-center">
          {Maybe.toValue(
            null,
            metricValue(this.state.metrics, 'events', 'skip'),
          )}
        </td>
        <td className="text-center">
          {Maybe.toValue(
            null,
            metricValue(this.state.metrics, 'events', 'failure'),
          )}
        </td>
        <td className="text-right">
          {statusIcon(this.props.node.latest_report_status)}
        </td>
      </tr>
    );
  }
}
