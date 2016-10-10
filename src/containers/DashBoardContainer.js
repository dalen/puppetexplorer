import { connect } from 'react-redux';

import DashBoard from '../components/DashBoard.jsx';

const DashBoardContainer = connect(
  (state, props) => ({
    serverUrl: props.config.serverUrl,
    panels: props.config.dashBoardPanels,
  })
)(DashBoard);

export default DashBoardContainer;
