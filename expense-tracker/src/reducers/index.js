import { combineReducers } from 'redux';
import authReducer from './authReducer';
import roomReducer from './roomReducer';
import expenseReducer from './expenseReducer';
import transactionReducer from './transactionReducer';

// Combine all auth-related reducers here
const rootReducer = combineReducers({
  auth: authReducer,
  room: roomReducer,
  expense: expenseReducer,
  transaction: transactionReducer
  // Add other reducers here if needed
});

export default rootReducer;