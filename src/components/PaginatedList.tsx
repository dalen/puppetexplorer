// @flow
import * as React from 'react';
import * as Label from 'react-bootstrap/lib/Label';

import * as PuppetDB from '../PuppetDB';
import Pagination from './Pagination';


const PER_PAGE = 25;

interface Props {
  readonly serverUrl: string;
  readonly perPage?: number;
  readonly listQuery: PuppetDB.queryT | null;
  readonly countQuery: PuppetDB.queryT;
}

type State = {
  readonly items?: any,
  readonly count?: number,
  readonly page: number,
};

export default <OriginalProps extends {}>(
  ListElement: React.SFC<OriginalProps & {
    readonly serverUrl: string;
    readonly total: number;
  }>,
  endpoint: string,
  itemsProp: string,
  orderBy: ReadonlyArray<{ readonly [id: string]: string }> = [{ field: 'certname', order: 'asc' }],
) =>
  class PaginatedList extends React.Component<Props, State> {
    readonly state: State = {
      page: 1,
    };

    componentDidMount(): void {
      this.fetchItems(this.props.serverUrl, this.props.listQuery, this.state.page);
      this.fetchCount(this.props.serverUrl, this.props.countQuery);
    }

    componentWillReceiveProps(nextProps: Props): void {
      const page = nextProps.listQuery !== this.props.listQuery ? 1 : this.state.page;

      // Reset pagination if query changes
      if (nextProps.listQuery !== this.props.listQuery) {
        this.setState({ page });
      }

      if (
        nextProps.serverUrl !== this.props.serverUrl ||
        nextProps.listQuery !== this.props.listQuery
      ) {
        this.fetchItems(nextProps.serverUrl, nextProps.listQuery, page);
      }
      if (
        nextProps.serverUrl !== this.props.serverUrl ||
        nextProps.countQuery !== this.props.countQuery
      ) {
        this.fetchCount(nextProps.serverUrl, nextProps.countQuery);
      }
    }

    fetchItems(serverUrl: string, query: PuppetDB.queryT | null, page: number): void {
      PuppetDB.query(serverUrl, endpoint, {
        query,
        order_by: orderBy,
        limit: this.props.perPage,
        offset: (page - 1) * (this.props.perPage || PER_PAGE),
      }).then(data => this.setState({ items: data }));
    }

    fetchCount(serverUrl: string, query: PuppetDB.queryT): void {
      PuppetDB.query(serverUrl, endpoint, {
        query,
      }).then(data => this.setState({ count: data[0].count }));
    }

    readonly changePage = (page: number) => {
      this.setState({ page });
      this.fetchItems(this.props.serverUrl, this.props.listQuery, page);
    }

    render(): JSX.Element {
      if (this.state.items !== undefined && this.state.count !== undefined) {
        const props = { [itemsProp]: this.state.items };
        return (
          <div>
            <ListElement total={this.state.count} serverUrl={this.props.serverUrl} {...props} />
            <Pagination
              count={this.state.count}
              perPage={this.props.perPage || PER_PAGE}
              activePage={this.state.page}
              onSelect={this.changePage}
            />
          </div>
        );
      }
      return <Label>Loading...</Label>;
    }
  };
