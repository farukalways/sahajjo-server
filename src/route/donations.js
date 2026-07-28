const { makeDonation } = require("../controller/donation");

const donationsRouter = require("express").Router();

donationsRouter.post("/", makeDonation);

module.exports = donationsRouter;
