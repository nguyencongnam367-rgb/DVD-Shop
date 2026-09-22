const mongoose = require("mongoose");

const databaseUrl = "mongodb://127.0.0.1:27017/dvdshop";

async function connect() {
  try {
    await mongoose.connect(databaseUrl);
    console.log("MongoDB connected to dvdshop");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

connect();

module.exports = { connect };