import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { OrderedSet } from 'immutable';

import FactList from './FactList';
import FactChart from './FactChart';
import * as PuppetDB from '../../../PuppetDB';

// The facts view
export default (props: {
  readonly serverUrl: string;
  readonly queryParsed: PuppetDB.queryT | null;
  readonly factPaths: ReadonlyArray<PuppetDB.FactPath.FactPath>;
  readonly activeFactCharts: OrderedSet<PuppetDB.FactPath.FactPath>;
  readonly toggleChart: (chart: PuppetDB.FactPath.FactPath) => void;
  readonly factSelect: (
    fact: PuppetDB.FactPath.FactPath,
    value: string,
  ) => void;
}) => (
  <Container>
    <Row>
      <Col md={6}>
        <FactList
          factPaths={props.factPaths}
          activeFactCharts={props.activeFactCharts}
          toggleChart={props.toggleChart}
          indent={0}
        />
      </Col>
      <Col md={6}>
        {props.activeFactCharts
          .toJS()
          .map((fact: PuppetDB.FactPath.FactPath) => (
            <FactChart
              fact={fact}
              serverUrl={props.serverUrl}
              queryParsed={props.queryParsed}
              key={fact.path.join('.')}
              onSelect={value => props.factSelect(fact, value)}
            />
          ))}
      </Col>
    </Row>
  </Container>
);
