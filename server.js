require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/connectDB");
const PORT = 5000;

connectDB("mongodb://localhost:27017/sahajjo")
  .then(
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    }),
  )
  .catch((e) => {
    console.log(e);
  });
