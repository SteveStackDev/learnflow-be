import express from "express";
import {
  getAllProblems,
  getUserProblems,
  getProblem,
  saveProblem,
} from "#modules/problem/problem.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllProblems);
router.get("/user/all", getUserProblems);
router.get("/:id", getProblem);

// POST
router.post("/save", saveProblem);

export default router;
