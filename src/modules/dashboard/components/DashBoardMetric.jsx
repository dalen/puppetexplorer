// @flow
import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';

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
  value?: number,
};

export default class DashBoardMetric extends React.Component<Props, State> {
  static defaultProps = {
    multiply: 1,
    unit: '',
    beanValue: 'Value',
  };

  state = {};

  componentDidMount() {
    PuppetDB.getBean(this.props.serverUrl, this.props.bean).then(data =>
      this.setState({ value: data[this.props.beanValue] }),
    );
  }

  render() {
    const children =
      typeof this.state.value === 'number' ? (
        `${this.state.value * this.props.multiply} ${this.props.unit}`
      ) : (
        <Glyphicon glyph="refresh" className="spin" />
      );

    return (
      <Panel header={this.props.title} bsStyle={this.props.style}>
        {children}
      </Panel>
    );
  }
}
