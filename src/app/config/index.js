require("dotenv").config();
const mongoose = require("mongoose");

const databaseUrl = process.env.MONGO_URI || "mongodb://localhost:27017/dvdshop";

async function connect() {
  try {
    await mongoose.connect(databaseUrl);
    console.log(
      "✅ MongoDB connected:",
      databaseUrl.replace(/\/\/.*@/, "//***@"),
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { connect };
