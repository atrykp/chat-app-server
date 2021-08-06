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

const userSocket = require("./controllers/userControllers");
const messageSocket = require("./controllers/messageControllers");

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

const onConnection = (socket) => {
  io.emit("hello", "user connected");
  userSocket.onlineUsers(io, socket);
  userSocket.userDisconnect(io, socket);
  messageSocket.handleSendMessage(io, socket);
};

io.on("connection", onConnection);

server.listen(process.env.LOCALHOST, () => console.log("app listen"));
