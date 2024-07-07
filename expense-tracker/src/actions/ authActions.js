import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  UPDATE_SUCCESS,
  UPDATE_FAIL
} from './types';

export const login = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3030/api/v1/users/auth/login', formData);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    document.cookie = `refreshToken=${res.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; Secure;`;
  } catch (err) {
    dispatch({ type: LOGIN_FAIL, payload: err.response.data.message });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3030/api/v1/users/auth/registration', formData);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: REGISTER_FAIL, payload: err.response.data.message });
  }
};

export const UpdateUser = (formData) => async (dispatch) =>{
  try{
    const res = await axiosInstance.put('/users/update', formData)
    dispatch({ type: UPDATE_SUCCESS, payload: res.data });
  }catch(err){
    dispatch({ type: UPDATE_FAIL, payload: err.response.data.message });
  }
}

export const getUser = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get('/users');
    dispatch({ type: GET_USER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: GET_USER_FAIL, payload: err.response.data.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/users/auth/logout');
    dispatch({ type: LOGOUT_SUCCESS, payload: res.data.message });
    localStorage.removeItem('token');
    document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  } catch (err) {
    dispatch({ type: LOGOUT_FAIL, payload: err.response.data.message });
  }
};

export const resetPassword = (formData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/users/auth/reset-password', formData);
    console.log(res);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: RESET_PASSWORD_FAIL, payload: err.response.data.message });
  }
};