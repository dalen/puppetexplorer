import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { hashHistory as history } from 'react-router';

class MenuBar extends React.Component {
  render() {
    return (
      <Navbar fluid>
        <Nav>
          <NavItem eventKey="/dashboard" onSelect={history.push}>
            <Glyphicon glyph="dashboard" /> Dashboard</NavItem>
          <NavItem eventKey="/nodes" onSelect={history.push}>
            <Glyphicon glyph="list" /> Nodes</NavItem>
          <NavItem eventKey="/events" onSelect={history.push}>
            <Glyphicon glyph="calendar" /> Events</NavItem>
        </Nav>
        <Nav pullRight>
          {this.props.servers.length > 1 ?
            <NavDropdown title="Server" id="server">
              {this.props.servers.map((server) =>
                <MenuItem
                  eventKey={server.name}
                  onSelect={this.props.serverSelect}
                  key={server.name}
                >{server.name}</MenuItem>)
              }
            </NavDropdown>
          : null}
        </Nav>
      </Navbar>
    );
  }
}

MenuBar.propTypes = {
  servers: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
  })).isRequired,
  serverSelect: React.PropTypes.func,
};

export default MenuBar;
