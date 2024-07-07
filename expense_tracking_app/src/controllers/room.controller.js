
const { query } = require("../config/db");


// ==================== Create Room ====================

const createRoom = async (req, res) => {
    try {
        const userId = req.decoded.id;
        let { name = "", description = "" } = req.body;

        if (!name.trim()) {
            return res.status(417).send({
                success: false,
                message: 'Name field Required !!!',
            })
        }

        name = name.trim();

        let values = [name, userId];
        let sql = "INSERT INTO Room (name, created_by";
        if (description) {
            description = description.trim();
            sql += `, description)`;
            sql += " VALUES (?, ?, ?);"
            values.push(description);
        } else {
            sql += ") VALUES (?, ?);";
        }

        const inserted_data = await query(sql, values);

        // Adding user to newly created Room
        query('INSERT INTO Room_Members (room_id, user_id) VALUES (?, ?)', [inserted_data.insertId, userId]);

        return res.status(200).send({
            status: true,
            message: "Group created successfull",
            room_id: inserted_data.insertId
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Group creation failed !!!",
            error: error.message
        })
    }
}

// ==================== Get Room  ====================

const getRoom = async (req, res) => {
    try {
        const user_id = req.decoded.id
        if (!Object.keys(req.query).length) {
            const result = await query(`
            SELECT Room.room_id,Room.name, Room.description, Room.created_at, Room.updated_at, User.username as created_by 
            FROM Room 
            JOIN Room_Members on Room_Members.room_id = Room.room_id 
            JOIN User on User.user_id = Room.created_by 
            WHERE Room_Members.user_id = ?;`, [user_id])
            return res.status(200).send({ success: true, result: result })
        } else {
            const room_id = req.query.room_id
            const result = await query(`
            SELECT Room.room_id,Room.name, Room.description, Room.created_at, Room.updated_at, User.username as created_by 
            FROM Room 
            JOIN Room_Members on Room_Members.room_id = Room.room_id 
            JOIN User on User.user_id = Room.created_by  
            WHERE Room_Members.user_id = ? AND Room.room_id = ?`, [user_id, room_id])
            if (result.length === 0) {
                return res.status(404).send({ success: false, message: "Group does not exist" })
            }
            return res.status(200).send({ success: true, result: result })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Error getting groups", error: error.message })
    }
}

// ==================== Update Room  ====================


const updateRoom = async (req, res) => {
    try {
        let id = Number(req.params.id);
        let user_id = req.decoded.id;

        const { name = "", description = "" } = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({
                status: false,
                message: "Please provide name or description for updation",
            });
        }
        if (!id) {
            return res.status(417).send("ID is required");
        }

        if (!name) {
            return res.status(417).send({
                status: false,
                message: "Please provide name or description for updation",
            });
        }

        const [room] = await query(
            "SELECT * From Room_Members  WHERE room_id = ? AND user_id = ?",
            [id, user_id]
        );

        if (!room) {
            return res.status(401).send({
                status: false,
                message: "Group not found or you are not included in the group",
            });
        }

        let sql = "UPDATE Room SET";
        const values = [];

        if (name) {
            sql += " name = ?";
            values.push(name);
        }

        if (description) {
            sql += `${name ? "," : ""} description = ?`;
            values.push(description);
        }

        sql += " WHERE room_id = ?";
        values.push(id);

        await query(sql, values);

        res.status(200).send({
            status: true,
            message: "Group updated successfully",
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

// ==================== Add Room Members ====================
const addRoomMember = async (req, res) => {
    try {
        let { room_id = '', emails = [] } = req.body;

        // Trim and convert emails to lowercase
        emails = emails.map(email => email.trim().toLowerCase());
        if (!room_id || emails.length === 0) {
            return res.status(400).send({
                status: false,
                message: "Please provide group ID and emails"
            });
        }
        const addedMembers = [];
        const notAddedMembers = [];
        const alreadyAddedMembers = [];

        // Fetch all users with matching emails
        const users = await query('SELECT user_id,email FROM User WHERE email IN (?)', [emails]);
        const members = await query('SELECT * FROM Room_Members WHERE room_id = ?', [room_id])
        const newMembers = []
        emails.forEach(email => {
            const user = users.find(u => u.email === email);
            let member;
            if (user) {
                member = members.find(m => m.user_id === user.user_id);
            }
            if (user && member) {
                alreadyAddedMembers.push(email);
            } else if (user) {
                addedMembers.push(email);
                newMembers.push([
                    room_id,
                    user.user_id,
                ])
            } else {
                notAddedMembers.push(email);
            }
        });
        if (newMembers.length > 0) {
            const values = newMembers.map(member => `(${member.join(',')})`).join(',');
            const insertQuery = `INSERT INTO Room_Members (room_id, user_id) VALUES ${values}`;
            await query(insertQuery);
        }
        res.status(200).send({
            status: true,
            message: "Members added successfully",
            newMembers: addedMembers,
            invitedMembers: notAddedMembers,
            existingMembers: alreadyAddedMembers
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Failed to add member",
            error: error.message
        });
    }
};


const getTotalExpense = async (req, res) => {
    try {
        const { room_id } = req.params;
        let user_id = req.decoded.id;

        const optimized = await query(`select r.user_id, u.username, calculateTotalExpense(?, r.user_id, ?) as totalExpense 
                                        from Room_Members r 
                                        join User u on u.user_id = r.user_id 
                                        where r.room_id = ? and r.user_id != ? and (EXISTS(SELECT 1 FROM Room_Members where room_id = ? and user_id = ?));`, [user_id, room_id, room_id, user_id, room_id, user_id])

        // const SqlQuery = `
        // select r.user_id, u.username 
        // from Room_Members r 
        // join User u on u.user_id = r.user_id 
        // where r.room_id = ? and r.user_id != ? AND (EXISTS(SELECT 1 FROM Room_Members WHERE room_id = ? and user_id = ?))`;

        // const members = await query(SqlQuery, [room_id, user_id, room_id, user_id]);
        // let OverAllExpenseOnRoom = 0;

        // if (members.length !== 0) {
        // for (const member of members) {
        //     const mem_id = member.user_id;

        // const [UserExpense] = await query(`
        //     SELECT sum(Transaction.amount) as Total_Expense 
        //     FROM Transaction 
        //     JOIN Expense on Expense.expense_id = Transaction.expense_id 
        //     WHERE Transaction.payer_id = ? && Transaction.payee_id = ? && Expense.room_id = ?;`,
        //     [user_id, mem_id, room_id]);

        // const [UserExpense] = await query(`select sum(t.amount) as credit from Transaction t where t.payer_id = ? and t.payee_id = ? and t.expense_id in (select expense_id from Expense where room_id = ?);`, [user_id, mem_id, room_id])
        // const [memberExpense] = await query(`select sum(t.amount) as debit from Transaction t where t.payer_id = ? and t.payee_id = ? and t.expense_id in (select expense_id from Expense where room_id = ?);`, [mem_id, user_id, room_id])

        // const [balance] = await query(`call GetCreditDebit(?, ?, ?)`, [user_id, mem_id, room_id])

        // const [balance] = await query(`SELECT
        // SUM(CASE WHEN t.payer_id = ? AND t.payee_id = ? THEN t.amount ELSE 0 END) AS credit,
        // SUM(CASE WHEN t.payer_id = ? AND t.payee_id = ? THEN t.amount ELSE 0 END) AS debit
        // FROM Transaction t
        // WHERE
        // t.expense_id IN (SELECT expense_id FROM Expense WHERE room_id = ?);`, [user_id, mem_id, mem_id, user_id, room_id])


        // const [memberExpense] = await query(`
        //     SELECT sum(Transaction.amount) as Total_Expense 
        //     FROM Transaction 
        //     JOIN Expense on Expense.expense_id = Transaction.expense_id 
        //     WHERE Transaction.payer_id = ? && Transaction.payee_id = ? && Expense.room_id = ?;`,
        //     [mem_id, user_id, room_id]);

        // const Rem_Expense = memberExpense.Total_Expense - UserExpense.Total_Expense;
        //         const Rem_Expense = (balance.credit - balance.debit);
        //         member.totalExpense = Number((Rem_Expense).toFixed(2))

        //         OverAllExpenseOnRoom += Rem_Expense;
        //     }
        // }
        // members.OverAllExpense = OverAllExpenseOnRoom;

        if (optimized.length !== 0) {
            let OverAllExpenseOnRoom = 0
            for (const mem of optimized) {
                OverAllExpenseOnRoom += Number(mem.totalExpense)
            }
            res.status(200).json({ status: true, result: { OverAllExpense: Number((OverAllExpenseOnRoom).toFixed(2)), members: optimized } });
        }
        else {
            res.status(404).json({ success: false, result: {} })
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}


// ==================== Get ALL Members ================
const getAllMembers = async (req, res) => {
    try {
        const { room_id } = req.params;
        let user_id = req.decoded.id;
        // const ismember = await query("SELECT * FROM Room_Members WHERE user_id = ? AND room_id =?", [user_id, room_id]);
        // if (ismember.length === 0) {
        //     return res.status(404).send({
        //         status: false,
        //         message: "You are not a member of this room"
        //     })
        // }

        const SqlQuery = `
            SELECT User.user_id, User.username, User.email, User.phone FROM User
            INNER JOIN Room_Members ON User.user_id = Room_Members.user_id
            WHERE Room_Members.room_id = ? AND (EXISTS(SELECT 1 FROM Room_Members WHERE room_id = ? and user_id = ?))`;

        const members = await query(SqlQuery, [room_id, room_id, user_id]);
        if (members.length !== 0) {
            res.status(200).json({ status: true, result: members });
        } else {
            res.status(404).json({ status: false, message: "You are not a member of this group" })
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

// ==================== Leave Room ====================

const leaveRoom = async (req, res) => {
    try {
        const user_id = req.decoded.id;
        const room_id = req.params.room_id;
        let [amount] = await query(`select calculateUserExpense(?,?) as credit, calculateUserDebt(?, ?) as debit, user_id, room_id from Room_Members where user_id = ? and room_id = ?;`, [user_id, room_id, user_id, room_id, user_id, room_id])
        // let [credit] = await query(`call calculateCredit(?, ?)`, [user_id, room_id])
        // let [debit] = await query(`call calculateDebit(?, ?)`, [user_id, room_id])
        if (!amount) {
            return res.status(401).send({ success: false, message: "You are not authorized to perform this action" })
        }
        if ((amount.credit - amount.debit) === 0) {
            await query("DELETE FROM Room_Members WHERE user_id = ? AND room_id = ?", [user_id, room_id]);
            // if (deleteQuery["affectedRows"] === 0) {
            //     return res.status(401).send({ success: false, message: "Alreay Left the group" });
            // }
            res.status(200).send({ status: true, message: "Group left successfully" });
        } else {
            return res.status(404).send({ success: false, message: "You can not leave this group as your dues are not settled !" })
        }
        // const payer = `SELECT * FROM Transaction 
        //                JOIN Expense ON Expense.expense_id = Transaction.expense_id 
        //                WHERE Transaction.payer_id = ? && Transaction.payer_id != payee_id && room_id = ?;`

        // const payee = `SELECT * FROM Transaction 
        //                JOIN Expense ON Expense.expense_id = Transaction.expense_id 
        //                WHERE Transaction.payee_id = ? && Transaction.payer_id != payee_id && room_id = ?;`

        // const payer_result = await query(payer, [user_id, room_id]);
        // const payee_result = await query(payee, [user_id, room_id]);

        // console.log("Payer :", payer_result);
        // console.log("Payee :", payee_result);

        // if (payer_result !== payee_result) {
        //     return res
        //         .status(400)
        //         .send({ success: false, message: "You can not leave room !!!" });
        // }

        // // const result = await query("DELETE FROM Room_Members WHERE user_id =? AND room_id =?", [user_id, room_id]);

        // if (result["affectedRows"] === 0) {
        //     return res
        //         .status(401)
        //         .send({ success: false, message: "Alreay Left the group" });
        // }
        // res.status(200).send({
        //     status: true,
        //     message: "Room Left Successfully",
        // });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const netTotal = async (req, res) => {
    try {
        const user = req.decoded.id
        const [credit] = await query(`call calculateTotalCredit(?);`, [user])
        const [debit] = await query(`call calculateTotalDebit(?)`, [user])
        const result = +(Number(credit[0].total_credit) - Number(debit[0].total_debit)).toFixed(2)
        const response = { credit: Number(credit[0].total_credit), debit: Number(debit[0].total_debit), total: result }
        res.status(200).send({ success: true, data: response })
    } catch (error) {
        res.status(404).send({ success: false, message: "Error getting net total amount" })
    }
}

const expenseListByRoom = async (req, res) => {
    try {
        const user = req.decoded.id
        const room_id = req.params.room_id
        const offset = Number(req.query.offset)
        // const results = await query('select expense_id, Expense.title, amount, Expense.updated_at, User.username as paid_by, Expense.payer_id from Expense join User on User.user_id = Expense.payer_id where room_id = ? AND (EXISTS(SELECT 1 FROM Room_Members WHERE room_id = ? AND user_id = ?));', [room_id, room_id, user])
        const results = await query(`SELECT  e.expense_id,  e.title,  e.amount,  e.updated_at, e.settled,
                                    CASE WHEN e.payer_id = ? THEN 'You' ELSE u.username END as paid_by, e.payer_id,
                                    CASE WHEN e.payer_id = ? THEN (
                                        SELECT SUM(T.amount)
                                        FROM Transaction AS T
                                        WHERE T.expense_id = e.expense_id
                                        AND NOT (T.payer_id = T.payee_id)
                                    ) ELSE (
                                        SELECT -T.amount
                                        FROM Transaction AS T
                                        WHERE T.expense_id = e.expense_id
                                        AND T.payee_id = ?
                                    ) END AS lent_or_borrowed,
                                    (
                                        SELECT JSON_OBJECTAGG(payee, split_amount) AS result
                                        FROM (
                                            SELECT u2.username AS payee, t.amount AS split_amount
                                            FROM Transaction t
                                            JOIN User AS u2 ON t.payee_id = u2.user_id
                                            WHERE t.expense_id = e.expense_id
                                            ) AS subquery
                                    )   AS split_amount 
                                    FROM  Expense e  
                                    JOIN  User u ON e.payer_id = u.user_id
                                    WHERE e.room_id = ? AND EXISTS (  SELECT 1  FROM Room_Members  WHERE room_id = ? AND user_id  = ? )
                                    ORDER BY updated_at desc
                                    LIMIT 5 OFFSET ?;`, [user, user, user, room_id, room_id, user, offset])
        // console.log(results)
        if (results.length !== 0) {
            // for (const result of results) {
                // if (result.payer_id === user) {
                //     // result.paid_by = "You"
                //     const [amount] = await query(`SELECT sum(T.amount) as lent FROM Transaction AS T JOIN Expense AS E ON E.expense_id = T.expense_id WHERE T.expense_id = ? and not (T.payer_id = payee_id);`, [result.expense_id])
                //     result.lent = amount.lent
                // } else {
                //     const [amount] = await query(`SELECT T.amount as borrowed FROM Transaction AS T JOIN Expense AS E ON E.expense_id = T.expense_id WHERE T.expense_id = ? and payee_id = ?;`, [result.expense_id, user])
                //     if (!amount) {
                //         result.message = "You are not Involved"
                //     } else {
                //         result.borrowed = amount.borrowed
                //     }
                // }
                // const Query = `
                //                 SELECT u2.username AS payee, t.amount AS split_amount
                //                 FROM Transaction t
                //                 JOIN User AS u2 ON t.payee_id = u2.user_id
                //                 WHERE t.expense_id = ?`;
                // const array = await query(Query, [result.expense_id]);
                // console.log(array);
                // if (array.length === 0) {
                //     return res.status(404).json({ status: false, error: 'Expense not found' });
                // }
            //     let x = {
            //         payer: array[0].payer,
            //         split_amount: {}
            //     }
            //     array.forEach(row => {
            //         x.split_amount[row.payee] = row.split_amount;
            //     });
            //     result.split_amount = x.split_amount;
            // }
            res.status(200).send({ success: true, data: results })
        }
        else {
            res.status(404).send({ success: false, results: {}, message: "No expenses in this group" })
        }
    } catch (error) {
        res.status(404).send({ success: false, message: "Error getting expense data", Error: error.message })
    }
}

const deleteRoom = async (req, res) => {
    try {
        const user_id = req.decoded.id
        const room_id = Number(req.params.room_id)
        const [authorized] = await query(`SELECT created_by from Room WHERE room_id = ?`, [room_id])
        if (user_id !== authorized.created_by) {
            return res.status(401).send({ success: false, message: "You are not authorized to perform this action" })
        }
        const data = await query(`select room_id, user_id, calculateUserExpense(user_id, room_id) as credit, calculateUserDebt(user_id, room_id) as debit from Room_Members where room_id = ?;`, [room_id])
        for (const element of data) {
            if ((element.credit - element.debit) !== 0) {
                return res.status(401).send({ success: false, message: "This group cannot be deleted as the dues of the members are not settled" })
            }
        }
        await query(`DELETE FROM Room where room_id = ?`, [room_id])
        res.status(200).send({ success: true, message: "Group deleted successfully" })
    } catch (error) {
        res.status(500).send({ success: false, message: "Internal server error", error: error.message })
    }
}

module.exports = { createRoom, getRoom, leaveRoom, getTotalExpense, getAllMembers, updateRoom, addRoomMember, netTotal, expenseListByRoom, deleteRoom }
