import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index'; // Import your combined reducers

// Configure the store with the combined reducers
const store = configureStore({
  reducer: rootReducer,
});

export default store;
