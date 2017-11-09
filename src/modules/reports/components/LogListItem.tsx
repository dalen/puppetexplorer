import * as React from 'react';
import * as Label from 'react-bootstrap/lib/Label';
import Moment from 'react-moment';

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

const message = (msg: string) => {
  if (/\r|\n/.exec(msg)) {
    return <pre>{msg}</pre>;
  }
  return <p>message</p>;
};

export default ({ log }: { readonly log: PuppetDB.logT }) => (
  <tr>
    <td>
      <span title={log.time}>
        <Moment format="LLL">
          {log.time}
        </Moment>
      </span>
    </td>
    <td>
      <Label bsStyle={color(log.level)} style={{ textTransform: 'capitalize' }}>
        {log.level}
      </Label>
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
