// @flow
import React from 'react';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default class SearchField extends React.Component {
  state: {
    queryString: string,
  } = { queryString: '' };

  componentWillMount() {
    this.setState({
      queryString: this.props.queryString,
    });
  }

  props: {
    updateQuery: (query: string) => mixed,
    queryString: string,
  };

  handleChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ queryString: event.target.value });
    } else {
      throw new Error('SearchField.handleChange(): Unknown event target');
    }
  }

  handleSubmit = (event: Event) => {
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
