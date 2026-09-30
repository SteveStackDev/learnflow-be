import express from "express";
import {
  getAllRoadmaps,
  getRoadmap,
  getUserRoadmaps
} from "#modules/roadmap/roadmap.controller.js";

const router = express.Router();

// Static routes đặt TRƯỚC
router.get("/all", getAllRoadmaps);
router.get("/user", getUserRoadmaps);

// Dynamic route đặt SAU
router.get("/:slug", getRoadmap);

export default router;