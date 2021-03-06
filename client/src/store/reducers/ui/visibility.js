import { handleActions } from 'redux-actions';
import mapValues from 'lodash/mapValues';

export const initialState = {
  loginOverlay: false,
  userMenu: false,
  tocDrawer: false,
  annotation: 2,
  uiPanels: {
    readerReturn: false,
    user: false,
    appearance: false,
    layers: false,
    search: false
  }
};

const panelSolo = {
  readerReturn: true,
  user: true,
  appearance: true,
  layers: true,
  search: true
};

const visibilityToggle = (state, action) => {
  let result;
  if (action.payload === "annotation") {
    result = state[action.payload] + 1 > 2 ? 0 : state[action.payload] + 1;
  } else {
    result = !state[action.payload];
  }
  return Object.assign({}, state, { [action.payload]: result });
};

const visibilityShow = (state, action) => {
  return Object.assign({}, state, { [action.payload]: true });
};

const visibilityHide = (state, action) => {
  return Object.assign({}, state, { [action.payload]: false });
};

const panelToggle = (state, action) => {
  let soloSwitch = false;

  // If the panel should display solo and its state is false when it is toggled,
  // set other panels to false on toggle
  if (panelSolo[action.payload] === true && state.uiPanels[action.payload] === false) {
    soloSwitch = true;
  }

  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return !value;
    if (soloSwitch) return false;
    return value;
  });
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const panelShow = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return true;
    if (panelSolo[action.payload] === true) return false;
    return value;
  });
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const panelHide = (state, action) => {
  const switchedPanels = mapValues(state.uiPanels, (value, key) => {
    if (key === action.payload) return false;
    return value;
  });
  return Object.assign({}, state, { uiPanels: switchedPanels });
};

const allPanelsHide = (state) => {
  return Object.assign({}, state, { uiPanels: initialState.uiPanels });
};

export default handleActions({
  VISIBILITY_TOGGLE: visibilityToggle,
  VISIBILITY_SHOW: visibilityShow,
  VISIBILITY_HIDE: visibilityHide,
  PANEL_TOGGLE: panelToggle,
  PANEL_SHOW: panelShow,
  PANEL_HIDE: panelHide,
  PANEL_HIDE_ALL: allPanelsHide,
  '@@reduxReactRouter/routerDidChange': allPanelsHide
}, initialState);
