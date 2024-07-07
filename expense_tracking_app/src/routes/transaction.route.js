const express = require('express');
const { GetTransactionByRoom, getAllTransactions, transactionsByUser, transactionsByUserInRoom } = require('../controllers/transaction.controller');

const transactionRoute = express.Router();

// ==================== Get all transactions related to a specific user ================
transactionRoute.get('/user', transactionsByUser)
// ==================== Get all transactions related to a specific room ================
transactionRoute.get('/room/:room_id', GetTransactionByRoom)
// ==================== Get all transactions related to a specific user and specific room================
transactionRoute.get('/user/:user_id/room/:room_id', transactionsByUserInRoom)
// ==================== Get all transactions related to a specific expense ================
transactionRoute.get('/expense/:expense_id', getAllTransactions)

module.exports = transactionRoute;