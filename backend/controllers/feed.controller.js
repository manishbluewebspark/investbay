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



// export const getFeedAll= async (req, res) => {


//   try {
//     const { rows } = await pool.query(
//       `SELECT * FROM feeds ORDER BY created_at DESC`
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No feeds found for this RA ID",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: rows,
//     });

//   } catch (error) {
//     console.error("Get Feed By RA ID Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const getFeedAll = async (req, res) => {
  const client = await pool.connect();
  try {
    const user_id = req.user?.id;

    // 🔥 SIMPLE QUERY - Sirf do tables
    const query = `
      SELECT 
        f.*,
        COALESCE(fl.feed_likes, '[]'::jsonb) as feed_likes,
        COALESCE(fl.feed_comments, '[]'::jsonb) as feed_comments,
        COALESCE(fl.feed_shares, '[]'::jsonb) as feed_shares
      FROM feeds f
      LEFT JOIN feed_logs fl ON f.id = fl.feed_id
      ORDER BY f.created_at DESC
    `;

    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // 🔥 IMPORTANT: Process each feed with ACTUAL counts from arrays
    const feedsWithStats = await Promise.all(result.rows.map(async (feed) => {
      const likes = feed.feed_likes || [];
      const comments = feed.feed_comments || [];
      const shares = feed.feed_shares || [];

      // Fetch user_name for comments if not present
      const commentsWithUserNames = await Promise.all(comments.map(async (comment) => {
        if (!comment.user_name) {
          try {
            const userResult = await client.query(
              'SELECT name FROM users WHERE id = $1',
              [comment.user_id]
            );
            comment.user_name = userResult.rows[0]?.name || 'User';
          } catch (err) {
            comment.user_name = 'User';
          }
        }
        return comment;
      }));

      // Sort comments by date
      const sortedComments = commentsWithUserNames.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      // ✅ FIX: Use ACTUAL array lengths for counts, not DB stored values
      const actualLikeCount = likes.length;
      const actualCommentCount = comments.length;
      const actualShareCount = shares.length;

      return {
        id: feed.id,
        ra_id: feed.ra_id,
        ra_name: feed.ra_name,
        feed_text: feed.feed_text,
        feed_tags: feed.feed_tags || [],
        feed_documents: feed.feed_documents || [],
        
        // ✅ IMPORTANT: Send ACTUAL counts from arrays
        feed_like_count: actualLikeCount,
        feed_comment_count: actualCommentCount,
        feed_share_count: actualShareCount,
        
        // Send arrays for detailed data
        feed_likes: likes,
        feed_comments: sortedComments,
        feed_shares: shares,
        comments: sortedComments,
        
        // Check if current user liked this post
        is_liked_by_user: user_id ? likes.some(like => like.user_id === user_id) : false,
        
        created_at: feed.created_at,
        updated_at: feed.updated_at
      };
    }));

    res.json({
      success: true,
      data: feedsWithStats
    });

  } catch (error) {
    console.error("❌ Get All Feeds Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    client.release();
  }
};




// export const getFeedByRaId = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const { rows } = await pool.query(
//       `SELECT * FROM feeds WHERE ra_id=$1 ORDER BY created_at DESC`,
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No feeds found for this RA ID",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: rows,
//     });

//   } catch (error) {
//     console.error("Get Feed By RA ID Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };




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







export const getFeedByRaId = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  const user_id = req.user?.id;

  try {
    // 🔥 Same query structure as getFeedAll but with WHERE clause for ra_id
    const query = `
      SELECT 
        f.*,
        COALESCE(fl.feed_likes, '[]'::jsonb) as feed_likes,
        COALESCE(fl.feed_comments, '[]'::jsonb) as feed_comments,
        COALESCE(fl.feed_shares, '[]'::jsonb) as feed_shares
      FROM feeds f
      LEFT JOIN feed_logs fl ON f.id = fl.feed_id
      WHERE f.ra_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // 🔥 IMPORTANT: Process each feed with ACTUAL counts from arrays
    const feedsWithStats = await Promise.all(result.rows.map(async (feed) => {
      const likes = feed.feed_likes || [];
      const comments = feed.feed_comments || [];
      const shares = feed.feed_shares || [];

      // Fetch user_name for comments if not present
      const commentsWithUserNames = await Promise.all(comments.map(async (comment) => {
        if (!comment.user_name) {
          try {
            const userResult = await client.query(
              'SELECT name FROM users WHERE id = $1',
              [comment.user_id]
            );
            comment.user_name = userResult.rows[0]?.name || 'User';
          } catch (err) {
            comment.user_name = 'User';
          }
        }
        return comment;
      }));

      // Sort comments by date
      const sortedComments = commentsWithUserNames.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      // ✅ Use ACTUAL array lengths for counts, not DB stored values
      const actualLikeCount = likes.length;
      const actualCommentCount = comments.length;
      const actualShareCount = shares.length;

      return {
        id: feed.id,
        ra_id: feed.ra_id,
        ra_name: feed.ra_name,
        feed_text: feed.feed_text,
        feed_tags: feed.feed_tags || [],
        feed_documents: feed.feed_documents || [],
        
        // ✅ Send ACTUAL counts from arrays
        feed_like_count: actualLikeCount,
        feed_comment_count: actualCommentCount,
        feed_share_count: actualShareCount,
        
        // Send arrays for detailed data
        feed_likes: likes,
        feed_comments: sortedComments,
        feed_shares: shares,
        comments: sortedComments,
        
        // Check if current user liked this post
        is_liked_by_user: user_id ? likes.some(like => like.user_id === user_id) : false,
        
        created_at: feed.created_at,
        updated_at: feed.updated_at
      };
    }));

    return res.status(200).json({
      success: true,
      data: feedsWithStats
    });

  } catch (error) {
    console.error("❌ Get Feed By RA ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    client.release();
  }
};


















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




// ================================ UPDATE FEED CONTROLLER ================================
export const updateFeed = async (req, res) => {
  const client = await pool.connect();
  
  let newUploadedFiles = [];
  let s3KeysToCleanup = [];
  
  try {
    const { id } = req.params;
    const { ra_id, ra_name, feed_text, feed_tags = [] } = req.body;
    
    // Validation
    if (!id || !ra_id || !ra_name) {
      return res.status(400).json({
        success: false,
        message: "id, ra_id, and ra_name are required",
      });
    }

    // Parse tags
    const tagsArray = Array.isArray(feed_tags) 
      ? feed_tags 
      : typeof feed_tags === 'string' 
        ? JSON.parse(feed_tags) || []
        : [];

    // 1. Get existing feed data
    const getQuery = `
      SELECT feed_documents FROM feeds WHERE id = $1
    `;
    const { rows } = await client.query(getQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feed not found",
      });
    }

    let existingDocuments = rows[0].feed_documents || [];
    
    // Parse existing documents if string
    if (typeof existingDocuments === 'string') {
      try {
        existingDocuments = JSON.parse(existingDocuments) || [];
      } catch {
        existingDocuments = [];
      }
    }

    // 2. Handle documents to delete
    const documentsToDelete = req.body.documents_to_delete || [];
    const documentsToKeep = [];
    
    // Remove deleted documents
    for (let i = 0; i < existingDocuments.length; i++) {
      if (!documentsToDelete.includes(String(i))) {
        documentsToKeep.push(existingDocuments[i]);
      } else {
        // Delete from S3
        const doc = existingDocuments[i];
        if (doc && doc.key) {
          try {
            await deleteFromS3(doc.key);
            console.log(`✅ Deleted S3 file: ${doc.key}`);
          } catch (error) {
            console.error(`❌ S3 delete error for ${doc.key}:`, error);
          }
        }
      }
    }

    // 3. Upload new files
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const s3Result = await uploadToS3(file, 'feeds');
          newUploadedFiles.push({
            originalName: file.originalname,
            url: s3Result.url,
            key: s3Result.key,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });
          s3KeysToCleanup.push(s3Result.key); // Track for cleanup on error
        }
      } catch (uploadError) {
        console.error("S3 Upload Error:", uploadError);
        // Cleanup newly uploaded files
        for (const key of s3KeysToCleanup) {
          try {
            await deleteFromS3(key);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
          }
        }
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message
        });
      }
    }

    // Combine kept + new documents
    const updatedDocuments = [...documentsToKeep, ...newUploadedFiles];
    const feed_documents = JSON.stringify(updatedDocuments);

    // 4. Update database
    const updateQuery = `
      UPDATE feeds 
      SET 
        ra_id = $1,
        ra_name = $2,
        feed_text = $3,
        feed_tags = $4,
        feed_documents = $5::jsonb,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const updateValues = [
      ra_id,
      ra_name,
      feed_text || null,
      tagsArray,
      feed_documents,
      id
    ];

    const updateResult = await client.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Feed not found or update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feed updated successfully",
      data: updateResult.rows[0],
    });

  } catch (error) {
    console.error("Update Feed Error:", error);
    
    // Cleanup: Delete newly uploaded files on any error
    for (const key of s3KeysToCleanup) {
      try {
        await deleteFromS3(key);
        console.log(`🧹 Cleaned up S3 file: ${key}`);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
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



// =========================================================================================================


export const feedLogController = {
  // 📌 LIKE/UNLIKE FEED
  // toggleLike: async (req, res) => {
  //   const client = await pool.connect();
  //   try {
  //     const { feed_id } = req.params;
  //     const user_id = req.body.user_id; // Assuming user is authenticated

   
      
  //     if (!user_id) {
  //       return res.status(401).json({ success: false, message: 'User not authenticated' });
  //     }

  //     await client.query('BEGIN');

  //     // Check if feed_log entry exists
  //     let feedLog = await client.query(
  //       'SELECT * FROM feed_logs WHERE feed_id = $1',
  //       [feed_id]
  //     );

  //     let updatedLikes;

  //     if (feedLog.rows.length === 0) {
  //       // Create new feed_log
  //       const newLog = await client.query(
  //         `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
  //          VALUES ($1, $2, $3, $4, NOW(), NOW())
  //          RETURNING *`,
  //         [feed_id, JSON.stringify([]), JSON.stringify([]), JSON.stringify([])]
  //       );
        
  //       feedLog = newLog;
  //       updatedLikes = [];
  //     } else {
  //       updatedLikes = feedLog.rows[0].feed_likes || [];
  //     }

  //     // Check if user already liked
  //     const userLikeIndex = updatedLikes.findIndex(like => like.user_id === user_id);

  //     if (userLikeIndex === -1) {
  //       // Add like
  //       updatedLikes.push({
  //         user_id,
  //         created_at: new Date().toISOString()
  //       });
  //     } else {
  //       // Remove like
  //       updatedLikes.splice(userLikeIndex, 1);
  //     }

  //     // Update feed_logs table
  //     const result = await client.query(
  //       `UPDATE feed_logs 
  //        SET feed_likes = $1, updated_at = NOW()
  //        WHERE feed_id = $2
  //        RETURNING *`,
  //       [JSON.stringify(updatedLikes), feed_id]
  //     );

  //     await client.query('COMMIT');

  //     res.json({
  //       success: true,
  //       data: {
  //         liked: userLikeIndex === -1,
  //         likes_count: updatedLikes.length,
  //         likes: updatedLikes
  //       }
  //     });

  //   } catch (error) {
  //     await client.query('ROLLBACK');
  //     console.error('Error in toggleLike:', error);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  //   } finally {
  //     client.release();
  //   }
  // },

  // 📌 LIKE/UNLIKE FEED
toggleLike: async (req, res) => {
  const client = await pool.connect();
  try {
    const { feed_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await client.query('BEGIN');

    // Check if feed_log exists
    let feedLog = await client.query(
      'SELECT * FROM feed_logs WHERE feed_id = $1',
      [feed_id]
    );

    let updatedLikes;
    let likeChange = 0;

    if (feedLog.rows.length === 0) {
      // Create new feed_log with first like
      updatedLikes = [{
        user_id,
        created_at: new Date().toISOString()
      }];

      await client.query(
        `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [feed_id, JSON.stringify(updatedLikes), JSON.stringify([]), JSON.stringify([])]
      );
      
      likeChange = 1;
    } else {
      updatedLikes = feedLog.rows[0].feed_likes || [];
      const userLikeIndex = updatedLikes.findIndex(like => like.user_id === user_id);

      if (userLikeIndex === -1) {
        // Add like
        updatedLikes.push({
          user_id,
          created_at: new Date().toISOString()
        });
        likeChange = 1;
      } else {
        // Remove like
        updatedLikes.splice(userLikeIndex, 1);
        likeChange = -1;
      }

      // Update feed_logs
      await client.query(
        `UPDATE feed_logs 
         SET feed_likes = $1, updated_at = NOW()
         WHERE feed_id = $2`,
        [JSON.stringify(updatedLikes), feed_id]
      );
    }

    // ✅ Update feeds table like count
    await client.query(
      `UPDATE feeds 
       SET feed_like_count = feed_like_count + $1, updated_at = NOW()
       WHERE id = $2`,
      [likeChange, feed_id]
    );

    await client.query('COMMIT');

    // Get updated feed
    const updatedFeed = await client.query(
      'SELECT feed_like_count FROM feeds WHERE id = $1',
      [feed_id]
    );

    res.json({
      success: true,
      data: {
        liked: likeChange === 1,
        likes_count: updatedFeed.rows[0]?.feed_like_count || updatedLikes.length,
        likes: updatedLikes
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in toggleLike:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
},


  // 📌 ADD COMMENT
  // addComment: async (req, res) => {
  //   const client = await pool.connect();
  //   try {
  //     const { feed_id } = req.params;
  //     const { comment_text ,user_id} = req.body;
      
  //     if (!user_id) {
  //       return res.status(401).json({ success: false, message: 'User not authenticated' });
  //     }

  //     if (!comment_text?.trim()) {
  //       return res.status(400).json({ success: false, message: 'Comment text is required' });
  //     }

  //     await client.query('BEGIN');

  //     // Check if feed_log exists
  //     let feedLog = await client.query(
  //       'SELECT * FROM feed_logs WHERE feed_id = $1',
  //       [feed_id]
  //     );

  //     let updatedComments;

  //     if (feedLog.rows.length === 0) {
  //       // Create new feed_log with first comment
  //       const newComment = [{
  //         id: Date.now(),
  //         user_id,
  //         comment_text: comment_text.trim(),
  //         created_at: new Date().toISOString(),
  //         updated_at: new Date().toISOString()
  //       }];

  //       const newLog = await client.query(
  //         `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
  //          VALUES ($1, $2, $3, $4, NOW(), NOW())
  //          RETURNING *`,
  //         [feed_id, JSON.stringify([]), JSON.stringify(newComment), JSON.stringify([])]
  //       );
        
  //       updatedComments = newComment;
  //     } else {
  //       updatedComments = feedLog.rows[0].feed_comments || [];
        
  //       // Add new comment
  //       updatedComments.push({
  //         id: Date.now(),
  //         user_id,
  //         comment_text: comment_text.trim(),
  //         created_at: new Date().toISOString(),
  //         updated_at: new Date().toISOString()
  //       });
  //     }

  //     // Update feed_logs
  //     const result = await client.query(
  //       `UPDATE feed_logs 
  //        SET feed_comments = $1, updated_at = NOW()
  //        WHERE feed_id = $2
  //        RETURNING *`,
  //       [JSON.stringify(updatedComments), feed_id]
  //     );

  //     await client.query('COMMIT');

  //     res.status(201).json({
  //       success: true,
  //       data: {
  //         comments_count: updatedComments.length,
  //         comments: updatedComments,
  //         new_comment: updatedComments[updatedComments.length - 1]
  //       }
  //     });

  //   } catch (error) {
  //     await client.query('ROLLBACK');
  //     console.error('Error in addComment:', error);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  //   } finally {
  //     client.release();
  //   }
  // },

  // 📌 ADD COMMENT
addComment: async (req, res) => {
  const client = await pool.connect();
  try {
    const { feed_id } = req.params;
    const { comment_text, user_id } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get user name
    const userResult = await client.query(
      'SELECT name FROM users WHERE id = $1',
      [user_id]
    );
    const user_name = userResult.rows[0]?.name || 'User';

    await client.query('BEGIN');

    // Check if feed_log exists
    let feedLog = await client.query(
      'SELECT * FROM feed_logs WHERE feed_id = $1',
      [feed_id]
    );

    let updatedComments;

    const newCommentObj = {
      id: Date.now(),
      user_id,
      user_name,
      comment_text: comment_text.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (feedLog.rows.length === 0) {
      updatedComments = [newCommentObj];

      await client.query(
        `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [feed_id, JSON.stringify([]), JSON.stringify(updatedComments), JSON.stringify([])]
      );
    } else {
      updatedComments = feedLog.rows[0].feed_comments || [];
      updatedComments.push(newCommentObj);

      await client.query(
        `UPDATE feed_logs 
         SET feed_comments = $1, updated_at = NOW()
         WHERE feed_id = $2`,
        [JSON.stringify(updatedComments), feed_id]
      );
    }

    // ✅ Update feeds table comment count
    await client.query(
      `UPDATE feeds 
       SET feed_comment_count = feed_comment_count + 1, updated_at = NOW()
       WHERE id = $1`,
      [feed_id]
    );

    await client.query('COMMIT');

    // Get updated feed
    const updatedFeed = await client.query(
      'SELECT feed_comment_count FROM feeds WHERE id = $1',
      [feed_id]
    );

    res.status(201).json({
      success: true,
      data: {
        comments_count: updatedFeed.rows[0]?.feed_comment_count || updatedComments.length,
        comments: updatedComments,
        new_comment: newCommentObj
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in addComment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
},




  // 📌 EDIT COMMENT
  editComment: async (req, res) => {
    const client = await pool.connect();
    try {
      const { feed_id, comment_id } = req.params;
      const { comment_text ,user_id} = req.body;
     

      if (!user_id) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const feedLog = await client.query(
        'SELECT * FROM feed_logs WHERE feed_id = $1',
        [feed_id]
      );

      if (feedLog.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Feed log not found' });
      }

      let comments = feedLog.rows[0].feed_comments || [];
      const commentIndex = comments.findIndex(c => c.id === parseInt(comment_id));

      if (commentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Check if user owns the comment
      if (comments[commentIndex].user_id !== user_id) {
        return res.status(403).json({ success: false, message: 'You can only edit your own comments' });
      }

      // Update comment
      comments[commentIndex].comment_text = comment_text.trim();
      comments[commentIndex].updated_at = new Date().toISOString();

      const result = await client.query(
        `UPDATE feed_logs 
         SET feed_comments = $1, updated_at = NOW()
         WHERE feed_id = $2
         RETURNING *`,
        [JSON.stringify(comments), feed_id]
      );

      res.json({
        success: true,
        data: {
          comments_count: comments.length,
          comments: comments,
          updated_comment: comments[commentIndex]
        }
      });

    } catch (error) {
      console.error('Error in editComment:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  },

  // 📌 DELETE COMMENT
  deleteComment: async (req, res) => {
    const client = await pool.connect();
    try {
      const { feed_id, comment_id } = req.params;
      const user_id = req.body.user_id;

      if (!user_id) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const feedLog = await client.query(
        'SELECT * FROM feed_logs WHERE feed_id = $1',
        [feed_id]
      );

      if (feedLog.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Feed log not found' });
      }

      let comments = feedLog.rows[0].feed_comments || [];
      const commentIndex = comments.findIndex(c => c.id === parseInt(comment_id));

      if (commentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Check if user owns the comment
      if (comments[commentIndex].user_id !== user_id) {
        return res.status(403).json({ success: false, message: 'You can only delete your own comments' });
      }

      // Remove comment
      comments.splice(commentIndex, 1);

      const result = await client.query(
        `UPDATE feed_logs 
         SET feed_comments = $1, updated_at = NOW()
         WHERE feed_id = $2
         RETURNING *`,
        [JSON.stringify(comments), feed_id]
      );

      res.json({
        success: true,
        data: {
          comments_count: comments.length,
          comments: comments,
          deleted_comment_id: parseInt(comment_id)
        }
      });

    } catch (error) {
      console.error('Error in deleteComment:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  },

  // 📌 SHARE FEED
  // shareFeed: async (req, res) => {
  //   const client = await pool.connect();
  //   try {
  //     const { feed_id } = req.params;
  //     const { platform = 'direct' ,user_id} = req.body; // direct, twitter, linkedin, etc.
      

  //     if (!user_id) {
  //       return res.status(401).json({ success: false, message: 'User not authenticated' });
  //     }

  //     await client.query('BEGIN');

  //     // Check if feed_log exists
  //     let feedLog = await client.query(
  //       'SELECT * FROM feed_logs WHERE feed_id = $1',
  //       [feed_id]
  //     );

  //     let updatedShares;

  //     if (feedLog.rows.length === 0) {
  //       // Create new feed_log with first share
  //       const newShare = [{
  //         id: Date.now(),
  //         user_id,
  //         platform,
  //         created_at: new Date().toISOString()
  //       }];

  //       await client.query(
  //         `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
  //          VALUES ($1, $2, $3, $4, NOW(), NOW())`,
  //         [feed_id, JSON.stringify([]), JSON.stringify([]), JSON.stringify(newShare)]
  //       );
        
  //       updatedShares = newShare;
  //     } else {
  //       updatedShares = feedLog.rows[0].feed_shares || [];
        
  //       // Add share log
  //       updatedShares.push({
  //         id: Date.now(),
  //         user_id,
  //         platform,
  //         created_at: new Date().toISOString()
  //       });
  //     }

  //     // Update feed_logs
  //     const result = await client.query(
  //       `UPDATE feed_logs 
  //        SET feed_shares = $1, updated_at = NOW()
  //        WHERE feed_id = $2
  //        RETURNING *`,
  //       [JSON.stringify(updatedShares), feed_id]
  //     );

  //     await client.query('COMMIT');

  //     res.json({
  //       success: true,
  //       data: {
  //         shares_count: updatedShares.length,
  //         shares: updatedShares
  //       }
  //     });

  //   } catch (error) {
  //     await client.query('ROLLBACK');
  //     console.error('Error in shareFeed:', error);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  //   } finally {
  //     client.release();
  //   }
  // },
  
  // 📌 SHARE FEED
shareFeed: async (req, res) => {
  const client = await pool.connect();
  try {
    const { feed_id } = req.params;
    const { platform = 'direct', user_id } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await client.query('BEGIN');

    // Check if feed_log exists
    let feedLog = await client.query(
      'SELECT * FROM feed_logs WHERE feed_id = $1',
      [feed_id]
    );

    if (feedLog.rows.length === 0) {
      const newShares = [{
        id: Date.now(),
        user_id,
        platform,
        created_at: new Date().toISOString()
      }];

      await client.query(
        `INSERT INTO feed_logs (feed_id, feed_likes, feed_comments, feed_shares, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [feed_id, JSON.stringify([]), JSON.stringify([]), JSON.stringify(newShares)]
      );
    } else {
      const updatedShares = feedLog.rows[0].feed_shares || [];
      updatedShares.push({
        id: Date.now(),
        user_id,
        platform,
        created_at: new Date().toISOString()
      });

      await client.query(
        `UPDATE feed_logs 
         SET feed_shares = $1, updated_at = NOW()
         WHERE feed_id = $2`,
        [JSON.stringify(updatedShares), feed_id]
      );
    }

    // ✅ Update feeds table share count
    await client.query(
      `UPDATE feeds 
       SET feed_share_count = feed_share_count + 1, updated_at = NOW()
       WHERE id = $1`,
      [feed_id]
    );

    await client.query('COMMIT');

    // Get updated feed
    const updatedFeed = await client.query(
      'SELECT feed_share_count FROM feeds WHERE id = $1',
      [feed_id]
    );

    res.json({
      success: true,
      data: {
        shares_count: updatedFeed.rows[0]?.feed_share_count || 0
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in shareFeed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
},


  // 📌 GET FEED LOGS (For a specific feed)
  getFeedLogs: async (req, res) => {
    try {
      const { feed_id } = req.params;
      const user_id = req.user?.id;

      const result = await client.query(
        'SELECT * FROM feed_logs WHERE feed_id = $1',
        [feed_id]
      );

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: {
            likes: [],
            comments: [],
            shares: [],
            likes_count: 0,
            comments_count: 0,
            shares_count: 0,
            is_liked_by_user: false
          }
        });
      }

      const feedLog = result.rows[0];
      const likes = feedLog.feed_likes || [];
      const comments = feedLog.feed_comments || [];
      const shares = feedLog.feed_shares || [];

      res.json({
        success: true,
        data: {
          likes,
          comments,
          shares,
          likes_count: likes.length,
          comments_count: comments.length,
          shares_count: shares.length,
          is_liked_by_user: user_id ? likes.some(like => like.user_id === user_id) : false
        }
      });

    } catch (error) {
      console.error('Error in getFeedLogs:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // 📌 GET ALL FEEDS WITH LOGS (Modified for Signals component)
  getAllFeedsWithLogs: async (req, res) => {
    try {
      const user_id = req.user?.id;

      const query = `
        SELECT 
          f.*,
          COALESCE(
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'id', d.id,
                'url', d.url,
                'type', d.type
              )
            ) FILTER (WHERE d.id IS NOT NULL),
            '[]'::jsonb
          ) as feed_documents,
          COALESCE(
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'id', t.id,
                'name', t.name
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::jsonb
          ) as feed_tags,
          COALESCE(fl.feed_likes, '[]'::jsonb) as feed_likes,
          COALESCE(fl.feed_comments, '[]'::jsonb) as feed_comments,
          COALESCE(fl.feed_shares, '[]'::jsonb) as feed_shares
        FROM feeds f
        LEFT JOIN feed_documents d ON f.id = d.feed_id
        LEFT JOIN feed_tag_mapping ftm ON f.id = ftm.feed_id
        LEFT JOIN feed_tags t ON ftm.tag_id = t.id
        LEFT JOIN feed_logs fl ON f.id = fl.feed_id
        GROUP BY f.id, fl.feed_likes, fl.feed_comments, fl.feed_shares
        ORDER BY f.created_at DESC
      `;

      const result = await pool.query(query);

      const feedsWithStats = result.rows.map(feed => {
        const likes = feed.feed_likes || [];
        const comments = feed.feed_comments || [];
        const shares = feed.feed_shares || [];

        return {
          ...feed,
          feed_like_count: likes.length,
          feed_comment_count: comments.length,
          feed_share_count: shares.length,
          is_liked_by_user: user_id ? likes.some(like => like.user_id === user_id) : false,
          comments: comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        };
      });

      res.json({
        success: true,
        data: feedsWithStats
      });

    } catch (error) {
      console.error('Error in getAllFeedsWithLogs:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};



export const getFeedById = async (req, res) => {
  const client = await pool.connect();
  try {
    const { feed_id } = req.params;
    const user_id = req.user?.id;

    // 🔥 SIMPLE QUERY - Sirf do tables with WHERE clause
    const query = `
      SELECT 
        f.*,
        COALESCE(fl.feed_likes, '[]'::jsonb) as feed_likes,
        COALESCE(fl.feed_comments, '[]'::jsonb) as feed_comments,
        COALESCE(fl.feed_shares, '[]'::jsonb) as feed_shares
      FROM feeds f
      LEFT JOIN feed_logs fl ON f.id = fl.feed_id
      WHERE f.id = $1
    `;

    const result = await client.query(query, [feed_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feed not found"
      });
    }

    const feed = result.rows[0];
    
    const likes = feed.feed_likes || [];
    const comments = feed.feed_comments || [];
    const shares = feed.feed_shares || [];

    // Fetch user_name for comments if not present
    const commentsWithUserNames = await Promise.all(comments.map(async (comment) => {
      if (!comment.user_name) {
        try {
          const userResult = await client.query(
            'SELECT name FROM users WHERE id = $1',
            [comment.user_id]
          );
          comment.user_name = userResult.rows[0]?.name || 'User';
        } catch (err) {
          comment.user_name = 'User';
        }
      }
      return comment;
    }));

    // Sort comments by date
    const sortedComments = commentsWithUserNames.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    // ✅ Use ACTUAL array lengths for counts
    const actualLikeCount = likes.length;
    const actualCommentCount = comments.length;
    const actualShareCount = shares.length;

    const feedWithStats = {
      id: feed.id,
      ra_id: feed.ra_id,
      ra_name: feed.ra_name,
      ra_avatar: feed.ra_avatar,
      feed_text: feed.feed_text,
      feed_tags: feed.feed_tags || [],
      feed_documents: feed.feed_documents || [],
      
      // ✅ Send ACTUAL counts from arrays
      feed_like_count: actualLikeCount,
      feed_comment_count: actualCommentCount,
      feed_share_count: actualShareCount,
      
      // Send arrays for detailed data
      feed_likes: likes,
      feed_comments: sortedComments,
      feed_shares: shares,
      comments: sortedComments,
      
      // Check if current user liked this post
      is_liked_by_user: user_id ? likes.some(like => like.user_id === user_id) : false,
      
      created_at: feed.created_at,
      updated_at: feed.updated_at
    };

    res.json({
      success: true,
      data: feedWithStats
    });

  } catch (error) {
    console.error("❌ Get Feed By ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  } finally {
    client.release();
  }
};