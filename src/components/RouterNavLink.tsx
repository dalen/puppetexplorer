import * as React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import classJoin from 'classjoin';

export default (props: NavLinkProps & { readonly disabled?: boolean }) => (
  <NavLink
    activeClassName="active"
    {...props}
    className={classJoin(
      {
        disabled: props.disabled,
      },
      props.className !== undefined
        ? [props.className, 'nav-link']
        : ['nav-link'],
    )}
  />
);
