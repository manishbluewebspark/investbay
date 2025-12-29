import express from 'express';
import  upload  from '../middleware/upload.js';
import { addVideo, getVideosByCourseWithUserId } from '../controllers/videoController.js';

const router = express.Router();

router.post('/add-videos', upload.single('videoFile'), addVideo);
router.get('/videos/course/:courseId/:userId', getVideosByCourseWithUserId);
export default router;