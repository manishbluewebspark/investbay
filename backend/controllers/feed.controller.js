import { pool } from "../db.js";

import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';


// =================================== create feed ==========================
// export const createFeed = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const { ra_id, ra_name, feed_text, feed_tags = [] } = req.body;

//     if (!ra_id || !ra_name) {
//       return res.status(400).json({
//         success: false,
//         message: "ra_id and ra_name are required",
//       });
//     }

//     const tagsArray = Array.isArray(feed_tags) ? feed_tags : [feed_tags];

//     const feed_documents = req.files && req.files.length > 0
//       ? JSON.stringify(
//           req.files.map(file => ({
//             filename: file.originalname,
//             path: file.path,
//             mimetype: file.mimetype,
//             size: file.size,
//           }))
//         )
//       : JSON.stringify([]);

//     const insertQuery = `
//       INSERT INTO feeds (
//         ra_id,
//         ra_name,
//         feed_text,
//         feed_tags,
//         feed_documents
//       )
//       VALUES ($1, $2, $3, $4, $5::jsonb)
//       RETURNING *;
//     `;

//     const values = [
//       ra_id,
//       ra_name,
//       feed_text || null,
//       tagsArray,   
//       feed_documents, 
//     ];

//     const { rows } = await client.query(insertQuery, values);

//     return res.status(201).json({
//       success: true,
//       message: "Feed created successfully",
//       data: rows[0],
//     });

//   } catch (error) {
//     console.error("Create Feed Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   } finally {
//     client.release();
//   }
// };


export const createFeed = async (req, res) => {
  const client = await pool.connect();
  
  let uploadedFiles = [];
  let s3Keys = [];

  try {
    const { ra_id, ra_name, feed_text, feed_tags = [] } = req.body;

    if (!ra_id || !ra_name) {
      return res.status(400).json({
        success: false,
        message: "ra_id and ra_name are required",
      });
    }

    const tagsArray = Array.isArray(feed_tags) ? feed_tags : [feed_tags];

    // Upload files to S3 if present
    if (req.files && req.files.length > 0) {
      try {
        // Upload each file to S3
        for (const file of req.files) {
          const s3Result = await uploadToS3(file, 'feeds');
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
        
        var feed_documents = JSON.stringify(uploadedFiles);
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
      var feed_documents = JSON.stringify([]);
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO feeds (
        ra_id,
        ra_name,
        feed_text,
        feed_tags,
        feed_documents
      )
      VALUES ($1, $2, $3, $4, $5::jsonb)
      RETURNING *;
    `;

    const values = [
      ra_id,
      ra_name,
      feed_text || null,
      tagsArray,   
      feed_documents, 
    ];

    const { rows } = await client.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: "Feed created successfully",
      data: rows[0],
    });

  } catch (error) {
    console.error("Create Feed Error:", error);
    
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





// ================================ getFeedByRaId ====================================
export const getFeedByRaId = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM feeds ORDER BY created_at DESC`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feeds found for this RA ID",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error("Get Feed By RA ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =============================== deleteFeed ====================================
// export const deleteFeed = async (req, res) => {
//   const { id } = req.params;
//   const { ra_id } = req.body;

//   if (!id || !ra_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Feed ID and ra_id are required",
//     });
//   }

//   try {
//     const result = await pool.query(
//       `DELETE FROM feeds 
//        WHERE id = $1 AND ra_id = $2 
//        RETURNING *`,
//       [id, ra_id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Feed not found or unauthorized",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Feed deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete feed error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while deleting feed",
//     });
//   }
// };

const deleteFeedDocuments = async (documents) => {
  if (!documents || documents.length === 0) return;
  
  for (const doc of documents) {
    if (doc.key) {
      try {
        await deleteFromS3(doc.key);
      } catch (error) {
        console.error(`Error deleting ${doc.key} from S3:`, error);
      }
    }
  }
};

export const deleteFeed = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    // First get the feed to extract document keys
    const getQuery = `SELECT feed_documents FROM feeds WHERE id = $1`;
    const { rows } = await client.query(getQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feed not found",
      });
    }
    
    // Delete files from S3
    const documents = rows[0].feed_documents;
    if (documents && Array.isArray(documents)) {
      await deleteFeedDocuments(documents);
    }
    
    // Delete from database
    const deleteQuery = `DELETE FROM feeds WHERE id = $1 RETURNING *`;
    const deleted = await client.query(deleteQuery, [id]);
    
    return res.status(200).json({
      success: true,
      message: "Feed deleted successfully",
      data: deleted.rows[0],
    });
    
  } catch (error) {
    console.error("Delete Feed Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  } finally {
    client.release();
  }
};
