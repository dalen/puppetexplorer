// @flow
import React from 'react';
import { Navbar, Nav, Glyphicon } from 'react-bootstrap';

import RouterNavItem from './RouterNavItem';

export default class MenuBar extends React.Component {
  props: {
    selectTab: (tab: string) => void,
  };

  render() {
    return (
      <Navbar fluid>
        <Nav>
          <RouterNavItem to="/" eventKey="/" onSelect={this.props.selectTab}>
            <Glyphicon glyph="dashboard" /> Dashboard</RouterNavItem>
          <RouterNavItem to="/nodes" eventKey="/nodes" onSelect={this.props.selectTab}>
            <Glyphicon glyph="list" /> Nodes</RouterNavItem>
          <RouterNavItem to="/events" eventKey="/events" onSelect={this.props.selectTab}>
            <Glyphicon glyph="calendar" /> Events</RouterNavItem>
          <RouterNavItem to="/facts" eventKey="/facts" onSelect={this.props.selectTab}>
            <Glyphicon glyph="stats" /> Facts</RouterNavItem>
        </Nav>
      </Navbar>
    );
  }
}
