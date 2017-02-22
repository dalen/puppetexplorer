// @flow
import React from 'react';
import { Label } from 'react-bootstrap';
import Moment from 'react-moment';

export default class LogListItem extends React.Component {
  // Return the CSS class event states should correspond to
  static color(status: string): string {
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
  }

  static message(message: string) {
    if (/\r|\n/.exec(message)) {
      return (<pre>{message}</pre>);
    }
    return (<p>message</p>);
  }

  props: {
    log: logT,
  };

  render() {
    const log = this.props.log;
    return (
      <tr>
        <td><Moment format="LLL" title={log.time}>{log.time}</Moment></td>
        <td><Label bsStyle={LogListItem.color(log.level)} style={{ textTransform: 'capitalize' }}>{log.level}</Label></td>
        <td>{LogListItem.message(log.message)}
          <span><strong>Source:</strong>&nbsp;{log.source}</span>
          { (log.file && log.line) &&
            <p><strong>File:</strong>&nbsp;{log.file}<strong>:</strong>{log.line}</p> }
        </td>
      </tr>
    );
  }
}
