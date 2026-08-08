const router = require("express").Router();

const usersRouter = require("./users");
const casesRouter = require("./cases");
const donationsRouter = require("./donations");
const authRouter = require("./auth");

router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/cases", casesRouter);
router.use("/donations", donationsRouter);

module.exports = router;
