import * as React from 'react';
import * as InputGroup from 'react-bootstrap/lib/InputGroup';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

type Props = {
  readonly updateQuery: (query: string) => any,
  readonly queryString: string,
};

type State = {
  readonly queryString: string,
};

export default class SearchField extends React.Component<Props, State> {
  readonly state = { queryString: '' };

  componentWillMount(): void {
    this.setState({
      queryString: this.props.queryString,
    });
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.queryString !== this.props.queryString) {
      this.setState({ queryString: nextProps.queryString });
    }
  }

  readonly handleChange = (event: React.FormEvent<FormControl>) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ queryString: event.target.value });
    } else {
      throw new Error('SearchField.handleChange(): Unknown event target');
    }
  }

  readonly handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.updateQuery(this.state.queryString);
    return event.preventDefault();
  }

  render(): JSX.Element {
    return (
      <form id="node-query" onSubmit={this.handleSubmit}>
        <InputGroup>
          <InputGroup.Addon>
            <Glyphicon glyph="search" />
          </InputGroup.Addon>
          <FormControl
            type="search"
            placeholder="Search"
            id="node-query-field"
            value={this.state.queryString}
            onChange={this.handleChange}
          />
        </InputGroup>
      </form>
    );
  }
}
