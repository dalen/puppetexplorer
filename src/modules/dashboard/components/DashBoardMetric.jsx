// @flow
import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import * as Maybe from 'flow-static-land/lib/Maybe';

import PuppetDB from '../../../PuppetDB';

type Props = {
  title: string,
  style: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger',
  bean: string,
  beanValue: string,
  multiply: number,
  unit: string,
  serverUrl: string,
};

type State = {
  value: Maybe.Maybe<number>,
};

export default class DashBoardMetric extends React.Component<Props, State> {
  static defaultProps = {
    multiply: 1,
    unit: '',
    beanValue: 'Value',
  };

  state = {
    value: Maybe.empty(),
  };

  componentDidMount() {
    PuppetDB.getBean(this.props.serverUrl, this.props.bean).then(data =>
      this.setState({ value: Maybe.of(data[this.props.beanValue]) }),
    );
  }

  render() {
    const children = Maybe.maybe(
      <Glyphicon glyph="refresh" className="spin" />,
      val => `${val * this.props.multiply} ${this.props.unit}`,
      this.state.value,
    );

    return (
      <Panel header={this.props.title} bsStyle={this.props.style}>
        {children}
      </Panel>
    );
  }
}
