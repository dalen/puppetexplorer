import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactList from './FactList';
import FactChart from './FactChart';
import FactTree from '../FactTree';
import * as PuppetDB from '../../../PuppetDB';

// The facts view
export default (props: {
  readonly serverUrl: string,
  readonly queryParsed: PuppetDB.queryT | null,
  readonly factTree: FactTree,
  readonly activeFactCharts: OrderedSet<PuppetDB.factPathT>,
  readonly toggleChart: (chart: PuppetDB.factPathT) => void,
  readonly factSelect: (fact: PuppetDB.factPathT, value: string) => void,
}) =>
  (<Grid>
    <Row>
      <Col md={6}>
        <FactList
          factTree={props.factTree}
          activeFactCharts={props.activeFactCharts}
          toggleChart={props.toggleChart}
          indent={0}
        />
      </Col>
      <Col md={6}>
        {props.activeFactCharts.map((fact: PuppetDB.factPathT) =>
          (<FactChart
            fact={fact}
            serverUrl={props.serverUrl}
            queryParsed={props.queryParsed}
            key={fact.join('.')}
            onSelect={value => props.factSelect(fact, value)}
          />),
        )}
      </Col>
    </Row>
  </Grid>);
