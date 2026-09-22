import express from "express";
import {
  getAllRoadmaps,
  getRoadmap,
} from "#modules/roadmap/roadmap.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllRoadmaps);
router.get("/:slug", getRoadmap);

export default router;
