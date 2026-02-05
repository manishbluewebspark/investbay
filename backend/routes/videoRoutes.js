import express from 'express';
import upload from '../middleware/upload.js';
import { 
    addVideo, 
    getVideosByCourseWithUserId, 
    deleteVideo 
} from '../controllers/video.controller.js';

const router = express.Router();

router.post('/add-videos', upload.single('videoFile'), addVideo);
router.get('/videos/course/:courseId/:userId', getVideosByCourseWithUserId);
router.delete('/:id', deleteVideo);

export default router;