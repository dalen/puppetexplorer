import * as React from 'react';
import * as RBPagination from 'react-bootstrap/lib/Pagination';

// Wrap react-bootstrap Pagination and calculate number of pages and
// if we should show pagination at all automatically
export default (props: {
  readonly count: number | null,
  readonly perPage: number,
  readonly activePage: number,
  readonly onSelect: (page: any) => void,
}) => {
  const numPages = props.count == null ? 1 : Math.ceil(props.count / props.perPage);

  return numPages === 1 ? null : props.count ? (
    <RBPagination
      first
      prev={numPages > 2}
      next={numPages > 2}
      last
      items={Math.ceil(numPages)}
      activePage={props.activePage}
      onSelect={props.onSelect}
    />
  ) : null;
};
