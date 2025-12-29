import express from 'express';
import upload from '../middleware/upload.js';
import { createCourse, getCoursesByUserId, getCourseWithUserId } from '../controllers/courseController.js';

const router = express.Router();

router.post("/add-course", upload.single('uplodedImage'), createCourse);
router.get("/:userId", getCoursesByUserId);
router.get("/details/:id", getCourseWithUserId);
export default router;