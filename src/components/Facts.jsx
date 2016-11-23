// @flow
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import FactList from './FactList';

// The facts view
export default class Facts extends React.Component {
  static parents(factPaths: factPathT[]): Array<string[]> {

  }

  // Add all the intermediate paths
  //
  // {
  //   fact: 'test',
  //
  // }
  static allPaths(factPaths: factPathT[]): factPathT[] {


  }

  props: {
    serverUrl: string,
    factNames: string[],
    factPaths: factPathT[],
    expandedFacts: Array<string[]>,
  };

  render(): React$Element<*> {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <FactList factNames={this.props.factNames} />
          </Col>
          <Col md={6}>
            {/* <important-facts node="$ctrl.node"></important-facts> */}
          </Col>
        </Row>
      </Grid>
    );
  }
}
