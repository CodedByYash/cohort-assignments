const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { z } = require("zod");
const { PurchaseModel, CourseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;

  const Schema = z.object({
    courseId: z.string().min(3).max(100),
  });

  const parsedbody = Schema.safeParse(req.body);
  if (!parsedbody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedbody.error.errors,
    });
  }
  const { courseId } = parsedbody.data;
  try {
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingPurchase = await PurchaseModel.findOne({ courseId, userId });

    if (existingPurchase) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    const purchase = await PurchaseModel.create({ courseId, userId });

    res.status(201).json({ message: "course purchased successful" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

courseRouter.post("/preview", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json({ courses });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  courseRouter: courseRouter,
};
