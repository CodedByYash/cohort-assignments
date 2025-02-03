const { Router } = require("express");
const { UserModel, CourseModel, AdminModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminRouter = Router();
const saltround = 5;

adminRouter.post("/signup", async (req, res) => {
  const schema = z.object({
    email: z.string().min(3).max(20).email(),
    password: z.string().min(8).max(20),
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(20),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.json({
      message: "can not parsed body",
      error: parsedbody.error,
    });
  }
  const { email, password, firstname, lastname } = parsedbody.data;

  try {
    const founduser = await AdminModel.findOne({ email });

    if (founduser) {
      return res.status(403).json({ message: "user already exist" });
    }

    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await AdminModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    res.json({ message: "signup successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "can not able to create account" });
  }
});

adminRouter.post("/signin", (req, res) => {});

adminRouter.post("/course", (req, res) => {});

adminRouter.put("/course", (req, res) => {});

adminRouter.get("/course/bulk", (req, res) => {});

module.exports = {
  adminRouter: adminRouter,
};
