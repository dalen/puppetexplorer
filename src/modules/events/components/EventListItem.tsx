import * as React from 'react';
import { Label, Collapse, Glyphicon } from 'react-bootstrap';
import * as Moment from 'react-moment';
import { Link } from 'react-router-dom';

import * as PuppetDB from '../../../PuppetDB';

type Props = {
  event: PuppetDB.eventT,
  showNode: boolean,
};

type State = { show: boolean };

export default class EventListItem extends React.Component<Props, State> {
  // Return the CSS class event states should correspond to
  static color(status: string): string {
    switch (status) {
      case 'success':
        return 'success';
      case 'noop':
        return 'text-muted';
      case 'failure':
        return 'danger';
      case 'skipped':
        return 'warning';
      default:
        return '';
    }
  }

  // Format the value column
  static formatValue(event: PuppetDB.eventT, value: string) {
    const matches = typeof value === 'string' ? value.match(/\{(\w{3,5})\}(\w+)/) : null;
    // Check if it is a file checksum
    if (event.resource_type === 'File' && event.property === 'content' && matches != null) {
      return (
        <td>
          <Label title={matches[2]}>
            {matches[1]}
          </Label>
        </td>
      );
    }
    return (
      <td>
        {value}
      </td>
    );
  }

  static defaultProps = {
    showNode: true,
  };

  state = { show: false };

  toggle = () => {
    this.setState({ show: !this.state.show });
  }

  render() {
    const event = this.props.event;
    return (
      <tr>
        {this.props.showNode &&
          <td>
            {event.certname}
          </td>}
        <td>
          <Glyphicon
            glyph={this.state.show ? 'triangle-bottom' : 'triangle-right'}
            onClick={this.toggle}
          />
          {event.resource_type}
          <wbr />[{event.resource_title}]
          <Collapse in={this.state.show}>
            <div>
              <dl>
                <dt>Message:</dt>
                <dd>
                  {event.message}
                </dd>
                <dt>Containing class:</dt>
                <dd>
                  {event.containing_class}
                </dd>
                <dt>Containment path:</dt>
                <dd>
                  {event.containment_path.join(' / ')}
                </dd>
                <dt>File:</dt>
                <dd>
                  {event.file}
                  {event.file &&
                    event.line &&
                    <span>
                      <wbr />:
                    </span>}
                  {event.line}
                </dd>
                <dt>Timestamp:</dt>
                <dd>
                  <Moment format="LLL" title={event.timestamp}>
                    {event.timestamp}
                  </Moment>
                </dd>
                {event.report &&
                  <div>
                    <dt>Report:</dt>
                    <dd>
                      <Link to={`/report/${event.report}`}>
                        {event.report}
                      </Link>
                    </dd>
                  </div>}
              </dl>
            </div>
          </Collapse>
        </td>
        <td>
          <Label
            bsStyle={EventListItem.color(this.props.event.status)}
            style={{ textTransform: 'capitalize' }}
          >
            {event.status}
          </Label>
        </td>
        <td>
          {event.property}
        </td>
        {EventListItem.formatValue(event, event.old_value)}
        {EventListItem.formatValue(event, event.new_value)}
      </tr>
    );
  }
}
