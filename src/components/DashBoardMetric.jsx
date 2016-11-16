// @flow
import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';

import PuppetDB from '../PuppetDB';

export default class DashBoardMetric extends React.Component {
  static defaultProps = {
    multiply: 1,
    unit: '',
    beanValue: 'Value',
  };

  state: {
    value?: number,
  } = {};

  componentDidMount() {
    PuppetDB.getBean(this.props.serverUrl, this.props.bean)
      .then(data => this.setState({ value: data[this.props.beanValue] }));
  }

  props: {
    title: string,
    style: 'default'
      | 'primary'
      | 'success'
      | 'info'
      | 'warning'
      | 'danger',
    bean: string,
    beanValue: string,
    multiply: number,
    unit: string,
    serverUrl: string,
  };

  render(): React$Element<*> {
    let children;
    if (typeof this.state.value === 'number') {
      children = `${this.state.value * this.props.multiply} ${this.props.unit}`;
    } else {
      children = <Glyphicon glyph="refresh" className="spin" />;
    }
    return (
      <Panel
        header={this.props.title}
        bsStyle={this.props.style}
      >{children}</Panel>
    );
  }
}
