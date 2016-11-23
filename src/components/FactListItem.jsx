// @flow
import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default class FactList extends React.Component {
  props: {
    fact: string,
  };

  render(): React$Element<*> {
    return (
      <ListGroupItem>
        {this.props.fact}
      </ListGroupItem>
    );
  }
}
