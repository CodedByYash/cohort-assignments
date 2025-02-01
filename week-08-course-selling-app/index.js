const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require('dotenv').config();
const cors = require("cors");

const { userRouter } = require("./router/user");
const { courseRouter } = require("./router/course");
const { adminRouter } = require("./router/admin");

const app = express()
app.use(express.json());

app.use("api/v1/user",userRouter);
app.use("api/v1/course",courseRouter);
app.use("api/v1/admin",adminRouter);
