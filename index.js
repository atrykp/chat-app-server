const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
require("dotenv").config();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const userName = socket.handshake.auth.userId;
  if (!userName) {
    return next(new Error("invalid username"));
  }
  socket.userId = userName;
  next();
});

app.use(cors());
app.get("/", (req, res) => {
  res.send({ message: "hello" });
});
io.on("connection", (socket) => {
  console.log("user connected");
  const users = [];
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.userId,
  });
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.userID,
    });
  }
  socket.emit("users", users);
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.LOCALHOST, () => console.log("app listen"));
