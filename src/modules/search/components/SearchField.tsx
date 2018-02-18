import * as React from 'react';
import { FaSearch } from 'react-icons/lib/fa';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Form,
} from 'reactstrap';

type Props = {
  readonly updateQuery: (query: string) => any;
  readonly queryString: string;
};

type State = {
  readonly queryString: string;
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

  readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ queryString: event.target.value });
    } else {
      throw new Error('SearchField.handleChange(): Unknown event target');
    }
  };

  readonly handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.updateQuery(this.state.queryString);
    return event.preventDefault();
  };

  render(): JSX.Element {
    return (
      <Form id="node-query" onSubmit={this.handleSubmit}>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <FaSearch />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="search"
            placeholder="Search"
            id="node-query-field"
            value={this.state.queryString}
            onChange={this.handleChange}
          />
        </InputGroup>
      </Form>
    );
  }
}
