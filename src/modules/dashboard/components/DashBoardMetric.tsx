// @flow
import * as React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import * as Maybe from 'maybe.ts';


import * as PuppetDB from '../../../PuppetDB';

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
    value: Maybe.nothing,
  };

  componentDidMount() {
    PuppetDB.getBean(this.props.serverUrl, this.props.bean).then(data =>
      this.setState({ value: data[this.props.beanValue] }),
    );
  }

  render() {
    const children = Maybe.toValue(
      <Glyphicon glyph="refresh" className="spin" />,
      Maybe.map(
        val => <span>{`${val * this.props.multiply} ${this.props.unit}`}</span>,
        this.state.value,
      ),
    );

    return (
      <Panel header={this.props.title} bsStyle={this.props.style}>
        {children}
      </Panel>
    );
  }
}
