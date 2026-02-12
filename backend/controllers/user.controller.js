// import { pool } from "../db.js";

// // ============================== get website user data =============================

// export const getWebsiteUserData = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Parameterized query SQL injection से बचने के लिए
//     const query = `
//       SELECT 
//         id, 
//         email, 
//         name, 
//         phone, 
//         gender, 
//         dob, 
//         pan, 
//         state, 
//         firebase_uid,
//         auth_provider,
//         is_verified,
//         role,
//         created_at,
//         updated_at
//       FROM users 
//       WHERE id = $1
//     `;
    
//     const result = await sequelize.query(query, {
//       bind: [id],
//       type: sequelize.QueryTypes.SELECT
//     });

//     if (result.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(result[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


import { pool } from "../db.js";

// ============================== get website user data =============================

export const getWebsiteUserData = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required"
      });
    }
    
    // Parameterized query to prevent SQL injection
    const query = `
      SELECT 
        id, 
        email, 
        name, 
        phone, 
        gender, 
        dob, 
        pan, 
        state, 
        firebase_uid,
        auth_provider,
        is_verified,
        role,
        profile_image,
        created_at,
        updated_at
      FROM users 
      WHERE id = $1
    `;
    
    const result = await client.query(query, [parseInt(id)]);
    
    // Release client early since we don't need transaction
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Format the response data
    const userData = result.rows[0];
    
    // Remove sensitive data if needed
    delete userData.firebase_uid;
    delete userData.auth_provider;

    return res.status(200).json({
      success: true,
      data: userData
    });
    
  } catch (error) {
    console.error("Get User Data Error:", error);
    
    // Make sure client is released even if error occurs
    if (client) {
      client.release();
    }
    
    // Handle specific errors
    if (error.message.includes('invalid input syntax')) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




export const getWebsiteRaData = async (req, res) => {
  try {
    const { id } = req.params;


    // Validate ID
    const userId = parseInt(id);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid ID required"
      });
    }

    // Simple query
    const result = await pool.query(
      'SELECT * FROM research_analysts WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "RA data not found"
      });
    }

    const raData = result.rows[0];
    
    // Clean sensitive data
    const { firebase_uid, auth_provider, password, ...cleanData } = raData;

    res.status(200).json({
      success: true,
      data: cleanData
    });

  } catch (error) {
    console.error('RA Data Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data'
    });
  }
};




export const allUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE role = $1 AND is_verified = $2 
       ORDER BY created_at DESC`,
      ['user', true]
    );

    // ✅ Fixed: result.rows instead of result.row
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows  // ✅ CORRECTED (was result.row)
    });

  } catch (error) {
    console.error('User Data Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data'
    });
  }
};
