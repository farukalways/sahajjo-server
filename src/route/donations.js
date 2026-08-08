const { makeDonation } = require("../controller/donation");
const { verifyAuth } = require("../middleware/verifyAuth");

const donationsRouter = require("express").Router();

donationsRouter.post("/", verifyAuth, makeDonation);

module.exports = donationsRouter;
