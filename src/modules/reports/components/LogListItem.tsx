import * as React from 'react';
import { Badge } from 'reactstrap';
import * as date from 'date-fns';

import * as PuppetDB from '../../../PuppetDB';

// Return the CSS class event states should correspond to
const color = (status: string): string => {
  switch (status) {
    case 'crit':
      return 'danger';
    case 'emerg':
      return 'danger';
    case 'alert':
      return 'danger';
    case 'err':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'notice':
      return 'success';
    case 'info':
      return 'info';
    case 'verbose':
      return 'info';
    case 'debug':
      return 'default';
    default:
      return '';
  }
};

const message = (msg: string): JSX.Element => {
  if (/\r|\n/.exec(msg) != null) {
    return <pre>{msg}</pre>;
  }
  return <p>{msg}</p>;
};

export default ({ log }: { readonly log: PuppetDB.Log }) => (
  <tr>
    <td>
      <span style={{ whiteSpace: 'nowrap' }} title={log.time}>
        {date.parse(log.time).toLocaleTimeString()}
      </span>
    </td>
    <td>
      <Badge color={color(log.level)}>{log.level.toUpperCase()}</Badge>
    </td>
    <td>
      {message(log.message)}
      <span>
        <strong>Source:</strong>&nbsp;{log.source}
      </span>
      {log.file != null &&
        log.line != null && (
          <p>
            <strong>File:</strong>&nbsp;{log.file}
            <strong>:</strong>
            {log.line}
          </p>
        )}
    </td>
  </tr>
);
