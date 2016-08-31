import { connect } from 'react-redux';

import DashBoard from '../components/DashBoard.jsx';

const DashBoardContainer = connect(
  (state) => ({
    panels: state.config.dashBoardPanels,
  })
)(DashBoard);

export default DashBoardContainer;
