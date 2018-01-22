// @flow
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { Navbar, Nav, NavItem } from 'reactstrap';

import RouterNavLink from '../../../components/RouterNavLink';

export default (): JSX.Element => (
  <Navbar expand="md" dark color="primary" className="mb-2">
    <Nav navbar>
      <NavItem>
        <RouterNavLink exact to="/">
          <Icon name="dashboard" /> Dashboard
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/nodes">
          <Icon name="list" /> Nodes
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/events">
          <Icon name="calendar" /> Events
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/facts">
          <Icon name="tags" /> Facts
        </RouterNavLink>
      </NavItem>
    </Nav>
  </Navbar>
);
