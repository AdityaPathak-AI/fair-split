const express = require('express');
require('dotenv').config();
const authRoute = require("./src/routes/auth");
const roomRoute = require("./src/routes/room.route");
const expenseRoute = require("./src/routes/expense.route");
const transactionRoute = require("./src/routes/transaction.route");
const PORT = process.env.PORT || 3030;
const helmet = require('helmet')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authentication } = require('./src/middleware/auth.middleware');
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(helmet());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.status(200).send({
        status: true,
        message: "Welcome to expense tracker app"
    })
})
app.use("/api/v1/users", authRoute);
app.use(authentication)
app.use("/api/v1/rooms", roomRoute);
app.use("/api/v1/expenses", expenseRoute);
app.use("/api/v1/transactions", transactionRoute);

app.listen(PORT, () => console.log('Application is running on PORT :', PORT));
