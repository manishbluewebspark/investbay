import { pool } from "../db.js"; // You need to set up database connection pool
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

// ========================================= add video =========================================
export const addVideo = async (req, res) => {
    let s3Result;
    try {
        const { courseId, userId, videoTitle, videoDuration } = req.body;
        const videoFile = req.file;
        
        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        // Upload to S3 - coursesvideos folder
        s3Result = await uploadToS3(
            videoFile, 
            'coursesvideos', 
            videoFile.mimetype
        );

        // Raw SQL query to insert video
        const query = `
            INSERT INTO videos (
                course_id, user_id, video_title, video_duration, 
                video_url, video_key, video_size, mime_type, status, 
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;

        const values = [
            courseId,
            userId,
            videoTitle,
            videoDuration,
            s3Result.url,
            s3Result.key,
            s3Result.size,
            s3Result.mimeType || videoFile.mimetype,
            'active'
        ];

        const result = await pool.query(query, values);
        const newVideo = result.rows[0];

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
        
        // Raw SQL query to fetch videos
        const query = `
            SELECT * FROM videos 
            WHERE course_id = $1 AND user_id = $2 
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [courseId, userId]);
        
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};


export const getVideosByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Raw SQL query to fetch videos
        const query = `
            SELECT * FROM videos 
            WHERE course_id = $1 
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [courseId]);
        
        res.status(200).json({
            success: true,
            data: result.rows
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

        // First check if video exists and get the video key
        const checkQuery = `
            SELECT * FROM videos 
            WHERE id = $1 AND course_id = $2 AND user_id = $3
        `;
        
        const checkResult = await pool.query(checkQuery, [id, courseId, userId]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Video not found or you are not authorized to delete this video"
            });
        }

        const video = checkResult.rows[0];

        // Delete from S3 if video key exists
        if (video.video_key) {
            await deleteFromS3(video.video_key);
        }

        // Delete from database
        const deleteQuery = `
            DELETE FROM videos 
            WHERE id = $1 AND course_id = $2 AND user_id = $3
        `;
        
        await pool.query(deleteQuery, [id, courseId, userId]);

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