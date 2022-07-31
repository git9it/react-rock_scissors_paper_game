import { SHOW_CUSTOM_ERROR } from './actions';

const reducer = (state, action) => {
  if (action.type === SHOW_CUSTOM_ERROR) {
    return {
      ...state,
      showAlert: true,
      alertType: action.payload.alertType,
      alertText: action.payload.alertText,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
