import React from 'react';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.state = {
      queryString: this.props.queryString,
    };
  }

  handleChange(event) {
    this.setState({ queryString: event.target.value });
  }

  handleSubmit(event) {
    this.props.updateQuery(this.state.queryString);
    event.preventDefault();
  }

  render() {
    return (
      <form id="node-query" onSubmit={this.handleSubmit}>
        <InputGroup>
          <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
          <FormControl
            type="search" placeholder="Search" id="node-query-field" value={this.state.queryString}
            onChange={this.handleChange}
          />
        </InputGroup>
      </form>
    );
  }
}

SearchField.propTypes = {
  updateQuery: React.PropTypes.func,
  queryString: React.PropTypes.string,
};

export default SearchField;
