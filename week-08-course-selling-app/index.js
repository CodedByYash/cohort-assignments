const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
// const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to send cookies

const { userRouter } = require("./router/user");
const { courseRouter } = require("./router/course");
const { adminRouter } = require("./router/admin");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(3000);
  console.log("listening on port 3000");
}

main();
