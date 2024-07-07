const { query } = require("../config/db");

// ==================== Get all transactions related to a specific user ================

const transactionsByUser = async (req, res) => {
    try {
        const user_id = req.decoded.id
        const result = await query(`
        SELECT transaction_id, Transaction.payer_id as Paid_To, Transaction.payee_id, Transaction.amount as transaction_amount, Expense.title, transaction_date, Expense.amount as Expense_amount, User.username, Room.name as Room  
        FROM Transaction 
        JOIN Expense on Expense.expense_id = Transaction.expense_id
        JOIN User on User.user_id = Transaction.payer_id
        JOIN Room on Room.room_id = Expense.room_id
        WHERE payee_id = ?`, [user_id])

        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                data = result[i]
                if (data.Paid_To === data.payee_id) {
                    delete data.transaction_amount
                }
                data.Paid_To = data.username
                delete data.payee_id
                delete data.username
            }
            res.status(200).send({ success: true, data: result })
        } else {
            res.status(404).send({ message: "No transactions exists" })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Error getting data", Error: error.message })
    }
}

// ==================== Get all transactions related to a specific room ================

const GetTransactionByRoom = async (req, res) => {
    try {
        const user_id = req.decoded.id;
        const room_id = req.params.room_id;

        // const [ismember] = await query(`SELECT * FROM Room_Members WHERE room_id = ? AND user_id = ?`, [room_id, user_id]);
        // if (!ismember) {
        //     return res.status(401).send({
        //         success: false,
        //         message: "Invalid RoomID OR Invalid User to Access This Room !!!"
        //     })
        // }

        const SqlQuery = `SELECT transaction_id, Room.name AS Room_Name, payer.username AS Payer_username,Expense.expense_id, Expense.title as Expense_Name,Expense.amount as Total_Expense, Transaction.amount AS Share_amount, payee.username AS Payee_username
                        FROM Transaction 
                        JOIN Expense ON Transaction.expense_id = Expense.expense_id 
                        JOIN User AS payer ON payer.user_id = Transaction.payer_id 
                        JOIN User AS payee ON payee.user_id = Transaction.payee_id 
                        JOIN Room ON Room.room_id = Expense.room_id 
                        WHERE Expense.room_id = ? AND (EXISTS(SELECT 1 FROM Room_Members WHERE room_id = ? AND user_id = ?)) 
                        ORDER BY Transaction.transaction_id DESC`;

        const Transaction = await query(SqlQuery, [room_id, room_id, user_id]);
        if (Transaction.length !== 0) {
            res.status(200).send({
                success: true,
                message: `Transaction for group : ${room_id}`,
                Transactions: Transaction
            })
        } else {
            return res.status(401).send({
                success: false,
                message: "No transactions in this group"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// ==================== Get all transactions related to a specific user and specific room================


const transactionsByUserInRoom = async (req, res) => {
    try {
        const logged_in_user = req.decoded.id;
        const { user_id, room_id } = req.params;

        const userRooms = (await query('SELECT room_id FROM Room_Members WHERE user_id = ? AND room_id = ?', [logged_in_user, room_id]))

        if (userRooms.length === 0) {
            return res.status(401).send({ success: false, message: "Invalid user to access this group !!!" });
        }

        const result = await query(`
            SELECT Transaction.transaction_id, Transaction.payer_id AS Paid_To, Transaction.payee_id, Transaction.amount AS transaction_amount, Expense.title AS expense, Expense.amount AS Expense_Amount, transaction_date, User.username
            FROM Transaction
            JOIN Expense ON Expense.expense_id = Transaction.expense_id
            JOIN User ON Transaction.payer_id = User.user_id
            WHERE payee_id = ? AND Expense.room_id = ?`, [user_id, room_id]);

        if (result.length !== 0) {
            result.forEach(data => {
                if (data.Paid_To === data.payee_id) {
                    delete data.transaction_amount;
                }
                data.Paid_To = data.username;
                delete data.payee_id;
                delete data.username;
            });
            res.status(200).send({ success: true, data: result });
        } else {
            res.status(404).send({ message: "No transactions exist" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Error getting data", Error: error.message });
    }
}

// ==================== Get all transactions related to a specific expense ================


const getAllTransactions = async (req, res) => {
    try {
        const user_id = req.decoded.id;
        const expense_id = req.params.expense_id;

        const isMember = await query(`SELECT expense_id, User.user_id, Room_Members.room_id     
                                FROM Room_Members     
                                INNER JOIN User ON Room_Members.user_id = User.user_id     
                                INNER JOIN Expense ON Room_Members.room_id = Expense.room_id     
                                WHERE Expense.expense_id = ? AND Room_Members.user_id = ?;`, [expense_id, user_id])

        if (isMember.length === 0) {
            return res.status(401).send({
                success: false,
                message: "Invalid user to access this group !!!"
            })
        }
        const Query = `
        SELECT
            e.expense_id,
            e.title,
            u1.username AS payer,
            u2.username AS payee,
            e.amount,
            t.amount AS split_amount
        FROM
            Expense e
        JOIN
            Transaction t ON e.expense_id = t.expense_id
        JOIN
            User AS u1 ON t.payer_id = u1.user_id
        JOIN
            User AS u2 ON t.payee_id = u2.user_id
        WHERE
            e.expense_id = ?`;

        const array = await query(Query, [expense_id]);

        if (array.length === 0) {
            return res.status(404).json({ status: false, error: 'Expense not found' });
        }

        let result = {
            expense_id: array[0].expense_id,
            title: array[0].title,
            payer: array[0].payer,
            amount: array[0].amount,
            split_amount: {}

        }
        array.forEach(row => {
            result.split_amount[row.payee] = row.split_amount;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

module.exports = { getAllTransactions, GetTransactionByRoom, transactionsByUser, transactionsByUserInRoom };
