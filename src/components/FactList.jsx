// @flow
import React from 'react';
import { ListGroup } from 'react-bootstrap';

import FactListItem from './FactListItem';

export default class FactList extends React.Component {
  props: {
    factNames: string[],
  };

  render(): React$Element<*> {
    return (
      <ListGroup>
        {this.props.factNames.map(fact => <FactListItem fact={fact} key={fact} />)}
      </ListGroup>
    );
  }
}
