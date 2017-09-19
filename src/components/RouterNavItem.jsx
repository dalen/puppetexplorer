// @flow
import * as React from 'react';
import { NavItem } from 'react-bootstrap';
import { Route } from 'react-router-dom';

type Props = {
  to: string,
  children: React.Node,
};

export default class RouterNavItem extends React.Component<Props> {
  static defaultProps = {
    children: [],
  };

  render() {
    const { to, ...rest } = this.props;
    return (
      <Route path={to}>
        {({ match }) =>
          (<NavItem {...{ ...rest, active: match != null }}>
            {this.props.children}
          </NavItem>)}
      </Route>
    );
  }
}
