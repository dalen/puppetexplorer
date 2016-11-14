// @flow
import React from 'react';

import ReportsHelper from '../helpers/ReportsHelper';

import type { reportT } from '../types';

export default class NodeListItem extends React.Component {
  props: {
    report: reportT,
  };

  render() {
    return (
      <tr>
        <td>report</td>
        <td>report</td>
        <td>report</td>
        <td>report</td>
        <td>report</td>
        <td>{ReportsHelper.statusIcon(this.props.report.status)}</td>
      </tr>
    );
  }
}
