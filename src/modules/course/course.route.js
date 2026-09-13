import express from "express";
import {
  getAllCourses,
  getCourse,
  getCurriculum,
} from "#modules/course/course.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllCourses);
router.get("/:id", getCourse);
router.get("/curriculum/:courseId", getCurriculum);

export default router;
