import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';

import ReportListContainer from './ReportListContainer';

export default (props: {
  readonly serverUrl: string;
  readonly node: string;
}) => (
  <div>
    <h1>{props.node}</h1>
    <Container>
      <Row>
        <Col md={6}>
          <ReportListContainer node={props.node} serverUrl={props.serverUrl} />
        </Col>
        <Col md={6}>
          {/* <important-facts node="$ctrl.node"></important-facts> */}
        </Col>
      </Row>
    </Container>
  </div>
);
