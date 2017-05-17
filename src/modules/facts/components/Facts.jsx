// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { OrderedSet } from 'immutable';

import FactList from './FactList';
import FactChart from './FactChart';
import FactTree from '../FactTree';

// The facts view
export default class Facts extends React.Component {
  props: {
    serverUrl: string,
    queryParsed: ?queryT,
    factTree: FactTree,
    activeFactCharts: OrderedSet<factPathT>,
    toggleChart: (chart: factPathT) => void,
    factSelect: (fact: factPathT, value: string) => void,
  };

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <FactList
              factTree={this.props.factTree}
              activeFactCharts={this.props.activeFactCharts}
              toggleChart={this.props.toggleChart}
            />
          </Col>
          <Col md={6}>
            {this.props.activeFactCharts.map(fact =>
              (<FactChart
                fact={fact}
                serverUrl={this.props.serverUrl}
                queryParsed={this.props.queryParsed}
                key={fact.join('.')}
                onSelect={value => this.props.factSelect(fact, value)}
              />)) }
          </Col>
        </Row>
      </Grid>
    );
  }
}
