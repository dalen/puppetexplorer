// @flow
import React from 'react';
import { NavItem } from 'react-bootstrap';
import { Route } from 'react-router-dom';

export default class RouterNavItem extends React.Component {
  props: {
    to: string,
    children: React.Element<*>,
  };

  render() {
    const { to, ...rest } = this.props;
    return (
      <Route path={to}>
        {({ match }) => (
          <NavItem {...{ ...rest, active: match != null }}>
            {this.props.children}
          </NavItem>
        )}
      </Route>
    );
  }
}
