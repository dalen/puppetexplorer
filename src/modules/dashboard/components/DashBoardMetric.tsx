// @flow
import * as React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FaRefresh } from 'react-icons/lib/fa';
import * as Maybe from 'maybe.ts';

import * as PuppetDB from '../../../PuppetDB';

type Props = {
  readonly title: string;
  readonly style:
    | 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger';
  readonly bean: string;
  readonly beanValue?: string;
  readonly multiply?: number;
  readonly unit?: string;
  readonly serverUrl: string;
};

type State = {
  readonly value: Maybe.Maybe<number>;
};

export default class DashBoardMetric extends React.Component<Props, State> {
  static readonly defaultProps = {
    multiply: 1,
    unit: '',
    beanValue: 'Value',
  };

  readonly state = {
    value: Maybe.nothing,
  };

  componentDidMount(): void {
    PuppetDB.getBean(this.props.serverUrl, this.props.bean).then(data =>
      this.setState({
        value:
          data[this.props.beanValue || DashBoardMetric.defaultProps.beanValue],
      }),
    );
  }

  render(): JSX.Element {
    const children = Maybe.toValue(
      <FaRefresh className="spin" />,
      Maybe.map(
        val => (
          <span>
            {`${val *
              (this.props.multiply || DashBoardMetric.defaultProps.multiply)} ${
              this.props.unit
            }`}
          </span>
        ),
        this.state.value,
      ),
    );

    return (
      <Card color={this.props.style}>
        <CardBody className="p-2">
          <CardTitle>{this.props.title}</CardTitle>
          <CardText>{children}</CardText>
        </CardBody>
      </Card>
    );
  }
}
