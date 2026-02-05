import express from 'express';
import upload from '../middleware/upload.js';
import { createFeed, deleteFeed, getFeedByRaId } from "../controllers/feed.controller.js";

const router = express.Router();

router.post(
  "/create",
  upload.array("documents", 10), 
  createFeed
);
router.get("/:id", getFeedByRaId);

router.get("/all-feed", getFeedByRaId);


router.delete("/:id", deleteFeed);

// router.put(
//   "/:id",
//   upload.array("documents", 10), 
//   updateFeed
// );

export default router;
