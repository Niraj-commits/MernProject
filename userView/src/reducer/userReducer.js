import {
  USER_LOGIN_FAIL,
  USER_LOGIN_LOGOUT,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
      break;
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
      break;
    case USER_LOGIN_FAIL:
      return { loading: true, error: action.payload };
      break;
    case USER_LOGIN_LOGOUT:
      return {};
      break;
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
      break;
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
      break;
    case USER_REGISTER_FAIL:
      return { loading: true, error: action.payload };
      break;
    default:
      return state;
  }
};
