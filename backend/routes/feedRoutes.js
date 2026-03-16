import express from 'express';
import upload from '../middleware/upload.js';
import { createFeed, deleteFeed, feedLogController, getFeedAll, getFeedById, getFeedByRaId, updateFeed } from "../controllers/feed.controller.js";

const router = express.Router();

router.post(
  "/create",
  upload.array("documents", 10), 
  createFeed
);
router.get("/all-feed", getFeedAll);


router.get("/:id", getFeedByRaId);

router.delete("/:id", deleteFeed);

router.put("/:id", upload.array("documents", 10), updateFeed); 




router.post('/feeds/:feed_id/like', feedLogController.toggleLike);

// 📌 Comment routes
router.post('/feeds/:feed_id/comments', feedLogController.addComment);
router.put('/feeds/:feed_id/comments/:comment_id', feedLogController.editComment);
router.delete('/feeds/:feed_id/comments/:comment_id', feedLogController.deleteComment);

// 📌 Share routes
router.post('/feeds/:feed_id/share', feedLogController.shareFeed);

router.get('/feeds/:feed_id', getFeedById);

// 📌 Get logs for a specific feed
router.get('/feeds/:feed_id/logs', feedLogController.getFeedLogs);

// 📌 Get all feeds with logs (Modified endpoint for Signals)
router.get('/feeds/all-feed', feedLogController.getAllFeedsWithLogs);





export default router;
