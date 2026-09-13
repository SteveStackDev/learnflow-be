import express from "express";
import { getAllBadges } from "#modules/badge/badge.controller.js";

const router = express.Router();

// GET
router.get("/all", getAllBadges);

export default router;
