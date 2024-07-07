import axiosInstance from "../utils/axiosInstance";
import {
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAIL,
  GET_ROOM_SUCCESS,
  GET_ROOM_FAIL,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_FAIL,
  ADD_ROOM_MEMBER_SUCCESS,
  ADD_ROOM_MEMBER_FAIL,
  GET_ALL_EXPENSE_ROOM_SUCCESS,
  GET_ALL_EXPENSE_ROOM_FAIL,
  GET_ALL_ROOM_MEMBERS_SUCCESS,
  GET_ALL_ROOM_MEMBERS_FAIL,
  LEFT_ROOM_SUCCESS,
  LEFT_ROOM_FAIL,
  DELETE_ROOM_FAIL,
  DELETE_ROOM_SUCCESS,
  GET_NET_TOTAL_SUCCESS,
  GET_NET_TOTAL_FAIL
} from "./types";
export const getRoom = (room_id) => async (dispatch) => {
  if (room_id != null) {
    try {
      const res = await axiosInstance.get(`/rooms/get-room?room_id=${room_id}`);
      dispatch({ type: GET_ROOM_SUCCESS, payload: res.data.result });
    } catch (err) {
      dispatch({ type: GET_ROOM_FAIL, payload: err.response.data.message });
    }
  } else {
    try {
      const res = await axiosInstance.get(`/rooms/get-room`);
      dispatch({ type: GET_ROOMS_SUCCESS, payload: res.data.result });
    } catch (err) {
      dispatch({ type: GET_ROOMS_FAIL, payload: err.response.data.message });
    }
  }
};

export const createRoom = (formData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/rooms/create", formData);
    dispatch({ type: CREATE_ROOM_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: CREATE_ROOM_FAIL, payload: err.response.data.message });
  }
};

export const addRoomMember = (formData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/rooms/add-member", formData);
    dispatch({ type: ADD_ROOM_MEMBER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: ADD_ROOM_MEMBER_FAIL, payload: err.response.data.message });
  }
};

export const getAllExpenseByRoom = (room_id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/rooms/get-totalExpense/${room_id}`);
    dispatch({ type: GET_ALL_EXPENSE_ROOM_SUCCESS, payload: res.data.result });
  } catch (err) {
    dispatch({
      type: GET_ALL_EXPENSE_ROOM_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const getAllRoomMember = (room_id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/rooms/members/${room_id}`);
    dispatch({ type: GET_ALL_ROOM_MEMBERS_SUCCESS, payload: res.data.result });
  } catch (err) {
    dispatch({
      type: GET_ALL_ROOM_MEMBERS_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const leaveRoom = (room_id) => async (dispatch) => {
  try {
    const res = await axiosInstance.delete(`/rooms/left/${room_id}`);
    console.log(res)
    dispatch({ type: LEFT_ROOM_SUCCESS, payload: res.data.message });
  } catch (err) {
    console.log(err);
    dispatch({ type: LEFT_ROOM_FAIL, payload: err.response.data.message });
  }
};


export const deleteRoom = (room_id) => async (dispatch) => {
  try {
    const res = await axiosInstance.delete(`/rooms/delete_room/${room_id}`);
    dispatch({ type: DELETE_ROOM_SUCCESS, payload: res.data.message });
  } catch (err) {
    dispatch({ type: DELETE_ROOM_FAIL, payload: err.response.data.message });
  }
};

export const getNetProfit = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/rooms/netTotal`);
    dispatch({ type: GET_NET_TOTAL_SUCCESS, payload: res.data.data});
  } catch (err) {
    dispatch({ type:GET_NET_TOTAL_FAIL, payload: err.response.data.message });
  }
};
