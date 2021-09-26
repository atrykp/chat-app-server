const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const socketioJwt = require("socketio-jwt");

const user = require("./routes/userRoutes");
const conversation = require("./routes/conversationRoutes");
const message = require("./routes/messageRoutes");
const connectDb = require("./mongoose");
const errorMiddleware = require("./middlewares/errorMiddleware");

const userSocket = require("./controllers/userControllers");
const messageSocket = require("./controllers/messageControllers");
const PORT = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: `${
      process.env.FRONTEND ? process.env.FRONTEND : "http://localhost:3000"
    }`,
  },
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

const corsOptions = {
  origin: [
    `${process.env.FRONTEND ? process.env.FRONTEND : "http://localhost:3000"}`,
  ],
};
app.use(cors(corsOptions));

//routes

app.use("/user", user);
app.use("/conversations", conversation);
app.use("/message", message);
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

connectDb();

const onConnection = (socket) => {
  io.emit("hello", "user connected");
  userSocket.onlineUsers(io, socket);
  userSocket.userDisconnect(io, socket);
  messageSocket.handleSendMessage(io, socket);
  messageSocket.unreadMessages(io, socket);
  messageSocket.setIsRead(io, socket);
  messageSocket.isUserTyping(io, socket);
};

io.use(
  socketioJwt.authorize({
    secret: process.env.JWT_PASS,
    handshake: true,
  })
);

io.on("connection", onConnection);

server.listen(PORT, () => console.log("app listen"));
