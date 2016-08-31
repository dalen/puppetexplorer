import constants from '../constants';

export const setServer = (n) => ({
  type: constants.SET_SERVER,
  id: n,
});
