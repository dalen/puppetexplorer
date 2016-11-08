import React from 'react';
import { Grid, Row, Col, Table, Well } from 'react-bootstrap';

export default class Usage extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={4}>
            <h3>Syntax</h3>
            <p>Use <code>fact=value</code> to search for nodes where <code>fact</code> equals
              <code>value</code>.
              To search for structured facts use dots between each part of the fact path, for
              example <code>foo.bar=baz</code>.
            </p>

            <p>Resources can be matched using the syntax
              <code>type[title]{'{'}param=value{'}'}</code>.
              The part in brackets is optional. You can also specify <code>~</code> before the
              <code>title</code>
              to do a regexp match on the title. Type names and class names are case insensitive.
              A resource can be preceded by <code>@@</code> to match exported resources, the default
              is to only match &quot;local&quot; resources.
            </p>

            <p>Strings can contain letters, numbers or the characters :-_ without needing to be
              quoted. If they contain any other characters they need to be quoted with single or
              double quotes. Use backslash (&#92;) to escape quotes within a quoted string or double
              backslash for backslashes.
            </p>

            <p>An unquoted number or the strings true/false will be interpreted as numbers and
              boolean values, use quotation marks around them to search for them as strings instead.
            </p>

            <p>A <code>@</code> sign before a string causes it to be interpreted as a date parsed
              with <a href="https://github.com/calebcase/timespec"> timespec</a>.
              For example <code>@&quot;now - 2 hours&quot;</code>.
            </p>

            <p>A <code>#</code> sign can be used to do a subquery, against the nodes endpoint for
              example to query the <code>report_timestamp</code>, <code>catalog_timestamp</code> or
              <code>facts_timestamp</code> fields.
              For example <code>#node.report_timestamp &lt; @&quot;now - 2 hours&quot;</code>.
            </p>

            <p>A subquery using the <code>#</code> sign can have a block of expressions instead of a
              single expression. For example
              <code>#node {'{'} report_timestamp &gt; @&quot;now - 4 hours&quot; and report_timestamp &lt;
                @&quot;now - 2 hours&quot; {'}'}</code>
            </p>

            <p>A bare string without comparison operator will be treated as a regexp match against
            the certname.</p>
          </Col>

          <Col md={4}>
            <h4>Comparison operators</h4>

            <Table condensed striped>
              <tbody>
                <tr><td>=</td><td>Equality</td></tr>
                <tr><td>!=</td><td>Not equal</td></tr>
                <tr><td>~</td><td>Regexp match</td></tr>
                <tr><td>!~</td><td>Not regexp match</td></tr>
                <tr><td>&lt;</td><td>Less than</td></tr>
                <tr><td>&lt;=</td><td>Less than or equal</td></tr>
                <tr><td>&gt;</td><td>Greater than</td></tr>
                <tr><td>&gt;=</td><td>Greater than or equal</td></tr>
              </tbody>
            </Table>

            <h4>Logical operators</h4>
            <Table condensed striped>
              <tbody>
                <tr><td>not</td><td>(unary op)</td></tr>
                <tr><td>and</td><td /></tr>
                <tr><td>or</td><td /></tr>
              </tbody>
            </Table>
            <p>Shown in precedence order from highest to lowest. Use parenthesis to change order
            in an expression.</p>
          </Col>

          <Col md={4}>
            <h3>Query Examples</h3>
            Nodes with package mysql-server and amd64 arcitecture
            <Well bsSize="sm">
              <tt>package[&quot;mysql-server&quot;] and architecture=amd64</tt>
            </Well>
            Nodes with the class Postgresql::Server and a version set to 9.3
            <Well bsSize="sm">
              <tt>class[postgresql::server]{'{'} version=&quot;9.3&quot; {'}'}</tt>
            </Well>
            Nodes with 4 or 8 processors running Linux
            <Well bsSize="sm">
              <tt>(processorcount=4 or processorcount=8) and kernel=Linux</tt>
            </Well>
            Nodes that haven&apos;t reported in the last 2 hours
            <Well bsSize="sm">
              <tt>#node.report_timestamp &lt; @&quot;now - 2 hours&quot;</tt>
            </Well>
          </Col>
        </Row>
      </Grid>
    );
  }
}
