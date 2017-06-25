// @flow
import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

import ReportListContainer from './ReportListContainer';

export default (props: { serverUrl: string, node: string }) =>
  (<div>
    <PageHeader>{props.node}</PageHeader>
    <Grid>
      <Row>
        <Col md={6}>
          <ReportListContainer node={props.node} serverUrl={props.serverUrl} />
        </Col>
        <Col md={6}>
          {/* <important-facts node="$ctrl.node"></important-facts> */}
        </Col>
      </Row>
    </Grid>
  </div>);
