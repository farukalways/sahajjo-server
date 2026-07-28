const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const invalidRouteHandler = require("./error/invalid_route_handler");
const globalErrorHandler = require("./error/global_error_handler");
const routes = require("./route/index");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("Hello, Express! Api is Good!");
});

app.use("/api/v1", routes);

app.use(invalidRouteHandler);
app.use(globalErrorHandler);

module.exports = app;
