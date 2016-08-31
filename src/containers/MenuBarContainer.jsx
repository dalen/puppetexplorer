import { connect } from 'react-redux';

import { setServer } from '../actions/server';
import MenuBar from '../components/MenuBar.jsx';

const MenuBarContainer = connect(
  (state) => {
    console.log(state);
    return {
    servers: state.config.servers,
  }},
  () => ({
    serverSelect: (id) => setServer(id),
  })
)(MenuBar);

export default MenuBarContainer;
