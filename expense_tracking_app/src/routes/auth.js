const express = require('express');
const { registrationController, updateController, loginController, deleteController, resetPassword, getUser, logOutController, accessToken } = require('../controllers/user.controller');
const { registerValidation, authentication } = require("../middleware/auth.middleware");

const authRoute = express.Router();

authRoute.post("/auth/registration", registerValidation, registrationController);
authRoute.post("/auth/login", loginController);
authRoute.post("/auth/logout", authentication, logOutController);
authRoute.post("/auth/reset-password", authentication, resetPassword);
authRoute.put("/update", authentication, updateController);
authRoute.get("/", authentication, getUser);
authRoute.delete("/delete", authentication, deleteController);
authRoute.post("/getAccessToken", accessToken)

module.exports = authRoute;