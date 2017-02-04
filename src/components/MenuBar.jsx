// @flow
import React from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { Router } from 'react-router';

export default class MenuBar extends React.Component {
  props: {
    selectTab: (id: string) => void,
    router: Router,
  };

  render(): React$Element<*> {
    return (
      <Navbar fluid>
        <Nav>
          <NavItem eventKey="/dashboard" active={this.props.router.isActive('/', true)} onSelect={this.props.selectTab}>
            <Glyphicon glyph="dashboard" /> Dashboard</NavItem>
          <NavItem eventKey="/nodes" active={this.props.router.isActive('/nodes')} onSelect={this.props.selectTab}>
            <Glyphicon glyph="list" /> Nodes</NavItem>
          <NavItem eventKey="/events" active={this.props.router.isActive('/events')} onSelect={this.props.selectTab}>
            <Glyphicon glyph="calendar" /> Events</NavItem>
          <NavItem eventKey="/facts" active={this.props.router.isActive('/facts')} onSelect={this.props.selectTab}>
            <Glyphicon glyph="stats" /> Facts</NavItem>
        </Nav>
      </Navbar>
    );
  }
}
