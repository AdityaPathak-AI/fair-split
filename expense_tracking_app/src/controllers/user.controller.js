const { query } = require('../config/db');
const { hashPassword, comparePassword } = require("../utils/authHelper");
const jwt = require('jsonwebtoken');



// ==================== User Registration ====================
const registrationController = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const [user] = await query("SELECT * FROM User WHERE email = ? OR phone = ?", [email, phone]);
        if (user && user.username === username) {
            return res.status(406).send({
                status: false,
                message: "Username already exists"
            })
        }
        if (user && user.phone === phone) {
            return res.status(406).send({
                status: false,
                message: "Phone already exists"
            })
        }
        if (user && user.email === email) {
            return res.status(406).send({
                status: false,
                message: "Email already exists"
            })
        }
        await query("INSERT INTO User (username,phone,email,password) VALUES (?,?,?,?)", [username, phone, email, hashedPassword]);
        return res.status(200).send({
            status: true,
            message: "Registration successfull",
        })
    } catch (error) {
        if (error) {
            return res.status(500).send({
                status: false,
                message: "Internal server error",
                error: error.message
            })
        }

    }
}

// ==================== User Login ====================

const loginController = async (req, res) => {
    try {
        let { email = '', password = '' } = req.body;
        email = email.trim().toLowerCase();
        password = password.trim();

        if (!email || !password) {
            return res.status(417).send({
                status: false,
                message: "Please enter email and password"
            })
        }
        const [user] = await query("SELECT * FROM User WHERE email = ?", [email]);
        if (!user) {
            return res.status(417).send({
                status: false,
                message: "Email does not exist"
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                status: false,
                message: "Wrong password !!!"
            })
        }

        // const accessToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
        //     expiresIn: '1d'
        // })

        const refreshToken = jwt.sign({ id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '28d' })
        await query(`UPDATE User SET token = ? WHERE user_id = ?`, [refreshToken, user.user_id])

        // const options = { httpOnly: true, secure: true }

        res.status(200).send({
            status: true,
            message: "Login successfully !!!",
            // accessToken: accessToken,
            refreshToken: refreshToken
        })


    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Login failed",
            error: err.message
        })
    }
}

// ==================== Refresh Token ===================

const accessToken = async (req, res) => {
    // const incomingCookie = req.cookies

    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(401).send({ success: false, message: "Unauthorized request" })
        }
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const [user] = await query('SELECT user_id, token from User where user_id = ?', [decodedToken.id])
        if (!user) {
            return res.status(401).send({ success: false, message: "Invalid refresh token" })
        }
        if (refreshToken !== user.token) {
            return res.status(401).send({ success: false, message: "Refresh token is expired" })
        }

        // const options = { httpOnly: true, secure: true }
        const accessToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        // const refreshToken = jwt.sign({ id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '28d' })
        // await query(`UPDATE User SET token = ? WHERE user_id = ?`, [refreshToken, user.user_id])

        return res.status(200).send({ success: true, message: "Token refreshed successfully", accessToken: accessToken })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}


// ==================== Logout User ===================

const logOutController = async (req, res) => {
    try {
        let user_id = req.decoded.id;
        await query("UPDATE User SET token = ? WHERE user_id = ?", [null, user_id]);
        res.status(200).send({
            status: true,
            message: "User logged out successfully"
        });

    } catch (err) {
        console.error('Error logging out user:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}


// ==================== Update User ====================

const updateController = async (req, res) => {
    try {
        let user_id = req.decoded.id;
        const allowedKeys = ["username", "phone"];
        const requestBodyKeys = Object.keys(req.body);

        const invalidKeys = requestBodyKeys.filter(key => !allowedKeys.includes(key));
        if (invalidKeys.length > 0) {
            return res.status(406).send({
                status: false,
                message: `Invalid keys: ${invalidKeys.join(", ")}. Only 'username' and 'phone' are allowed.`
            });
        }

        if (requestBodyKeys.length === 0) {
            return res.status(406).send({
                status: false,
                message: "Please provide user details"
            });
        }

        let { username = '', phone = '' } = req.body;
        let sql = "UPDATE User SET";
        const values = [];

        if (username) {
            username = username.trim();
            sql += " username = ?";
            values.push(username);
        }

        if (phone) {
            phone = phone.trim();
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).send({
                    status: false,
                    message: "Please enter a 10-digit number for the phone"
                });
            }
            sql += `${username ? "," : ""} phone = ?`;
            values.push(phone);
        }

        sql += " WHERE user_id = ?";
        values.push(user_id);

        await query(sql, values);

        return res.status(200).send({
            status: true,
            message: "User updated successfully",
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return res.status(500).send({
            status: false,
            message: "User updation failed!",
            error: err.message
        });
    }
};



// ==================== Delete User ====================

const deleteController = async (req, res) => {
    try {
        const user_id = req.decoded.id;
        const [user] = await query("SELECT * FROM User WHERE user_id  = ?", [user_id]);

        if (!user) {
            return res.status(404).send({
                status: false,
                message: "User does not exists !!!"
            })
        }

        await query("DELETE FROM User WHERE user_id = ?", [user_id]);

        res.status(200).send({
            status: true,
            message: "User deleted successfully !!!"
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Deletion failed !!!",
            error: err.message
        })
    }
}

// ==================== Reset Password ====================

const resetPassword = async (req, res) => {
    try {
        const user_id = req.decoded.id;
        const { oldPassword = '', newPassword = '' } = req.body;
        if (!oldPassword.trim() || !newPassword.trim()) {
            return res.status(417).send({
                status: false,
                message: "Please enter oldPassword and newPassword"
            })
        }
        const [user] = await query("SELECT * FROM User WHERE user_id = ?", [user_id]);
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "User doesn't exist"
            })
        }
        if (!await comparePassword(oldPassword, user.password)) {
            return res.status(417).send({
                status: false,
                message: "Old passoword is wrong"
            })
        }
        const hashedPassword = await hashPassword(newPassword);
        await query("UPDATE User SET password = ? WHERE user_id = ?", [hashedPassword, user_id]);
        return res.status(200).send({
            status: true,
            message: "Password update successfully"
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Reset password failed !!!",
            error: error.message
        })
    }
}

// ==================== Get a specific User ====================

const getUser = async (req, res) => {
    try {
        const userId = req.decoded.id;
        const [userData] = await query('SELECT username, phone, email FROM User WHERE user_id = ?', [userId]);

        if (!userData || userData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: true,
            message: userData
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


module.exports = { registrationController, loginController, logOutController, updateController, deleteController, resetPassword, getUser, accessToken };
