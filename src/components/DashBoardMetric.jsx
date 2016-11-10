// @flow
import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';

import type { dashBoardPanelT } from '../types';

export default class DashBoardMetric extends React.Component {
  static defaultProps: {
    multiply: 1,
    unit: '',
    beanValue: 'Value',
  };

  state: {
    value: number,
  };

  componentDidMount() {
    if (this.props.bean) {
      fetch(`${this.props.serverUrl}/metrics/v1/mbeans/${this.props.bean}`)
      .then(response => response.json())
      .then(data => this.setState({ value: data[this.props.beanValue] }));
    }
  }

  props: {
    title: string,
    style:
      'default'
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

  render() {
    let children;
    if ('value' in this.state) {
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
