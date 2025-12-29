import { Video } from "../models/Video.js";

// ========================================= add video =========================================
export const addVideo = async (req, res) => {
    try {
        const { courseId, userId, videoTitle, videoDuration } = req.body;
        const videoFile = req.file; // File from multer middleware
        
        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        // File path will be automatically /uploads/filename.ext from multer config
        const videoUrl = `${videoFile.filename}`;

        const newVideo = await Video.create({
            courseId,
            userId,
            videoTitle,
            videoDuration,
            videoUrl, // This will be /uploads/video123.mp4
        });

        res.status(201).json({
            success: true,
            video: newVideo
        });
    } catch (error) {
        console.error('Add video error:', error);
        res.status(500).json({ error: 'Failed to add video' });
    }   
};


// ========================================= get videos by course with userId =========================================
export const getVideosByCourseWithUserId = async (req, res) => {
    try {
        const { courseId, userId } = req.params;
        const videos = await Video.findAll({
            where: { courseId, userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: videos
        });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};