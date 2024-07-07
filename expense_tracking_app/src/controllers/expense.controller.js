const { query } = require("../config/db");

// ==================== Create a new expense with individual shares ================
const createExpense = async (req, res) => {
	try {
		const { title="", amount, room_id, shares, settled=0 } = req.body;
		const user_id = req.decoded.id;

		if (!title.trim() || !amount || !room_id || !shares || !Array.isArray(shares)) {
			return res.status(400).json({ status: false, message: "Missing required fields" });
		}

		const allMember = await query("SELECT user_id FROM Room_Members WHERE room_id = ?", [room_id]);
		const userId = allMember.map(user => user.user_id);


		if (!userId.includes(user_id)) {
			return res.status(404).json({
				status: false,
				message: "You are not a member of this room"
			});
		}

		for (const share of shares) {
			if (!share.user_id || !share.share_amount) {
				return res.status(406).json({ status: false, message: "Each share must contain user_id and share_amount" });
			}

			if (!userId.includes(share.user_id)) {
				return res.status(401).json({
					status: false,
					message: `This id = ${share.user_id} is not a member of this room`
				});
			}
		}


		const totalShareAmount = shares.reduce((total, share) => total + share.share_amount, 0);


		// Validate total amount matches sum of individual shares
		if (Math.round(totalShareAmount) !== Math.round(amount)) {
			return res.status(417).json({ status: false, message: "Total amount does not match sum of individual shares" });
		}

		await query("START TRANSACTION");

		// Insert expense
		const insertExpenseQuery = "INSERT INTO Expense (title, amount, payer_id, room_id, settled) VALUES (?, ?, ?, ?, ?)";

		const expenseValues = [title, amount, user_id, room_id, settled];
		const result = await query(insertExpenseQuery, expenseValues);
		const expenseId = result.insertId;

		// Insert individual shares, if any
		if (shares.length > 0) {
			const insertSharesQuery = "INSERT INTO Transaction (payer_id, payee_id, amount, expense_id) VALUES ?";
			const shareValues = shares.map(share => [user_id, share.user_id, share.share_amount, expenseId]);
			// console.log(shareValues);
			await query(insertSharesQuery, [shareValues]);
		}
		let message = settled ? "Amount Settled Successfully" : "Expense created successfully";
		await query("COMMIT");
		res.status(201).json({ status: true, message: message });

	} catch (error) {
		// await query("ROLLBACK");
		res.status(500).json({ status: false, message: error.message });
	}

};

// ==================== Get details of a specific expense ================

const getExpenseByID = async (req, res) => {
	try {
		const expense_id = req.params.expense_id;
		const user_id = req.decoded.id;
		const [expense] = await query(
			`SELECT e.expense_id,r.name AS room_name, e.title,e.amount,u.username AS paid_By,e.expense_date 
			 FROM Expense e 
			 JOIN User u ON e.payer_id = u.user_id 
			 JOIN Room r ON e.room_id = r.room_id 
			 WHERE e.expense_id = ? AND e.payer_id = ? `,
			[expense_id, user_id]
		);
		if (expense) {
			return res.status(200).send({
				success: true,
				message: "Expense Details",
				expense,
			});
		} else {
			return res.status(404).send({
				success: false,
				message: "Expense Not Found",
			});
		}
	} catch (error) {
		return res.status(500).send({
			success: false,
			message: error.message,
		});
	}
};

// ==================== Update an existing expense ================
const updateExpense = async (req, res) => {
	try {
		const { title, amount, room_id, shares } = req.body;
		const expense_id = req.params.expense_id;
		const user_id = req.decoded.id;

		if (!room_id || !shares || !Array.isArray(shares)) {
			return res.status(417).json({ status: false, message: "Missing required fields" });
		}

		const [accessControl] = await query('SELECT * from Expense e join Room_Members r on e.room_id = r.room_id where e.expense_id = ? AND e.payer_id = ? and e.payer_id = r.user_id;', [expense_id, user_id])

		if (!accessControl) {
			return res.status(401).json({ success: false, message: 'You are not authorized to perform this action' })
		}

		// Get existing expense details
		const [expense] = await query("SELECT title, amount FROM Expense WHERE expense_id = ?", [expense_id]);
		const updatedTitle = title || expense.title;
		const updatedAmount = amount || expense.amount;

		const allMember = await query("SELECT user_id FROM Room_Members WHERE room_id = ?", [room_id]);
		const userId = allMember.map(user => user.user_id);
		for (const share of shares) {
			if (!share.user_id || !share.share_amount) {
				return res.status(406).json({ status: false, message: "Each share must contain user_id and share_amount" });
			}

			if (!userId.includes(share.user_id)) {
				return res.status(404).json({
					status: false,
					message: `This id = ${share.user_id} is not a member of this room`
				});
			}
		}

		// Check if total share amounts match the expense amount
		const totalShareAmount = shares.reduce((total, share) => total + share.share_amount, 0);

		if (Math.round(totalShareAmount) !== Math.round(updatedAmount)) {
			return res.status(417).json({ status: false, message: "Total amount does not match sum of individual shares" });
		}

		// Update expense and insert shares in a transaction
		const shareValues = shares.map(share => [user_id, share.user_id, share.share_amount, expense_id]);
		await query(`
		START TRANSACTION;
		UPDATE Expense SET title = ?, amount = ? WHERE expense_id = ?;
		DELETE FROM Transaction WHERE expense_id = ?;
		INSERT INTO Transaction (payer_id, payee_id, amount, expense_id) VALUES ?;COMMIT;`, [updatedTitle, updatedAmount, expense_id, expense_id, shareValues]);

		// let placeholders = [updatedTitle, updatedAmount, expense_id]
		// let sql_query = `START TRANSACTION;UPDATE Expense SET title = ?, amount = ? WHERE expense_id = ?;`
		// for(const share of shares){
		// 	sql_query += `UPDATE Transaction SET amount = ? WHERE expense_id = ? AND payee_id = ?;`
		// 	placeholders.push(share.share_amount, expense_id, share.user_id)
		// }
		// sql_query += 'COMMIT;'
		// await query(sql_query, placeholders)
		res.status(200).json({ status: true, message: "Expense updated successfully" });
	} catch (error) {
		await query("ROLLBACK");
		res.status(500).json({ status: false, message: error.message });
	}
};

// ==================== Delete an existing expense ================

const deleteExpenseById = async (req, res) => {
	try {
		const expense_id = Number(req.params.expense_id);
		const user_id = req.decoded.id;

		const [expense] = await query(
			`SELECT * FROM Expense WHERE expense_id =? AND payer_id =?`,
			[expense_id, user_id]
		);
		if (expense) {
			const deleteExpenseQuery = "DELETE FROM Expense WHERE expense_id =? AND payer_id =?";
			await query(deleteExpenseQuery, [expense_id, user_id]);
			return res.status(200).send({
				success: true,
				message: "Expense deleted successfully",
			});
		} else {
			return res.status(404).send({
				success: false,
				message: "Expense not found",
			});
		}
	} catch (error) {
		return res.status(500).send({
			success: false,
			message: error.message,
		});
	}
};

module.exports = { createExpense, getExpenseByID, deleteExpenseById, updateExpense }
