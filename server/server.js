const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const ticketRoutes = require("./routes/ticketRoutes");

const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected to Socket.io:", socket.id);

  socket.on("join_ticket", (ticketId) => {
    socket.join(`ticket:${ticketId}`);
    console.log(`User ${socket.id} joined room ticket :${ticketId}`);
  });

  socket.on("leave_ticket", (ticketId) => {
    socket.leave(`ticket:${ticketId}`);
    console.log(`User ${socket.id} left room ticket :${ticketId}`);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("SupportDesk Ai Server is running smoothly!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT}`);
});
