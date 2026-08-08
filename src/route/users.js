const { getUser } = require("../controller/user");

const usersRouter = require("express").Router();

usersRouter.get("/:id", getUser);

module.exports = usersRouter;
