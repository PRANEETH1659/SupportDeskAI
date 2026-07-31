const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const ticketRoutes = require("./routes/ticketRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("SupportDesk Ai Server is running smoothly!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT}`);
});
