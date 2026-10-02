import express from "express";
import {
  getAllCourses,
  getCourse,
  getCurriculum,
  getUserCourses,
  deleteCourse,
  createCourse,
} from "#modules/course/course.controller.js";

const router = express.Router();

// Static routes đặt lên TRƯỚC
router.get("/all", getAllCourses);
router.get("/user", getUserCourses);
router.post("/", createCourse);

// Dynamic routes đặt SAU
router.get("/curriculum/:courseId", getCurriculum);
router.get("/:id", getCourse);
router.delete("/:id", deleteCourse);

export default router;