// @flow
import * as React from 'react';
import * as NavItem from 'react-bootstrap/lib/NavItem';
import { Route } from 'react-router-dom';

export default (props: {
  readonly to: string;
  readonly children: React.ReactNode;
} & NavItem.NavItemProps): JSX.Element => {
  const { to, ...rest } = props;
  return (
    <Route path={to}>
      {({ match }) => (
        <NavItem {...{ ...rest, active: match != null }}>
          {props.children}
        </NavItem>
      )}
    </Route>
  );
};
