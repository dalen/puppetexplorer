// @flow
import React from 'react';
import { Navbar, Nav, Glyphicon } from 'react-bootstrap';

import RouterNavItem from '../../../components/RouterNavItem';

export default (props: { selectTab: (tab: string) => void }) =>
  (<Navbar fluid>
    <Nav>
      <RouterNavItem to="/" eventKey="/" onSelect={props.selectTab}>
        <Glyphicon glyph="dashboard" /> Dashboard
      </RouterNavItem>
      <RouterNavItem to="/nodes" eventKey="/nodes" onSelect={props.selectTab}>
        <Glyphicon glyph="list" /> Nodes
      </RouterNavItem>
      <RouterNavItem to="/events" eventKey="/events" onSelect={props.selectTab}>
        <Glyphicon glyph="calendar" /> Events
      </RouterNavItem>
      <RouterNavItem to="/facts" eventKey="/facts" onSelect={props.selectTab}>
        <Glyphicon glyph="stats" /> Facts
      </RouterNavItem>
    </Nav>
  </Navbar>);
