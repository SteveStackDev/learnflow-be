import express from "express";
import {
  getAllProblems,
  getUserProblems,
  getProblem,
  saveProblem,
} from "#modules/problem/problem.controller.js";

const router = express.Router();

// GET - Static routes lên TRƯỚC
router.get("/all", getAllProblems);
router.get("/user", getUserProblems);

// GET - Dynamic route đặt SAU
router.get("/:id", getProblem);

// POST - Lưu bài làm
router.post("/save", saveProblem);

export default router;