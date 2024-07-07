import {
  GET_ALL_TRANSACTION_SUCCESS,
  GET_ALL_TRANSACTION_FAIL,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
} from "../actions/types";

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  success: null,
};

const expenseReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ALL_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: payload,
        success: true,
        loading: false,
        error: null,
      };
    case GET_ALL_TRANSACTION_FAIL:
      return {
        ...state,
        transactions: [],
        success: false,
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
