// @flow
import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

import ReportListContainer from '../containers/ReportListContainer';

export default class NodeDetail extends React.Component {
  props: {
    serverUrl: string,
    node: string,
  };

  render() {
    return (
      <div>
        <PageHeader>{this.props.node}</PageHeader>
        <Grid>
          <Row>
            <Col md={6}>
              <ReportListContainer node={this.props.node} serverUrl={this.props.serverUrl}/>
            </Col>
            <Col md={6}>
              {/* <important-facts node="$ctrl.node"></important-facts> */}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
