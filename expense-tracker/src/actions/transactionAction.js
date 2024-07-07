import axiosInstance from "../utils/axiosInstance";
import {
    GET_ALL_TRANSACTION_SUCCESS,
    GET_ALL_TRANSACTION_FAIL

} from "./types";
export const getAllTransactions = (expense_id) => async (dispatch) => {
    try {
        const res = await axiosInstance.get(`/transactions/expense/${expense_id}`);
        dispatch({ type: GET_ALL_TRANSACTION_SUCCESS, payload: res.data});
    } catch (err) {
        dispatch({ type: GET_ALL_TRANSACTION_FAIL, payload: err.response.data.result });
    }
};
