import {
  SET_LOGIN_PENDING,
  SET_LOGIN_SUCCESS,
  SET_LOGIN_ERROR,
  SET_EVENTS,
} from './types';

function setLoginPending(isLoginPending) {
  return {
    type: SET_LOGIN_PENDING,
    isLoginPending
  };
}

function setLoginSuccess(isLoginSuccess) {
  return {
    type: SET_LOGIN_SUCCESS,
    isLoginSuccess
  };
}

function setLoginError(loginError) {
  return {
    type: SET_LOGIN_ERROR,
    loginError
  }
}

function callLoginApi(email, password, callback) {
  setTimeout(() => {
    if (email === 'test@email.com' && password === 'test') {
      return callback(null);
    } else {
      return callback(new Error('Invalid email and password'));
    }
  }, 1000);
}

export function login(email, password) {
  return dispatch => {
    dispatch(setLoginPending(true));
    dispatch(setLoginSuccess(false));
    dispatch(setLoginError(null));

    callLoginApi(email, password, error => {
      dispatch(setLoginPending(false));
      if (!error) {
        dispatch(setLoginSuccess(true));
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        dispatch(setLoginError(error));
      }
    });
  }
}

export const addEvent = (id, event) => dispatch => {
  dispatch({ type: SET_EVENTS, payload: {id, event} });
};
