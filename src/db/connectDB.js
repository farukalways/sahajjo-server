const { connect } = require("mongoose");

const connectDB = async (url) => {
  console.log("database connect successfully");
  return await connect(url);
};

module.exports = connectDB;
