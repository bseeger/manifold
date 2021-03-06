const initialState = {
  notifications: [],
  fatalError: null
};

const addNotification = (state, action) => {
  const index = state.notifications.findIndex(n => n.id === action.payload.id);
  if (index >= 0) {
    const notifications = state.notifications.slice(0);
    notifications[index] = action.payload;
    return Object.assign({}, state, { notifications });
  }
  return Object.assign({}, state, state.notifications.unshift(action.payload));
};

const setFatalError = (state, action) => {
  return Object.assign({}, state, { fatalError: action.payload });
};

const clearFatalError = (state, action) => {
  return Object.assign({}, state, { fatalError: null });
};

const removeNotification = (state, action) => {
  let found = false;
  const arrayClone = state.notifications.slice(0);
  arrayClone.forEach((notification, index) => {
    if (notification.id === action.payload) {
      found = true;
      arrayClone.splice(index, 1);
    }
  });
  const output = found ? arrayClone : state.notifications;
  return Object.assign({}, state, { notifications: output });
};

const removeAllNotifications = (state) => {
  return Object.assign({}, state, { notifications: [] });
};

const handleErrorAction = (state, action) => {
  if (action.payload.level && action.payload.heading) {
    return addNotification(state, action);
  }
  return state;
};

const notificationReducer = (state = initialState, action) => {

  if (action.type && action.type.startsWith("API_REQUEST")) {
    return clearFatalError(state, action);
  }

  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return addNotification(state, action);
    case 'REMOVE_NOTIFICATION':
      return removeNotification(state, action);
    case 'REMOVE_ALL_NOTIFICATIONS':
      return removeAllNotifications(state, action);
    case 'FATAL_ERROR_NOTIFICATION':
      return setFatalError(state, action);
    default:
      return state;
  }
};

export default notificationReducer;
