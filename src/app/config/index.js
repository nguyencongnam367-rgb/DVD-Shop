<<<<<<< HEAD
require("dotenv").config();
const mongoose = require("mongoose");

const databaseUrl = process.env.MONGO_URI || "mongodb://localhost:27017/dvdshop";
=======
const mongoose = require("mongoose");

const databaseUrl = "mongodb://localhost:27017/dvdshop";
>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2

async function connect() {
  try {
    await mongoose.connect(databaseUrl);
<<<<<<< HEAD
    console.log(
      "✅ MongoDB connected:",
      databaseUrl.replace(/\/\/.*@/, "//***@"),
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

=======
    console.log("MongoDB connected to dvdshop");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

connect();

>>>>>>> 0e993ed6e1c16f1a044db3b8c4804bc665de8ed2
module.exports = { connect };
