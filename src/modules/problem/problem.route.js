import express from "express";
import {
  getAllProblems,
  getUserProblems,
  getProblem,
  saveProblem,
  createProblem,
  updateProblem,
  deleteProblem,
} from "#modules/problem/problem.controller.js";

const router = express.Router();

// GET - Static routes lên TRƯỚC
router.get("/all", getAllProblems);
router.get("/user", getUserProblems);

// POST - Tạo bài tập mới & Lưu bài làm
router.post("/", createProblem);
router.post("/save", saveProblem);

// Dynamic routes
router.get("/:id", getProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

export default router;