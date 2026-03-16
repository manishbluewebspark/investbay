// controllers/news.controller.js
import { pool } from "../db.js";
import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';





export const createNews = async (req, res) => {
  const client = await pool.connect();
  
  let uploadedFiles = [];
  let s3Keys = [];

  try {
    const {
      title,
      category,
      status,
      scheduledDate,
      shortDescription,
      fullArticle,
      authorId,
      authorName,
      tags = []
    } = req.body;

    // Validation
    if (!title || !category || !authorId || !authorName) {
      return res.status(400).json({
        success: false,
        message: "title, category, authorId, and authorName are required",
      });
    }

    // Parse tags if they come as string
    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        console.error("Tags parsing error:", e);
        tagsArray = [];
      }
    }

    // Upload files to S3 if present
    if (req.files && req.files.length > 0) {
      try {
        // Upload each file to S3
        for (const file of req.files) {
          const s3Result = await uploadToS3(file, 'news');
          uploadedFiles.push({
            originalName: file.originalname,
            url: s3Result.url,
            key: s3Result.key,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });
          s3Keys.push(s3Result.key);
        }
        
        var news_images = JSON.stringify(uploadedFiles);
      } catch (uploadError) {
        console.error("S3 Upload Error:", uploadError);
        
        // Cleanup uploaded files on error
        for (const key of s3Keys) {
          try {
            await deleteFromS3(key);
          } catch (deleteError) {
            console.error("Cleanup error for key:", key, deleteError);
          }
        }
        
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message
        });
      }
    } else {
      var news_images = JSON.stringify([]);
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO news (
        title,
        category,
        status,
        scheduled_date,
        short_description,
        full_article,
        images,
        author_id,
        author_name,
        tags,
        views,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10::jsonb, $11, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      title,
      category,
      status || 'draft',
      scheduledDate || null,
      shortDescription || null,
      fullArticle || null,
      news_images,
      authorId,
      authorName,
      JSON.stringify(tagsArray),
      0 // initial views
    ];

    const { rows } = await client.query(insertQuery, values);

    // FIX: Don't parse if already parsed
    const news = {
      ...rows[0],
      // These fields are already parsed by PostgreSQL when using JSONB
      // So we just use them as-is
      images: rows[0].images || [],
      tags: rows[0].tags || []
    };

    return res.status(201).json({
      success: true,
      message: "News created successfully",
      news: news,
    });

  } catch (error) {
    console.error("Create News Error Details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint
    });
    
    // Cleanup: If any error occurs after upload, delete S3 files
    if (s3Keys.length > 0) {
      for (const key of s3Keys) {
        try {
          await deleteFromS3(key);
        } catch (cleanupError) {
          console.error("Cleanup error for key:", key, cleanupError);
        }
      }
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  } finally {
    client.release();
  }
};





export const getAllNews = async (req, res) => {
  try {
    const query = 'SELECT * FROM news ORDER BY created_at DESC';
    const result = await pool.query(query);
    
    // Don't parse JSON fields - they're already parsed
    const news = result.rows.map(item => ({
      ...item,
      images: item.images || [],
      tags: item.tags || []
    }));

    res.json({ 
      success: true, 
      news 
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM news WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'News not found' 
      });
    }

    const news = {
      ...result.rows[0],
      images: result.rows[0].images || [],
      tags: result.rows[0].tags || []
    };

    res.json({ 
      success: true, 
      news 
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};



// controllers/news.controller.js - Fixed updateNews function

export const updateNews = async (req, res) => {
  const client = await pool.connect();
  
  let uploadedFiles = [];
  let s3Keys = [];

  try {
    const { id } = req.params;
    const {
      title,
      category,
      status,
      scheduledDate,
      shortDescription,
      fullArticle,
      tags,
      existingImages // This comes from request body
    } = req.body;

    // First, get existing news to manage S3 files
    const getExistingQuery = 'SELECT images FROM news WHERE id = $1';
    const existingResult = await client.query(getExistingQuery, [id]);
    
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'News not found' 
      });
    }

    // Parse existing images from database
    const dbExistingImages = JSON.parse(existingResult.rows[0].images || '[]');
    
    // Parse images to keep from request (if any)
    const imagesToKeep = existingImages ? JSON.parse(existingImages) : [];

    // Upload new files to S3 if present
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const s3Result = await uploadToS3(file, 'news');
          uploadedFiles.push({
            originalName: file.originalname,
            url: s3Result.url,
            key: s3Result.key,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });
          s3Keys.push(s3Result.key);
        }
      } catch (uploadError) {
        console.error("S3 Upload Error:", uploadError);
        
        // Cleanup newly uploaded files on error
        for (const key of s3Keys) {
          try {
            await deleteFromS3(key);
          } catch (deleteError) {
            console.error("Cleanup error for key:", key, deleteError);
          }
        }
        
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message
        });
      }
    }

    // Combine images to keep with new uploads
    const allImages = [...imagesToKeep, ...uploadedFiles];
    const news_images = JSON.stringify(allImages);

    // Parse tags
    const tagsArray = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : null;

    // Update in database
    const updateQuery = `
      UPDATE news 
      SET 
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        status = COALESCE($3, status),
        scheduled_date = COALESCE($4, scheduled_date),
        short_description = COALESCE($5, short_description),
        full_article = COALESCE($6, full_article),
        images = COALESCE($7::jsonb, images),
        tags = COALESCE($8, tags),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      title || null,
      category || null,
      status || null,
      scheduledDate || null,
      shortDescription || null,
      fullArticle || null,
      news_images,
      tagsArray ? JSON.stringify(tagsArray) : null,
      id
    ];

    const { rows } = await client.query(updateQuery, values);

    // Delete old S3 files that are no longer needed
    // Compare database existing images with images to keep
    const imagesToDelete = dbExistingImages.filter(
      dbImg => !imagesToKeep.some(keepImg => keepImg.key === dbImg.key)
    );
    
    for (const oldImg of imagesToDelete) {
      try {
        await deleteFromS3(oldImg.key);
      } catch (deleteError) {
        console.error("Error deleting old S3 file:", oldImg.key, deleteError);
      }
    }

    // Parse JSON fields for response
    const news = {
      ...rows[0],
      images: JSON.parse(rows[0].images || '[]'),
      tags: JSON.parse(rows[0].tags || '[]')
    };

    res.json({ 
      success: true, 
      message: 'News updated successfully',
      news 
    });

  } catch (err) {
    console.error('Error updating news:', err);
    
    // Cleanup newly uploaded files on error
    if (s3Keys.length > 0) {
      for (const key of s3Keys) {
        try {
          await deleteFromS3(key);
        } catch (cleanupError) {
          console.error("Cleanup error for key:", key, cleanupError);
        }
      }
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  } finally {
    client.release();
  }
};

export const deleteNews = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    // First get the news to get S3 file keys
    const getQuery = 'SELECT images FROM news WHERE id = $1';
    const getResult = await client.query(getQuery, [id]);
    
    if (getResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'News not found' 
      });
    }

    const images = JSON.parse(getResult.rows[0].images || '[]');
    
    // Delete from database
    const deleteQuery = 'DELETE FROM news WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    
    // Delete files from S3
    for (const image of images) {
      try {
        await deleteFromS3(image.key);
      } catch (deleteError) {
        console.error("Error deleting S3 file:", image.key, deleteError);
      }
    }

    res.json({ 
      success: true, 
      message: 'News deleted successfully' 
    });

  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  } finally {
    client.release();
  }
};

export const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const query = 'SELECT * FROM news WHERE category = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [category]);
    
    const news = result.rows.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]'),
      tags: JSON.parse(item.tags || '[]')
    }));

    res.json({ 
      success: true, 
      news 
    });
  } catch (err) {
    console.error('Error fetching news by category:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getNewsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const query = 'SELECT * FROM news WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    
    const news = result.rows.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]'),
      tags: JSON.parse(item.tags || '[]')
    }));

    res.json({ 
      success: true, 
      news 
    });
  } catch (err) {
    console.error('Error fetching news by status:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getNewsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const query = 'SELECT * FROM news WHERE author_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [authorId]);
    
    const news = result.rows.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]'),
      tags: JSON.parse(item.tags || '[]')
    }));

    res.json({ 
      success: true, 
      news 
    });
  } catch (err) {
    console.error('Error fetching news by author:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const incrementNewsViews = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE news SET views = views + 1 WHERE id = $1 RETURNING views';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'News not found' 
      });
    }

    res.json({ 
      success: true, 
      views: result.rows[0].views 
    });
  } catch (err) {
    console.error('Error incrementing views:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getNewsStats = async (req, res) => {
  try {
    const stats = {};
    
    // Total news count
    const totalResult = await pool.query('SELECT COUNT(*) FROM news');
    stats.total = parseInt(totalResult.rows[0].count);
    
    // Count by status
    const statusResult = await pool.query(
      'SELECT status, COUNT(*) FROM news GROUP BY status'
    );
    stats.byStatus = statusResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});
    
    // Count by category
    const categoryResult = await pool.query(
      'SELECT category, COUNT(*) FROM news GROUP BY category'
    );
    stats.byCategory = categoryResult.rows.reduce((acc, row) => {
      acc[row.category] = parseInt(row.count);
      return acc;
    }, {});
    
    // Total views
    const viewsResult = await pool.query('SELECT SUM(views) as total_views FROM news');
    stats.totalViews = parseInt(viewsResult.rows[0].total_views || 0);
    
    res.json({ 
      success: true, 
      stats 
    });
  } catch (err) {
    console.error('Error fetching news stats:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};