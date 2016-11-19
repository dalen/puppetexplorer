// @flow
import React from 'react';
import { Breadcrumb, Label, Collapse, Table, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';
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

  // {this.state.show ? 'triangle-right' : 'triangle-down'}

  render(): React$Element<*> {
    const event = this.props.event;
    return (
      <tr>
        { this.props.showNode ? <td>{event.certname}</td> : null }
        <td>
          <Glyphicon glyph={this.state.show ? 'triangle-bottom' : 'triangle-right'} onClick={this.toggle} />
          {event.resource_type}[{event.resource_title}]
          <Collapse in={this.state.show}><div>
            <dl>
              <dt>Message:</dt>
              <dd>{event.message}</dd>
              <dt>Containing class:</dt>
              <dd>{event.containing_class}</dd>
              <dt>Containment path:</dt>
              <dd>{event.containment_path.join(' / ')}</dd>
              <dt>File:</dt>
              <dd>{event.file}{event.file && event.line ? <span>:</span> : null}{event.line}</dd>
              <dt>Timestamp:</dt>
              <dd><Moment format="LLL" title={event.timestamp}>{event.timestamp}</Moment></dd>
              { event.report ? <div><dt>Report:</dt><dd>{event.report}</dd></div> : null }
            </dl>
            <ListGroup>
              <ListGroupItem header="Message">{event.message}</ListGroupItem>
              <ListGroupItem header="Containing class">{event.containing_class}</ListGroupItem>
              <ListGroupItem header="Containment path">
                {event.containment_path.join(' / ')}
              </ListGroupItem>
              <ListGroupItem header="File">{event.file}{event.file && event.line ? <span>:</span> : null}{event.line}</ListGroupItem>
              <ListGroupItem header="Timestamp">
                <Moment format="LLL" title={event.timestamp}>{event.timestamp}</Moment>
              </ListGroupItem>
              { event.report ? <ListGroupItem header="Report">{event.report}
              </ListGroupItem> : null }
            </ListGroup>
            <Table>
              <tbody>
                <tr>
                  <th>Message</th>
                  <td>{event.message}</td>
                </tr>
                <tr>
                  <th>Containing class</th>
                  <td>{event.containing_class}</td>
                </tr>
                <tr>
                  <th>Containment path</th>
                  <td>
                    <Breadcrumb>
                      {event.containment_path.map((container, i) =>
                        <Breadcrumb.Item active key={i}>{container}</Breadcrumb.Item>)
                      }
                    </Breadcrumb>
                  </td>
                </tr>
                <tr>
                  <th>File</th>
                  <td>
                    {event.file}{event.file && event.line ? <span>:</span> : null}{event.line}
                  </td>
                </tr>
                <tr>
                  <th>Timestamp</th>
                  <td><Moment format="LLL" title={event.timestamp}>{event.timestamp}</Moment></td>
                </tr>
                { event.report ? <tr>
                  <th>Report</th>
                  <td>{event.report}</td>
                </tr> : null }
              </tbody>
            </Table>
          </div></Collapse>
        </td>
        <td><Label bsStyle={EventListItem.color(this.props.event.status)} style={{ textTransform: 'capitalize' }}>
          {event.status}
        </Label></td>
        <td>{event.property}</td>
        <td>{event.old_value}</td>
        <td>{event.new_value}</td>
      </tr>
    );
  }
}
