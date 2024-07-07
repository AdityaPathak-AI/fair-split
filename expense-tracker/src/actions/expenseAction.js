import axiosInstance from "../utils/axiosInstance";
import {
    GET_ALL_EXPENSES_SUCCESS,
    GET_ALL_EXPENSES_FAIL,
    POST_ADD_EXPENSES_SUCCESS,
    POST_ADD_EXPENSES_FAIL,
    DELETE_EXPENSE_SUCCESS,
    DELETE_EXPENSE_FAILED

} from "./types";
export const getAllExpenses = (room_id, offset) => async (dispatch) => {
    try {
        const res = await axiosInstance.get(`/rooms/expenseHistory/${room_id}?offset=${offset}`);
        dispatch({ type: GET_ALL_EXPENSES_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({ type: GET_ALL_EXPENSES_FAIL, payload: err.response.data.results });
    }

};
export const addNewExpense = (addExpense) => async (dispatch) => {
    try {
        const res = await axiosInstance.post(`/expenses`, addExpense);
        dispatch({ type: POST_ADD_EXPENSES_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({ type: POST_ADD_EXPENSES_FAIL, payload: err.response.data.message });
    }
};
export const deleteExpense = (expense_id) => async (dispatch) => {
    try {
        const res = await axiosInstance.delete(`expenses/${expense_id}`);
        dispatch({ type: DELETE_EXPENSE_SUCCESS, payload: res.data });

    } catch (error) {
        dispatch({ type: DELETE_EXPENSE_FAILED, payload: error.response.data.message });
    }
};