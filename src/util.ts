import { History } from 'history';
import * as qs from 'qs';

export const updateSearch = (
  history: History,
  updates: { readonly [id: string]: any },
) => {
  history.push({
    pathname: history.location.pathname,
    search: qs.stringify({
      ...qs.parse(history.location.search),
      ...updates,
    }),
  });
};
