const express = require("express");
const http = require("http");
const cors = require("cors");

const user = require("./routes/userRoutes");
const connectDb = require("./mongoose");
const errorMiddleware = require("./middlewares/errorMiddleware");

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
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

connectDb();

server.listen(process.env.LOCALHOST, () => console.log("app listen"));
