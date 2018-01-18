// @flow
import * as React from 'react';
import { NavItem, NavItemProps, NavLink } from 'reactstrap';
import { Route } from 'react-router-dom';

export default (
  props: {
    readonly to: string;
    readonly children: React.ReactNode;
  } & NavItemProps,
): JSX.Element => {
  const { to, ...rest } = props;
  return (
    <Route path={to}>
      {({ match }) => (
        <NavItem {...{ ...rest, active: match != null }}>
          <NavLink href={to}>{props.children}</NavLink>
        </NavItem>
      )}
    </Route>
  );
};
