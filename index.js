const express = require("express");
const http = require("http");
const cors = require("cors");

const user = require("./routes/userRoutes");
const connectDb = require("./mongoose");

const app = express();
require("dotenv").config();
const server = http.createServer(app);

app.use(express.json({ limit: "1mb" }));
const corsOptions = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));
//routes
app.use("/user", user);
connectDb();

server.listen(process.env.LOCALHOST, () => console.log("app listen"));
