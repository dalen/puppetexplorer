// @flow
import React from 'react';
import { Label, Collapse, Glyphicon } from 'react-bootstrap';
import Moment from 'react-moment';

export default class EventListItem extends React.Component {
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
  static formatValue(event: eventT, value: string): React$Element<*> {
    const matches = typeof value === 'string' ? value.match(/\{(\w{3,5})\}(\w+)/) : null;
    // Check if it is a file checksum
    if (event.resource_type === 'File' &&
        event.property === 'content' &&
        matches != null) {
      return (<td><Label>{matches[1]}</Label><wbr />{matches[2]}</td>);
    }
    return (<td>{value}</td>);
  }

  static defaultProps = {
    showNode: true,
  };

  state: { show: boolean } = { show: false };

  props: {
    event: eventT,
    showNode: boolean,
  };

  toggle = () => {
    this.setState({ show: !this.state.show });
  }

  selectReport(report: string) {
    console.log('selectReport', report);
  }


  render(): React$Element<*> {
    const event = this.props.event;
    return (
      <tr>
        { this.props.showNode && <td>{event.certname}</td> }
        <td>
          <Glyphicon glyph={this.state.show ? 'triangle-bottom' : 'triangle-right'} onClick={this.toggle} />
          {event.resource_type}<wbr />[{event.resource_title}]
          <Collapse in={this.state.show}><div>
            <dl>
              <dt>Message:</dt>
              <dd>{event.message}</dd>
              <dt>Containing class:</dt>
              <dd>{event.containing_class}</dd>
              <dt>Containment path:</dt>
              <dd>{event.containment_path.join(' / ')}</dd>
              <dt>File:</dt>
              <dd>{event.file}{event.file && event.line ? <span><wbr />:</span> : null}
                {event.line}</dd>
              <dt>Timestamp:</dt>
              <dd><Moment format="LLL" title={event.timestamp}>{event.timestamp}</Moment></dd>
              { event.report ? <div><dt>Report:</dt><dd>{event.report}</dd></div> : null }
            </dl>
          </div></Collapse>
        </td>
        <td><Label bsStyle={EventListItem.color(this.props.event.status)} style={{ textTransform: 'capitalize' }}>
          {event.status}
        </Label></td>
        <td>{event.property}</td>
        {EventListItem.formatValue(event, event.old_value)}
        {EventListItem.formatValue(event, event.new_value)}
      </tr>
    );
  }
}
