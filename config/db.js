const mongoose = require("mongoose");
require("dotenv").config();
const { MONGODB_URL } = process.env;

exports.connectDb = () => {
  if (!MONGODB_URL) {
    console.error("Error: MONGODB_URL is not defined in .env file");
    process.exit(1);
  }

  mongoose.connect(MONGODB_URL)
    .then(() => console.log("Database Connected Successfully"))
    .catch((error) => {
      console.error(`Error Connecting to Database: ${error.message}`);
      process.exit(1);
    });
};
