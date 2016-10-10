import React from 'react';
import { InputGroup, FormControl, Glyphicon } from 'react-bootstrap';

class SearchField extends React.Component {
  render() {
    return (
      <form id="node-query">
        <InputGroup>
          <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
          <FormControl type="search" placeholder="Search" id="node-query-field" />
        </InputGroup>
      </form>
    );
  }
}

SearchField.propTypes = {
  updateQuery: React.PropTypes.func,
};

export default SearchField;
