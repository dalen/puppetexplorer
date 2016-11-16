// @flow
import React from 'react';
import { Pagination as RBPagination } from 'react-bootstrap';

// Wrap react-bootstrap Pagination and calculate number of pages and
// if we should show pagination at all automatically
export default class Pagination extends React.Component {
  props: {
    count: ?number,
    perPage: number,
    activePage: number,
    onSelect: (page: number) => void,
  };

  render(): ?React$Element<*> {
    if (this.props.count) {
      const numPages = Math.ceil(this.props.count / this.props.perPage);

      if (numPages === 1) { return null; }

      return (<RBPagination
        first prev={numPages > 2} next={numPages > 2} last
        items={Math.ceil(numPages)}
        activePage={this.props.activePage}
        onSelect={this.props.onSelect}
      />);
    }
    return null;
  }
}
