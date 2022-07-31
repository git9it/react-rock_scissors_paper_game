import React, { useReducer, useContext } from 'react';
import reducer from './reducer';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SHOW_CUSTOM_ERROR } from './actions';

const initialState = {
  showAlert: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const notify = (msg) =>
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  return (
    <AppContext.Provider
      value={{
        ...state,
        notify,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
