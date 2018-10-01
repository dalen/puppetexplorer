// @flow
import * as React from 'react';
import { FaTachometerAlt, FaList, FaCalendar, FaTags } from 'react-icons/fa';
import { Navbar, Nav, NavItem } from 'reactstrap';

import RouterNavLink from '../../../components/RouterNavLink';

export default (): JSX.Element => (
  <Navbar expand="md" dark color="primary" className="mb-2">
    <Nav navbar>
      <NavItem>
        <RouterNavLink exact to="/">
          <FaTachometerAlt /> Dashboard
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/nodes">
          <FaList /> Nodes
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/events">
          <FaCalendar /> Events
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact to="/facts">
          <FaTags /> Facts
        </RouterNavLink>
      </NavItem>
    </Nav>
  </Navbar>
);
