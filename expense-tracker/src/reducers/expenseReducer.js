import {
  GET_ALL_EXPENSES_SUCCESS,
  GET_ALL_EXPENSES_FAIL,
  POST_ADD_EXPENSES_SUCCESS,
  POST_ADD_EXPENSES_FAIL,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
} from "../actions/types";

const initialState = {
  expenses: [],
  result: null,
  loading: false,
  error: null,
  success: null,
};

const expenseReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ALL_EXPENSES_SUCCESS:
      return {
        ...state,
        expenses: payload.data,
        loading: false,
        error: null,
      };
    case GET_ALL_EXPENSES_FAIL:
      return {
        ...state,
        expenses: [],
        success: false,
        error: payload,
      };
    case POST_ADD_EXPENSES_SUCCESS:
      return {
        ...state,
        ...payload,
        loading: false,
        success: payload?.message,
        result: payload,
        error: null,
      };
    case POST_ADD_EXPENSES_FAIL:
      return {
        ...state,
        success: false,
        result: payload,
        error: payload,
      };

      case CLEAR_SUCCESS:
        return {
          ...state,
          success: null,
        };
      case CLEAR_ERROR:
        return {
          ...state,
          error: null,
        };

    default:
      return state;
  }
};

export default expenseReducer;
