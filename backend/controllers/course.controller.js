import { pool } from '../db.js';
import { deleteFromS3, uploadToS3 } from '../utils/s3Upload.js';

// ================================================= create a new course =================================================
export const createCourse = async (req, res) => {
  let imageKey = null;
  let imageUrl = null;

  try {
    const {
      userId,
      title,
      category,
      level,
      language,
      validity,
      price,
      discount,
      description
    } = req.body;

    if (!userId || !title || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Upload image to S3 - coursesimages folder
    if (req.file) {
      const s3Result = await uploadToS3(
        req.file,
        'coursesimages',
        req.file.mimetype
      );
      imageUrl = s3Result.url;
      imageKey = s3Result.key;
    }

    // Insert course using raw SQL
    const query = `
      INSERT INTO courses (
        user_id, 
        course_title, 
        trading_category, 
        course_level, 
        course_language, 
        access_validity, 
        course_price, 
        discount, 
        description, 
        uploded_image, 
        image_key,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [
      userId,
      title,
      category,
      level,
      language,
      validity,
      Number(price),
      discount ? Number(discount) : 0,
      description,
      imageUrl,
      imageKey
    ];

    const result = await pool.query(query, values);
    const newCourse = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.error("Create Course Error:", error);

    // Clean up from S3 if course creation fails
    if (imageKey) {
      await deleteFromS3(imageKey);
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= get courses by userId =================================================
export const getCoursesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT * FROM courses 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get Courses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= get course by courseId with userId =================================================
export const getCourseWithUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    let query;
    let params;

    if (userId) {
      query = `
        SELECT * FROM courses 
        WHERE id = $1 AND user_id = $2
      `;
      params = [id, userId];
    } else {
      query = `
        SELECT * FROM courses 
        WHERE id = $1
      `;
      params = [id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Get Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= update course =================================================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const imageFile = req.file;

    // First, get the existing course
    const getQuery = `SELECT * FROM courses WHERE id = $1`;
    const getResult = await pool.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const course = getResult.rows[0];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Handle new image upload
    if (imageFile) {
      // Delete old image from S3
      if (course.image_key) {
        await deleteFromS3(course.image_key);
      }

      // Upload new image to S3
      const s3Result = await uploadToS3(
        imageFile,
        'coursesimages',
        imageFile.mimetype
      );

      updateFields.push(`uploded_image = $${paramCount}`);
      values.push(s3Result.url);
      paramCount++;

      updateFields.push(`image_key = $${paramCount}`);
      values.push(s3Result.key);
      paramCount++;
    }

    // Update other fields
    if (updates.title) {
      updateFields.push(`course_title = $${paramCount}`);
      values.push(updates.title);
      paramCount++;
    }
    if (updates.category) {
      updateFields.push(`trading_category = $${paramCount}`);
      values.push(updates.category);
      paramCount++;
    }
    if (updates.level) {
      updateFields.push(`course_level = $${paramCount}`);
      values.push(updates.level);
      paramCount++;
    }
    if (updates.language) {
      updateFields.push(`course_language = $${paramCount}`);
      values.push(updates.language);
      paramCount++;
    }
    if (updates.validity) {
      updateFields.push(`access_validity = $${paramCount}`);
      values.push(updates.validity);
      paramCount++;
    }
    if (updates.price) {
      updateFields.push(`course_price = $${paramCount}`);
      values.push(Number(updates.price));
      paramCount++;
    }
    if (updates.discount !== undefined) {
      updateFields.push(`discount = $${paramCount}`);
      values.push(Number(updates.discount));
      paramCount++;
    }
    if (updates.description) {
      updateFields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 1) { // Only updated_at field
      return res.status(200).json({
        success: true,
        message: "No fields to update",
        data: course
      });
    }

    // Add id to values array for WHERE clause
    values.push(id);

    const updateQuery = `
      UPDATE courses 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, values);
    const updatedCourse = updateResult.rows[0];

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// ================================================= delete course =================================================
// export const deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // First, get the course to check if it exists and get the image key
//     const getQuery = `SELECT * FROM courses WHERE id = $1`;
//     const getResult = await pool.query(getQuery, [id]);

//     if (getResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found"
//       });
//     }

//     const course = getResult.rows[0];

//     // Delete image from S3
//     if (course.image_key) {
//       await deleteFromS3(course.image_key);
//     }

//     // Delete course from database
//     const deleteQuery = `DELETE FROM courses WHERE id = $1`;
//     await pool.query(deleteQuery, [id]);

//     return res.status(200).json({
//       success: true,
//       message: "Course deleted successfully"
//     });

//   } catch (error) {
//     console.error("Delete Course Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };


export const deleteCourse = async (req, res) => {
  const client = await pool.connect(); // Use single client for transaction

  try {
    await client.query('BEGIN'); // Start transaction

    const { id } = req.params;

    // 1. Get course details
    const getQuery = `SELECT * FROM courses WHERE id = $1 FOR UPDATE`;
    const getResult = await client.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const course = getResult.rows[0];

    // 2. Get ALL related videos
    const videosQuery = `SELECT video_key FROM videos WHERE course_id = $1`;
    const videosResult = await client.query(videosQuery, [id]);
    const videos = videosResult.rows;

    // 3. Delete course image from S3
    if (course.image_key) {
      await deleteFromS3(course.image_key);
    }

    // 4. Delete ALL video files from S3
    let deletedVideoCount = 0;
    for (const video of videos) {
      if (video.video_key) {
        await deleteFromS3(video.video_key);
        deletedVideoCount++;
      }
    }

    // 5. Delete ALL videos from database
    const deleteVideosQuery = `DELETE FROM videos WHERE course_id = $1`;
    await client.query(deleteVideosQuery, [id]);

    // 6. Delete course from database
    const deleteCourseQuery = `DELETE FROM courses WHERE id = $1`;
    await client.query(deleteCourseQuery, [id]);

    await client.query('COMMIT'); // Commit transaction

    return res.status(200).json({
      success: true,
      message: `Course deleted successfully along with ${deletedVideoCount} related video(s)`
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error("Delete Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message
    });
  } finally {
    client.release(); // Always release client
  }
};



// ========================================= get all courses ================================
export const getAllCourses = async (req, res) => {
  try {
    const query = `SELECT * FROM courses ORDER BY created_at DESC`;
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================================== get courses by id ============================================
export const getCoursesById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get course
    const courseQuery = `SELECT * FROM courses WHERE id = $1`;
    const courseResult = await pool.query(courseQuery, [id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const course = courseResult.rows[0];

    // Get analyst/research_analyst
    const analystQuery = `SELECT * FROM research_analysts WHERE id = $1`;
    const analystResult = await pool.query(analystQuery, [course.user_id]);

    const analyst = analystResult.rows[0] || null;

    return res.status(200).json({
      success: true,
      data: {
        course,
        analyst
      }
    });
  } catch (error) {
    console.error("Get course by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};