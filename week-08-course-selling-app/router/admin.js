const { Router } = require("express");
const { CourseModel, AdminModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

const adminRouter = Router();
const saltround = 5;

adminRouter.post("/signup", async (req, res) => {
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
    const founduser = await AdminModel.findOne({ email });

    if (founduser) {
      return res.status(403).json({ message: "User already exist" });
    }

    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await AdminModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/signin", async (req, res) => {
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
    const founduser = await AdminModel.findOne({ email });

    if (!founduser || !bcrypt.compareSync(password, founduser.password)) {
      return res
        .status(401)
        .json({ message: "user does not exist, Please check credentials" });
    }

    const token = jwt.sign(
      { id: founduser._id, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "2d" }
    );
    // for token based authentication send token in response
    // return res.status(200).json({ token });

    // for cookie based authentication set cookie in response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 172800 * 1000,
    });

    res.status(200).json({ message: "Signin successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const schema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(8).max(300),
    price: z.number().positive(),
    imageUrl: z.string().min(3).max(300),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedbody.error,
    });
  }
  const { title, description, price, imageUrl } = parsedbody.data;

  try {
    await CourseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });
    res.status(201).json({ message: "Course created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error occurred while creating course" });
  }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const schema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(8).max(300),
    price: z.number().positive(),
    imageUrl: z.string().min(3).max(300),
    courseId: z.string().min(3).max(50),
  });
  const parsedbody = schema.safeParse(req.body);

  if (!parsedbody.success) {
    return res.status(400).json({
      message: "can not parsed body",
      error: parsedbody.error,
    });
  }
  const { title, description, price, imageUrl, courseId } = parsedbody.data;

  try {
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId,
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "course updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error occurred while updating course" });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  try {
    const courses = await CourseModel.find({ creatorId: adminId });

    res.status(200).json({ message: "Courses retrived successfully", courses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving courses" });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
