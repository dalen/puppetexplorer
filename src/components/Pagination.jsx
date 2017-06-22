// @flow
import React from 'react';
import { Pagination as RBPagination } from 'react-bootstrap';

// Wrap react-bootstrap Pagination and calculate number of pages and
// if we should show pagination at all automatically
const Pagination = (props: {
    count: ?number,
    perPage: number,
    activePage: number,
    onSelect: (page: number) => void,
  }): ?React$Element<*> => {
  const numPages = Math.ceil(props.count / props.perPage);

  return ((numPages === 1) ?
      null
    :
      ((props.count) ?
        <RBPagination
          first
          prev={numPages > 2}
          next={numPages > 2}
          last
          items={Math.ceil(numPages)}
          activePage={props.activePage}
          onSelect={props.onSelect}
        />
      :
        null
    )
  );
};

export default Pagination;
