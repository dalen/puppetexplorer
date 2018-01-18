// @flow
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { Navbar, Nav } from 'reactstrap';

import RouterNavItem from '../../../components/RouterNavItem';

export default (): JSX.Element => (
  <Navbar expand="md" dark color="primary" className="mb-2">
    <Nav navbar>
      <RouterNavItem to="/">
        <Icon name="dashboard" /> Dashboard
      </RouterNavItem>
      <RouterNavItem to="/nodes">
        <Icon name="list" /> Nodes
      </RouterNavItem>
      <RouterNavItem to="/events">
        <Icon name="calendar" /> Events
      </RouterNavItem>
      <RouterNavItem to="/facts">
        <Icon name="tags" /> Facts
      </RouterNavItem>
    </Nav>
  </Navbar>
);
