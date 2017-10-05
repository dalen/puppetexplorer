// @flow
import React from 'react';
import { Label } from 'react-bootstrap';
import Moment from 'react-moment';

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

export default ({ log }: { log: logT }) => (
  <tr>
    <td>
      <Moment format="LLL" title={log.time}>
        {log.time}
      </Moment>
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
      {log.file &&
        log.line && (
          <p>
            <strong>File:</strong>&nbsp;{log.file}
            <strong>:</strong>
            {log.line}
          </p>
        )}
    </td>
  </tr>
);
