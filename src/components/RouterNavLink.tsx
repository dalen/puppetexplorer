import * as React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import * as classNames from 'classnames';

export default (props: NavLinkProps & { readonly disabled?: boolean }) => (
  <NavLink
    activeClassName="active"
    {...props}
    className={classNames(props.className, 'nav-link', {
      disabled: props.disabled,
    })}
  />
);
