const { loginUser } = require("../controller/auth/loginUser");
const { getUserData } = require("../controller/auth/loginUserData");
const { refreshAccessToken } = require("../controller/auth/refreshAccessToken");
const { registerUser } = require("../controller/auth/registerUser");

const authRouter = require("express").Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", getUserData);
authRouter.post("/refresh-token", refreshAccessToken);

module.exports = authRouter;
