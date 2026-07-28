const casesRouter = require("express").Router();
const { getSingleCase, getAllCase } = require("../controller/cases");

casesRouter.get("/:id", getSingleCase);
casesRouter.get("/", getAllCase);

module.exports = casesRouter;
