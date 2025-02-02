const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = Router();
const saltround = 5;

userRouter.post("/signup", async (req, res) => {
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
    const founduser = await UserModel.findOne({ email });

    if (founduser) {
      return res.status(403).json({ message: "user already exist" });
    }

    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await UserModel.create({
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

userRouter.post("/signin", async (req, res) => {
  const schema = z.object({
    email: z.string().min(3).max(20).email(),
    password: z.string().min(8).max(20),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.json({
      message: "can not parsed body",
      error: parsedbody.error,
    });
  }
  const { email, password } = parsedbody;

  try {
    const founduser = await UserModel.findOne({ email });

    if (!founduser) {
      return res
        .status(403)
        .json({ message: "user does not exist, Please check credentials" });
    }

    if (bcrypt.compareSync(password, founduser.password)) {
      const token = jwt.sign({ email }, process.env.USER_JWT_SECRET);
      return res.json({ token: token });
    } else {
      return res.status(403).json({ message: "Invalid password" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "can not able to create account" });
  }
});

userRouter.get("/purchases", async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await CourseModel.find({ userId });
    if (!purchases) {
      return res.json({ message: "no course is purchased" });
    } else {
      return res.json({ purchases });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "not able to find courses" });
  }
});
module.exports = {
  userRouter: userRouter,
};
