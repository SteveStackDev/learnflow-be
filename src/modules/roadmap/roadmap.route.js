import express from "express";
import {
  getAllRoadmaps,
  getRoadmap,
  getUserRoadmaps
} from "#modules/roadmap/roadmap.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllRoadmaps);
router.get("/:slug", getRoadmap);
router.get("/user", getUserRoadmaps);

export default router;
