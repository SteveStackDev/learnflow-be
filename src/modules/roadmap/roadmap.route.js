import express from "express";
import { getAllRoadmaps } from "#modules/roadmap/roadmap.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllRoadmaps);

export default router;
