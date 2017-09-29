// @flow
import * as React from 'react';
import { NavItem } from 'react-bootstrap';
import { Route } from 'react-router-dom';

type Props = {
  to: string,
  children: React.Node,
};

export default (props: Props): React.Node => {
  const { to, ...rest } = props;
  return (
    <Route path={to}>
      {({ match }) => <NavItem {...{ ...rest, active: match != null }}>{props.children}</NavItem>}
    </Route>
  );
};
