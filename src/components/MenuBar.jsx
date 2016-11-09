// @flow
import React from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { browserHistory as history } from 'react-router';

export default class MenuBar extends React.Component {
  props: {
    selectTab: (id: string) => any,
  };

  render() {
    return (
      <Navbar fluid>
        <Nav>
          <NavItem eventKey="/dashboard" onClick={history.push}>
            <Glyphicon glyph="dashboard" /> Dashboard</NavItem>
          <NavItem eventKey="/nodes" onSelect={history.push}>
            <Glyphicon glyph="list" /> Nodes</NavItem>
          <NavItem eventKey="/events" onSelect={history.push}>
            <Glyphicon glyph="calendar" /> Events</NavItem>
        </Nav>
      </Navbar>
    );
  }
}
