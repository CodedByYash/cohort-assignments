const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();
const saltround = 5;

userRouter.post("/signup", async (req, res) => {
  const schema = z.object({
    email: z.string().min(3).max(50).email(),
    password: z.string().min(8).max(20),
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(20),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedbody.error,
    });
  }
  const { email, password, firstname, lastname } = parsedbody.data;

  try {
    const founduser = await UserModel.findOne({ email });

    if (founduser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await UserModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    res.status(201).json({ message: "signup successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const schema = z.object({
    email: z.string().min(3).max(50).email(),
    password: z.string().min(8).max(20),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedbody.error,
    });
  }
  const { email, password } = parsedbody.data;

  try {
    const founduser = await UserModel.findOne({ email });

    if (!founduser || !bcrypt.compareSync(password, founduser.password)) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: founduser._id, role: "user" },
      process.env.USER_JWT_SECRET,
      { expiresIn: "2d" }
    );
    return res.status(200).json({ token: token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await CourseModel.find({ userId });

    if (!purchases.length == 0) {
      return res.status(200).json({ message: "No course is purchased" });
    }

    return res.status(200).json({ purchases });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Error occured while purchasing course" });
  }
});
module.exports = {
  userRouter: userRouter,
};
