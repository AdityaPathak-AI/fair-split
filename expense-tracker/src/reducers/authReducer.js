import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  LOGOUT_SUCCESS,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
  success: null,
  message:null
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        success: payload.message,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...payload,
        loading: false,
        success: payload.message,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
        error: payload,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
        error: payload,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case GET_USER_FAIL:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
        error: payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        success: payload,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload.message
      };
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        ...payload,
        loading: false,
        success: payload.message,
      };
    case UPDATE_FAIL:
      return {
        ...state,
        ...payload,
        loading: false,
        error: payload.data,
      };
    case CLEAR_SUCCESS:
      return {
        ...state,
        success: null,
        message:null,
        error:null,

      };
    case CLEAR_ERROR:
      return {
        ...state,
        success:null,
        error: null,
        message:null
      };

    default:
      return state;
  }
};

export default authReducer;
