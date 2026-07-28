const { loginUser } = require("../controller/auth/loginUser");
const { refreshAccessToken } = require("../controller/auth/refreshAccessToken");
const { registerUser } = require("../controller/auth/registerUser");

const authRouter = require("express").Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshAccessToken);

module.exports = authRouter;
