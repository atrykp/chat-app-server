const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const upload = multer();

const user = require("./routes/userRoutes");
const conversation = require("./routes/conversationRoutes");
const message = require("./routes/messageRoutes");
const connectDb = require("./mongoose");
const errorMiddleware = require("./middlewares/errorMiddleware");
const userOnline = require("./assets/helpers/usersOnlineFunctions");

const app = express();
require("dotenv").config();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

const corsOptions = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));
//routes
app.use("/user", user);
app.use("/conversations", conversation);
app.use("/message", message);
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

connectDb();

let usersOnline = [];

io.on("connection", (socket) => {
  io.emit("hello", "user connected");
  socket.on("userId", (userId) => {
    usersOnline = userOnline.addUser(userId, socket.id, usersOnline);
  });
  io.emit("usersOnline", usersOnline);
  socket.on("sendMessage", (message) => {
    const receiverSocket = usersOnline.find(
      (element) => element.userId === message.receiverId
    );
    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("getMessage", message);
    } else {
      console.log("user offline");
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    usersOnline = userOnline.removeUser(socket.id, usersOnline);
  });
});

server.listen(process.env.LOCALHOST, () => console.log("app listen"));
