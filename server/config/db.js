const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/supportdesk",
      {
        serverSelectionTimeoutMS: 5000, // Stop waiting after 5 seconds if connection fails
      },
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't crash immediately so server can still start for testing
  }
};

module.exports = connectDB;
