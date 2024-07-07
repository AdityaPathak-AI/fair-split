const express = require('express');
const { createExpense, getExpenseByID, updateExpense, deleteExpenseById } = require("../controllers/expense.controller")


const expenseRoute = express.Router();

// ==================== Create a new expense with individual shares ================
expenseRoute.post('/', createExpense);
// ==================== Get details of a specific expense ================
expenseRoute.get('/:expense_id', getExpenseByID)
// ==================== Update an existing expense ================
expenseRoute.put('/:expense_id', updateExpense)
// ==================== Delete an existing expense ================
expenseRoute.delete('/:expense_id', deleteExpenseById)



module.exports = expenseRoute;


