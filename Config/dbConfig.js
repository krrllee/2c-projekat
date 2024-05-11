if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
async function DbConnect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to database.");
  } catch (err) {
    console.log(err);
  }
}

module.exports = DbConnect;
