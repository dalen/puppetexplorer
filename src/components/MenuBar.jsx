// @flow
import React from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';

export default class MenuBar extends React.Component {
  props: {
    selectTab: (id: string) => void,
  };

  render(): React$Element<*> {
    return (
      <Navbar fluid>
        <Nav>
          <NavItem eventKey="/dashboard" onClick={this.props.selectTab}>
            <Glyphicon glyph="dashboard" /> Dashboard</NavItem>
          <NavItem eventKey="/nodes" onSelect={this.props.selectTab}>
            <Glyphicon glyph="list" /> Nodes</NavItem>
          <NavItem eventKey="/events" onSelect={this.props.selectTab}>
            <Glyphicon glyph="calendar" /> Events</NavItem>
        </Nav>
      </Navbar>
    );
  }
}
