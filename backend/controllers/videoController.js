import { Video } from "../models/Video.js";
import { uploadToS3,deleteFromS3 } from "../utils/s3Upload.js";
// ========================================= add video =========================================
export const addVideo = async (req, res) => {
    try {
        const { courseId, userId, videoTitle, videoDuration } = req.body;
        const videoFile = req.file;
        
        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        // Upload to S3 - coursesvideos folder
        const s3Result = await uploadToS3(
            videoFile, 
            'coursesvideos', 
            videoFile.mimetype
        );

        const newVideo = await Video.create({
            courseId,
            userId,
            videoTitle,
            videoDuration,
            videoUrl: s3Result.url,
            videoKey: s3Result.key,
            videoSize: s3Result.size,
            mimeType: s3Result.mimeType,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            video: newVideo
        });
    } catch (error) {
        console.error('Add video error:', error);
        
        // Clean up from S3 if video creation fails
        if (s3Result?.key) {
            await deleteFromS3(s3Result.key);
        }
        
        res.status(500).json({ 
            error: error.message || 'Failed to add video' 
        });
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

// ========================================= delete video =========================================

export const deleteVideo = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { courseId, userId } = req.body;

        if (!id || !courseId || !userId) {
            return res.status(400).json({
                success: false,
                message: "id, courseId and userId are required"
            });
        }

        const video = await Video.findOne({
            where: {
                id,      
                courseId,
                userId
            }
        });

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found or you are not authorized to delete this video"
            });
        }

        if (video.videoKey) {
            await deleteFromS3(video.videoKey);
        }

        await video.destroy();

        res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        });

    } catch (error) {
        console.error("Delete video error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete video"
        });
    }
};