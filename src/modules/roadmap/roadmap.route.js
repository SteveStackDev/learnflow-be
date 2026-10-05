import express from "express";
import {
  getAllRoadmaps,
  getRoadmap,
  getUserRoadmaps,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from "#modules/roadmap/roadmap.controller.js";

const router = express.Router();

// Static routes đặt TRƯỚC
router.get("/all", getAllRoadmaps);
router.get("/user", getUserRoadmaps);
router.post("/", createRoadmap);

// Dynamic routes đặt SAU
router.get("/:slug", getRoadmap);
router.put("/:id", updateRoadmap);
router.delete("/:id", deleteRoadmap);

export default router;