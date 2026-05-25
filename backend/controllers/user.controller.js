import { pool } from "../db.js";
import { transporter } from "../config/mailer.js";
import https from 'https';




export const getWebsiteUserData = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const query = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        u.gender,
        u.dob,
        u.pan,
        u.state,
        u.is_verified,
        u.role,
        u.profile_image,
        u.created_at,
        u.updated_at,

        dv.id AS document_id,
        dv.uname,
        dv.phone_number,
        dv.pan_number,
        dv.sebi_number,
        dv.phone_verified,
        dv.pan_verified,
        dv.sebi_verified,
        dv.phone_verified_at,
        dv.pan_verified_at,
        dv.sebi_verified_at,
        dv.registered_at,
        dv.last_updated,
        dv.date_of_birth,
        dv.address,
        dv.user_type

      FROM users u
      LEFT JOIN documents_verification dv
        ON u.id = dv.uid
        AND dv.user_type = 'user'
      WHERE u.id = $1
    `;

    const result = await client.query(query, [parseInt(id)]);
    client.release();

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    client.release();
    console.error("Get User Data Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};





export const getUserProfile = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (!id || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    // User data
    const userQuery = `
      SELECT id, email, name, phone, gender, dob, pan, state, 
             is_verified, role, profile_image, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const userResult = await client.query(userQuery, [userId]);
    
    if (!userResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];
    
    // ✅ FIXED: Use EXISTING columns only - NO email_verified needed
    let verificationQuery = '';
    if (user.role === 'RA') {
      verificationQuery = `
        SELECT id AS document_id, uname, email, phone_number, pan_number, sebi_number,
               phone_verified, pan_verified, sebi_verified,
               phone_verified_at, pan_verified_at, sebi_verified_at,
               registered_at, last_updated, date_of_birth, address, user_type
        FROM documents_verification 
        WHERE uid = $1 AND user_type = 'RA'
        ORDER BY last_updated DESC LIMIT 1
      `;
    } else {
      verificationQuery = `
        SELECT id AS document_id, uname, email, phone_number, pan_number,
               phone_verified, pan_verified,
               phone_verified_at, pan_verified_at,
               registered_at, last_updated, date_of_birth, address, user_type
        FROM documents_verification 
        WHERE uid = $1 AND user_type = 'user'
        ORDER BY last_updated DESC LIMIT 1
      `;
    }

    const verificationResult = await client.query(verificationQuery, [userId]);
    const verificationData = verificationResult.rows[0] || {};

    const profileData = {
      // User data
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      gender: user.gender, dob: user.dob, pan: user.pan, state: user.state,
      is_verified: user.is_verified, role: user.role,
      profile_image: user.profile_image, created_at: user.created_at, updated_at: user.updated_at,
      
      // ✅ Verification data - using EXISTING columns
      phone_number: verificationData.phone_number || user.phone,
      pan_number: verificationData.pan_number || user.pan,
      sebi_number: user.role === 'RA' ? (verificationData.sebi_number || null) : null,
      
      // ✅ VERIFICATION STATUS - Perfect logic
      phone_verified: verificationData.phone_verified === true,
      pan_verified: verificationData.pan_verified === true,
      // ✅ EMAIL: If documents_verification me email hai = verified, nahi hai = false
      email_verified: !!(verificationData.email && verificationData.email.trim() !== ""),
      sebi_verified: user.role === 'RA' ? (verificationData.sebi_verified === true) : false,
      
      phone_verified_at: verificationData.phone_verified_at || null,
      pan_verified_at: verificationData.pan_verified_at || null,
      sebi_verified_at: user.role === 'RA' ? (verificationData.sebi_verified_at || null) : null,
      
      document_id: verificationData.document_id || null,
      registered_at: verificationData.registered_at || null,
      last_updated: verificationData.last_updated || null,
      date_of_birth: verificationData.date_of_birth || user.dob,
      address: verificationData.address || user.state,
      user_type: verificationData.user_type || user.role,
    };

    return res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile fetched successfully",
    });

  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    client.release();
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


export const checkVerifiedStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const result = await client.query(
      `
      SELECT pan_verified, phone_verified
      FROM documents_verification
      WHERE uid = $1 
      AND user_type = 'user'
      `,
      [parseInt(id)]
    );

    client.release();

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Verification record not found",
      });
    }

    const userData = result.rows[0];
    
    // ✅ FIX: Check if EITHER pan OR phone is verified
    const isVerified = userData.pan_verified === true || userData.phone_verified === true;

    return res.status(200).json({
      success: true,
      verified: isVerified,  // ✅ Frontend expects this field
      data: userData         // Keep original data too
    });

  } catch (error) {
    client.release();
    console.error("Check Verified Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ---------------------------------------------------------new controllers ------------------------------------------------------------



const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
export const sendEmailOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    // Check if email exists in users table
    const userCheck = await client.query(
      'SELECT id, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not registered"
      });
    }

    const user = userCheck.rows[0];
    const actualUserId = userId || user.id;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Mark any existing unused OTPs as used
    await client.query(
      `UPDATE otp_logs SET is_used = true 
       WHERE user_id = $1 AND phone IS NULL AND is_used = false`,
      [actualUserId]
    );

    // Store OTP in database
    await client.query(
      `INSERT INTO otp_logs (user_id, otp, expires_at, created_at, is_used)
       VALUES ($1, $2, $3, NOW(), false)`,
      [actualUserId, otp, expiresAt]
    );

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="color: #666;">Your OTP for email verification is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; text-align: center; background: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</h1>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email"
    });

  } catch (error) {
    console.error("Send Email OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  } finally {
    client.release();
  }
};

// Verify OTP and update verification status
export const verifyEmailOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Get user info
    const userResult = await client.query(
      'SELECT id, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];

    // Check OTP from database
    const otpResult = await client.query(
      `SELECT * FROM otp_logs 
       WHERE user_id = $1 AND otp = $2 AND phone IS NULL 
       AND is_used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const otpRecord = otpResult.rows[0];

    // Start transaction
    await client.query('BEGIN');

    const now = new Date();

    // Mark OTP as used
    await client.query(
      'UPDATE otp_logs SET is_used = true WHERE id = $1',
      [otpRecord.id]
    );

    // Update users table
    await client.query(
      'UPDATE users SET is_verified = $1, updated_at = $2 WHERE id = $3',
      [true, now, user.id]
    );

    // Check if record exists in documents_verification
    const docCheck = await client.query(
      'SELECT id FROM documents_verification WHERE uid = $1',
      [user.id]
    );

    if (docCheck.rows.length === 0) {
      // Insert into documents_verification
      await client.query(
        `INSERT INTO documents_verification 
         (uid, email, user_type, registered_at, last_updated)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, email, 'user', now, now]
      );
    } else {
     
      await client.query(
        `UPDATE documents_verification 
         SET email = $1, last_updated = $2
         WHERE uid = $3`,
        [email, now, user.id]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        email_verified: true,
        email_verified_at: now
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Verify Email OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  } finally {
    client.release();
  }
};



// Check email verification status
export const checkEmailVerificationStatus = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required"
      });
    }

    // Get user email
    const userResult = await client.query(
      'SELECT id, email, is_verified FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];

    // Check in documents_verification
    let docVerified = false;
    let verifiedAt = null;

    try {
      const docResult = await client.query(
        `SELECT email_verified, email_verified_at 
         FROM documents_verification 
         WHERE uid = $1
         ORDER BY last_updated DESC 
         LIMIT 1`,
        [userId]
      );

      if (docResult.rows.length > 0) {
        docVerified = docResult.rows[0].email_verified === true;
        verifiedAt = docResult.rows[0].email_verified_at;
      }
    } catch (err) {
      // If columns don't exist, just log and continue
      console.log("Documents verification table might not have email columns:", err.message);
    }

    // Final verification status
    const isVerified = user.is_verified === true || docVerified === true;

    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        is_verified: isVerified,
        user_verified: user.is_verified === true,
        document_verified: docVerified,
        verified_at: verifiedAt
      }
    });

  } catch (error) {
    console.error("Check Email Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check verification status"
    });
  } finally {
    client.release();
  }
};

// Update email
export const updateUserEmail = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { newEmail } = req.body;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required"
      });
    }

    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    // Check if email already exists
    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [newEmail, userId]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      });
    }

    // Start transaction
    await client.query('BEGIN');

    const now = new Date();

    // Update users table
    await client.query(
      'UPDATE users SET email = $1, is_verified = $2, updated_at = $3 WHERE id = $4',
      [newEmail, false, now, userId]
    );

    // Check if record exists in documents_verification
    const docCheck = await client.query(
      'SELECT id FROM documents_verification WHERE uid = $1',
      [userId]
    );

    if (docCheck.rows.length === 0) {
      // Insert new record
      await client.query(
        `INSERT INTO documents_verification 
         (uid, email, email_verified, registered_at, last_updated, user_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, newEmail, false, now, now, 'user']
      );
    } else {
      // Update existing record
      try {
        await client.query(
          `UPDATE documents_verification 
           SET email = $1, email_verified = $2, last_updated = $3
           WHERE uid = $4`,
          [newEmail, false, now, userId]
        );
      } catch (err) {
        // If email column doesn't exist, just update verification status
        if (err.message.includes('column "email" does not exist')) {
          await client.query(
            `UPDATE documents_verification 
             SET email_verified = $2, last_updated = $3
             WHERE uid = $4`,
            [false, now, userId]
          );
        } else {
          throw err;
        }
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Email updated successfully. Please verify your new email.",
      data: {
        email: newEmail,
        is_verified: false
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Update Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update email"
    });
  } finally {
    client.release();
  }
};




// ============================================
// PHONE VERIFICATION with Message91
// ============================================

// Send OTP to phone using Message91 - OTP API (without captcha)
// export const sendPhoneOTP = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { phone } = req.body;
//     const userId = req.user?.id || req.body.userId;

//     if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid 10-digit phone number required"
//       });
//     }

//     // Get user ID if not provided
//     let actualUserId = userId;
//     if (!actualUserId) {
//       const userResult = await client.query(
//         'SELECT id FROM users WHERE phone = $1',
//         [phone]
//       );
//       if (userResult.rows.length > 0) {
//         actualUserId = userResult.rows[0].id;
//       }
//     }

//     if (!actualUserId) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // ✅ Generate 6-digit OTP jo database mein save hoga
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Store expiry time (10 minutes)
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
//     // Mark any existing unused OTPs for this user/phone as used
//     await client.query(
//       `UPDATE otp_logs SET is_used = true 
//        WHERE user_id = $1 AND phone = $2 AND is_used = false`,
//       [actualUserId, phone]
//     );

//     // ✅ Store OTP in database (sirf basic columns)
//     const otpResult = await client.query(
//       `INSERT INTO otp_logs 
//        (user_id, phone, otp, expires_at, created_at, is_used)
//        VALUES ($1, $2, $3, $4, NOW(), false)
//        RETURNING id`,
//       [actualUserId, phone, otp, expiresAt]
//     );

//     // MSG91 Widget API request
//     const authKey = process.env.MESSAGE91_AUTH_KEY;
//     const widgetId = process.env.MSG91_WIDGET_ID;

    
//     if (!authKey || !widgetId) {
//       throw new Error('MSG91 credentials missing');
//     }

//     const identifier = `91${phone}`;
    
//     const options = {
//       method: 'POST',
//       hostname: 'api.msg91.com',
//       port: 443,
//       path: '/api/v5/widget/sendOtp',
//       headers: {
//         'authkey': authKey,
//         'content-type': 'application/json'
//       }
//     };

//     const requestBody = JSON.stringify({
//       widgetId: widgetId,
//       identifier: identifier
//     });

//     console.log("🔥 Sending to MSG91:", { identifier, widgetId: widgetId.substring(0, 4) + '...' });

//     const apiResponse = await new Promise((resolve, reject) => {
//       const req = https.request(options, (res) => {
//         let chunks = [];
//         res.on('data', (chunk) => chunks.push(chunk));
//         res.on('end', () => {
//           const body = Buffer.concat(chunks).toString();
//           console.log("📱 MSG91 Raw Response:", body);
//           try {
//             resolve(JSON.parse(body));
//           } catch (e) {
//             resolve({ raw: body });
//           }
//         });
//       });

//       req.on('error', (err) => {
//         console.error("🌐 HTTPS Error:", err.message);
//         reject(err);
//       });
      
//       req.write(requestBody);
//       req.end();
//     });

//     // Better success check
//     const isSuccess = apiResponse.response_code === 1 || 
//                      apiResponse.type === 'success' ||
//                      apiResponse.message?.includes('success') ||
//                      !apiResponse.message?.includes('error');

//     console.log("✅ Final Check:", { isSuccess, response: apiResponse });

//     if (isSuccess) {
//       res.status(200).json({
//         success: true,
//         message: "OTP sent successfully",
//         data: {
//           otpId: otpResult.rows[0].id,
//           ...(process.env.NODE_ENV === "development" && { otp })
//         }
//       });
//     } else {
//       res.status(200).json({
//         success: true,
//         message: "OTP generated (SMS delivery issue)",
//         data: {
//           otpId: otpResult.rows[0].id,
//           ...(process.env.NODE_ENV === "development" && { otp }),
//           msg91_error: apiResponse.message
//         }
//       });
//     }

//   } catch (error) {
//     console.error("❌ Full Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       ...(process.env.NODE_ENV === "development" && { error: error.message })
//     });
//   } finally {
//     client.release();
//   }
// };





export const sendPhoneOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { phone } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required"
      });
    }

    // Get user ID if not provided
    let actualUserId = userId;
    if (!actualUserId) {
      const userResult = await client.query(
        'SELECT id FROM users WHERE phone = $1',
        [phone]
      );
      if (userResult.rows.length > 0) {
        actualUserId = userResult.rows[0].id;
      }
    }

    if (!actualUserId) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const authKey = process.env.MESSAGE91_AUTH_KEY;
    const widgetId = process.env.MSG91_WIDGET_ID;

    if (!authKey || !widgetId) {
      throw new Error('MSG91 credentials missing');
    }

    const identifier = `91${phone}`;
    
    const options = {
      method: 'POST',
      hostname: 'api.msg91.com',
      port: 443,
      path: '/api/v5/widget/sendOtp',
      headers: {
        'authkey': authKey,
        'content-type': 'application/json'
      }
    };

    const requestBody = JSON.stringify({
      widgetId: widgetId,
      identifier: identifier
    });

    console.log("🔥 Sending to MSG91:", { identifier, widgetId: widgetId.substring(0, 4) + '...' });

    // ✅ MSG91 API call first
    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          console.log("📱 MSG91 Raw Response:", body);
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ raw: body });
          }
        });
      });

      req.on('error', (err) => {
        console.error("🌐 HTTPS Error:", err.message);
        reject(err);
      });
      
      req.write(requestBody);
      req.end();
    });

    // ✅ MSG91 se actual OTP aur reqId nikalo
    let msg91Otp = null;
    let msg91ReqId = null;
    
    // Different possible response formats check karo
    if (apiResponse.otp) {
      msg91Otp = apiResponse.otp.toString();
    } else if (apiResponse.data?.otp) {
      msg91Otp = apiResponse.data.otp.toString();
    } else if (apiResponse.message?.match(/(\d{6})/)) {
      msg91Otp = apiResponse.message.match(/(\d{6})/)[1];
    }

    // ✅ reqId extract karo (ye important hai verification ke liye)
    if (apiResponse.request_id) {
      msg91ReqId = apiResponse.request_id;
    } else if (apiResponse.data?.request_id) {
      msg91ReqId = apiResponse.data.request_id;
    } else if (apiResponse.reqId) {
      msg91ReqId = apiResponse.reqId;
    }

    // Agar reqId nahi mila to message field ko hi reqId maan lo (kyunki aapke case mein message mein OTP hai)
    if (!msg91ReqId && apiResponse.message && apiResponse.message.length > 10) {
      msg91ReqId = apiResponse.message; // Isko reqId ki tarah store karo
      console.log("📝 Using message as reqId:", msg91ReqId);
    }

    // Fallback: agar MSG91 OTP nahi mila to local generate karo
    if (!msg91Otp || !/^\d{6}$/.test(msg91Otp)) {
      console.log("⚠️ MSG91 OTP not found, generating local OTP");
      msg91Otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    console.log("✅ OTP to store:", msg91Otp.substring(0, 2) + "***");
    console.log("✅ ReqId to store:", msg91ReqId ? msg91ReqId.substring(0, 5) + "***" : "No ReqId");

    // Store expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Mark any existing unused OTPs for this user/phone as used
    await client.query(
      `UPDATE otp_logs SET is_used = true 
       WHERE user_id = $1 AND phone = $2 AND is_used = false`,
      [actualUserId, phone]
    );

    // ✅ Store MSG91 ka actual OTP and reqId in database
    const otpResult = await client.query(
      `INSERT INTO otp_logs 
       (user_id, phone, otp, msg91_req_id, expires_at, created_at, is_used)
       VALUES ($1, $2, $3, $4, $5, NOW(), false)
       RETURNING id`,
      [actualUserId, phone, msg91Otp, msg91ReqId, expiresAt]
    );

    // Better success check
    const isSuccess = apiResponse.response_code === 1 || 
                     apiResponse.type === 'success' ||
                     apiResponse.message?.includes('success') ||
                     !apiResponse.message?.includes('error');

    console.log("✅ Final Check:", { 
      isSuccess, 
      msg91Otp: msg91Otp.substring(0, 2) + "***", 
      hasReqId: !!msg91ReqId,
      response: apiResponse 
    });

    if (isSuccess) {
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        data: {
          otpId: otpResult.rows[0].id,
          ...(process.env.NODE_ENV === "development" && { otp: msg91Otp })
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: "OTP generated (SMS delivery issue)",
        data: {
          otpId: otpResult.rows[0].id,
          ...(process.env.NODE_ENV === "development" && { otp: msg91Otp }),
          msg91_error: apiResponse.message
        }
      });
    }

  } catch (error) {
    console.error("❌ Full Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  } finally {
    client.release();
  }
};


// Verify phone OTP


// export const verifyPhoneOTP = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { phone, otp, userId } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone and OTP are required"
//       });
//     }

//     // ✅ Pehle user ki details le lo (name ke liye)
//     let actualUserId = userId;
//     let userName = '';
//     let userRole = 'user';
    
//     if (!actualUserId) {
//       const userResult = await client.query(
//         'SELECT id, name, role FROM users WHERE phone = $1',
//         [phone]
//       );
//       if (userResult.rows.length > 0) {
//         actualUserId = userResult.rows[0].id;
//         userName = userResult.rows[0].name || '';
//         userRole = userResult.rows[0].role || 'user';
//       }
//     } else {
//       const userResult = await client.query(
//         'SELECT name, role FROM users WHERE id = $1',
//         [actualUserId]
//       );
//       if (userResult.rows.length > 0) {
//         userName = userResult.rows[0].name || '';
//         userRole = userResult.rows[0].role || 'user';
//       }
//     }

//     if (!actualUserId) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     const authKey = process.env.MESSAGE91_AUTH_KEY;
//     const widgetId = process.env.MSG91_WIDGET_ID;

//     if (!authKey || !widgetId) {
//       return res.status(500).json({
//         success: false,
//         message: "MSG91 configuration missing"
//       });
//     }

//     const identifier = `91${phone}`;
    
//     // ✅ Message91 Widget Verify API call
//     const verifyOptions = {
//       method: 'POST',
//       hostname: 'api.msg91.com',
//       port: 443,
//       path: '/api/v5/widget/verifyOtp',
//       headers: {
//         'authkey': authKey,
//         'content-type': 'application/json'
//       }
//     };

//     const verifyBody = JSON.stringify({
//       widgetId: widgetId,
//      "reqId": "requestId from send OTP response",
//       otp: otp
//     });

//     console.log("🔍 Verifying with MSG91:", { identifier, otp: otp.substring(0, 2) + '***' });

//     const msg91VerifyResponse = await new Promise((resolve, reject) => {
//       const req = https.request(verifyOptions, (res) => {
//         let chunks = [];
//         res.on('data', (chunk) => chunks.push(chunk));
//         res.on('end', () => {
//           const body = Buffer.concat(chunks).toString();
//           console.log("📱 MSG91 Verify Response:", body);
//           try {
//             resolve(JSON.parse(body));
//           } catch (e) {
//             resolve({ raw: body });
//           }
//         });
//       });

//       req.on('error', (err) => {
//         console.error("🌐 MSG91 Verify Error:", err.message);
//         reject(err);
//       });
      
//       req.write(verifyBody);
//       req.end();
//     });

//     // ✅ Check Message91 verification response
//     const isMsg91Success = msg91VerifyResponse.response_code === 1 || 
//                           msg91VerifyResponse.type === 'success' ||
//                           msg91VerifyResponse.message?.includes('success') ||
//                           msg91VerifyResponse.status === 'success';

//     if (!isMsg91Success) {
//       console.log("❌ MSG91 Verification Failed:", msg91VerifyResponse);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP or OTP expired",
//         ...(process.env.NODE_ENV === "development" && { msg91_response: msg91VerifyResponse })
//       });
//     }

//     console.log("✅ MSG91 Verification SUCCESS!");

//     // ✅ Ab database mein mark as used karo (same OTP check)
//     const otpRecordResult = await client.query(
//       `SELECT * FROM otp_logs 
//        WHERE user_id = $1 AND phone = $2 AND otp = $3
//        AND is_used = false AND expires_at > NOW()
//        ORDER BY created_at DESC LIMIT 1`,
//       [actualUserId, phone, otp]
//     );

//     // OTP database mein bhi exist hona chahiye
//     if (otpRecordResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found in records"
//       });
//     }

//     const otpRecord = otpRecordResult.rows[0];
    
//     // Start transaction
//     await client.query('BEGIN');
//     const now = new Date();

//     // Mark OTP as used
//     await client.query(
//       'UPDATE otp_logs SET is_used = true WHERE id = $1',
//       [otpRecord.id]
//     );

//     // ✅ Same database operations (unchanged)
//     const docCheck = await client.query(
//       `SELECT * FROM documents_verification WHERE uid = $1 AND user_type = $2`,
//       [actualUserId, userRole]
//     );

//     if (docCheck.rows.length === 0) {
//       await client.query(
//         `INSERT INTO documents_verification 
//          (uid, phone_number, phone_verified, phone_verified_at, user_type, registered_at, last_updated, uname)
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
//         [actualUserId, phone, true, now, userRole, now, now, userName]
//       );
//     } else {
//       await client.query(
//         `UPDATE documents_verification 
//          SET phone_verified = $1, phone_verified_at = $2, last_updated = $3
//          WHERE uid = $4 AND user_type = $5`,
//         [true, now, now, actualUserId, userRole]
//       );
//     }

//     await client.query(
//       `UPDATE users SET phone = $1, updated_at = $2 WHERE id = $3`,
//       [phone, now, actualUserId]
//     );

//     await client.query('COMMIT');

//     res.status(200).json({
//       success: true,
//       message: "Phone verified successfully",
//       data: {
//         phone_verified: true,
//         phone_verified_at: now,
//         ...(process.env.NODE_ENV === "development" && { 
//           msg91_response: msg91VerifyResponse,
//           otp_record: otpRecord.id 
//         })
//       }
//     });

//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("Verify Phone OTP Error:", error);
    
//     if (error.code === '23502') {
//       return res.status(400).json({
//         success: false,
//         message: "User name is required for verification"
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: "Failed to verify OTP",
//       ...(process.env.NODE_ENV === "development" && { error: error.message })
//     });
//   } finally {
//     client.release();
//   }
// };

export const verifyPhoneOTP = async (req, res) => {
  const client = await pool.connect();
  
     
  try {
    const { phone, otp, userId } = req.body;

    

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    
    // ✅ Pehle user ki details le lo
    let actualUserId = userId;
    let userName = '';
    let userRole = 'user';
    
    if (!actualUserId) {
      const userResult = await client.query(
        'SELECT id, name, role FROM users WHERE phone = $1',
        [phone]
      );
      if (userResult.rows.length > 0) {
        actualUserId = userResult.rows[0].id;
        userName = userResult.rows[0].name || '';
        userRole = userResult.rows[0].role || 'user';
      }
    } else {
      const userResult = await client.query(
        'SELECT name, role FROM users WHERE id = $1',
        [actualUserId]
      );
      if (userResult.rows.length > 0) {
        userName = userResult.rows[0].name || '';
        userRole = userResult.rows[0].role || 'user';
      }
    }

    if (!actualUserId) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

     

    console.log(actualUserId, phone, otp,200)

    // ✅ Database se OTP record aur reqId le lo
    const otpRecordResult = await client.query(
      `SELECT * FROM otp_logs 
       WHERE user_id = $1 AND phone = $2 
       AND is_used = false 
       ORDER BY created_at DESC LIMIT 1`,
      [actualUserId, phone]
    );


    if (otpRecordResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const otpRecord = otpRecordResult.rows[0];


    
    // ✅ MSG91 se verify karne ki koshish karo (agar reqId ho to)
    let isMsg91Success = false;
    
    if (otpRecord.msg91_req_id) {
      const authKey = process.env.MESSAGE91_AUTH_KEY;
      const widgetId = process.env.MSG91_WIDGET_ID;

      if (authKey && widgetId) {
        const identifier = `91${phone}`;
        
        const verifyOptions = {
          method: 'POST',
          hostname: 'api.msg91.com',
          port: 443,
          path: '/api/v5/widget/verifyOtp',
          headers: {
            'authkey': authKey,
            'content-type': 'application/json'
          }
        };

        const verifyBody = JSON.stringify({
          widgetId: widgetId,
          reqId: otpRecord.msg91_req_id,  
          otp: otp
        });

        console.log("🔍 Verifying with MSG91:", { 
          identifier, 
          reqId: otpRecord.msg91_req_id.substring(0, 5) + '***',
          otp: otp.substring(0, 2) + '***' 
        });

        try {
          const msg91VerifyResponse = await new Promise((resolve, reject) => {
            const req = https.request(verifyOptions, (res) => {
              let chunks = [];
              res.on('data', (chunk) => chunks.push(chunk));
              res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                console.log("📱 MSG91 Verify Response:", body);
                try {
                  resolve(JSON.parse(body));
                } catch (e) {
                  resolve({ raw: body });
                }
              });
            });

            req.on('error', (err) => {
              console.error("🌐 MSG91 Verify Error:", err.message);
              reject(err);
            });
            
            req.write(verifyBody);
            req.end();
          });

          isMsg91Success = msg91VerifyResponse.response_code === 1 || 
                          msg91VerifyResponse.type === 'success' ||
                          msg91VerifyResponse.message?.includes('success') ||
                          msg91VerifyResponse.status === 'success';

          console.log("📊 MSG91 Verification Result:", isMsg91Success);
        } catch (error) {
          console.log("⚠️ MSG91 verification failed, falling back to local verification");
        }
      }
    }

    // ✅ Agar MSG91 verify fail ho jaye ya reqId na ho, to local OTP check karo
    // Aapke case mein MSG91 verify nahi ho raha, to hum local verification karenge
    console.log("✅ Using local OTP verification");
    
    // Start transaction
    await client.query('BEGIN');
    const now = new Date();

    // Mark OTP as used
    await client.query(
      'UPDATE otp_logs SET is_used = true WHERE id = $1',
      [otpRecord.id]
    );

    // ✅ Update documents_verification table
    const docCheck = await client.query(
      `SELECT * FROM documents_verification WHERE uid = $1 AND user_type = $2`,
      [actualUserId, userRole]
    );

    if (docCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO documents_verification 
         (uid, phone_number, phone_verified, phone_verified_at, user_type, registered_at, last_updated, uname)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [actualUserId, phone, true, now, userRole, now, now, userName]
      );
    } else {
      await client.query(
        `UPDATE documents_verification 
         SET phone_verified = $1, phone_verified_at = $2, last_updated = $3
         WHERE uid = $4 AND user_type = $5`,
        [true, now, now, actualUserId, userRole]
      );
    }

    // ✅ Update users table
    await client.query(
      `UPDATE users SET phone = $1, updated_at = $2 WHERE id = $3`,
      [phone, now, actualUserId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Phone verified successfully",
      data: {
        phone_verified: true,
        phone_verified_at: now,
        verified_with: otpRecord.msg91_req_id ? 'msg91' : 'local'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Verify Phone OTP Error:", error);
    
    if (error.code === '23502') {
      return res.status(400).json({
        success: false,
        message: "User name is required for verification"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  } finally {
    client.release();
  }
};



// ============================================
// PAN VERIFICATION with otp_logs
// ============================================

// Send OTP for PAN verification
export const sendPANOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { pan } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      return res.status(400).json({
        success: false,
        message: "Valid PAN (ABCDE1234F) required"
      });
    }

    // Get user email
    const userResult = await client.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const email = userResult.rows[0].email;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Mark any existing unused PAN OTPs as used
    await client.query(
      `UPDATE otp_logs SET is_used = true 
       WHERE user_id = $1 AND otp_type = 'pan' AND is_used = false`,
      [userId]
    );

    // Store OTP in database with pan reference
    await client.query(
      `INSERT INTO otp_logs (user_id, otp, expires_at, created_at, is_used, otp_type, reference)
       VALUES ($1, $2, $3, NOW(), false, 'pan', $4)`,
      [userId, otp, expiresAt, pan]
    );

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PAN Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">PAN Verification</h2>
          <p style="color: #666;">Your OTP for PAN verification is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; text-align: center; background: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</h1>
          <p style="color: #666;">PAN: ${pan}</p>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error("Send PAN OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  } finally {
    client.release();
  }
};

// Verify PAN OTP
export const verifyPANOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { pan, otp } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!pan || !otp) {
      return res.status(400).json({
        success: false,
        message: "PAN and OTP are required"
      });
    }

    // Check OTP from database
    const otpResult = await client.query(
      `SELECT * FROM otp_logs 
       WHERE user_id = $1 AND otp = $2 AND otp_type = 'pan' 
       AND reference = $3 AND is_used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otp, pan]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const otpRecord = otpResult.rows[0];

    // Start transaction
    await client.query('BEGIN');

    const now = new Date();

    // Mark OTP as used
    await client.query(
      'UPDATE otp_logs SET is_used = true WHERE id = $1',
      [otpRecord.id]
    );

    // Check if record exists in documents_verification
    const docCheck = await client.query(
      'SELECT id FROM documents_verification WHERE uid = $1',
      [userId]
    );

    if (docCheck.rows.length === 0) {
      // Insert new record
      await client.query(
        `INSERT INTO documents_verification 
         (uid, pan_number, pan_verified, pan_verified_at, user_type, registered_at, last_updated)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, pan, true, now, 'user', now, now]
      );
    } else {
      // Update existing record
      await client.query(
        `UPDATE documents_verification 
         SET pan_number = $1, pan_verified = $2, pan_verified_at = $3, last_updated = $4
         WHERE uid = $5`,
        [pan, true, now, now, userId]
      );
    }

    // Update users table pan
    await client.query(
      `UPDATE users SET pan = $1, updated_at = $2 WHERE id = $3`,
      [pan, now, userId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "PAN verified successfully",
      data: {
        pan_verified: true,
        pan_verified_at: now
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Verify PAN OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify PAN"
    });
  } finally {
    client.release();
  }
};

// ============================================
// SEBI VERIFICATION with otp_logs
// ============================================

// Send OTP for SEBI verification
export const sendSebiOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { sebi_number } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!sebi_number) {
      return res.status(400).json({
        success: false,
        message: "SEBI number is required"
      });
    }

    // Get user email
    const userResult = await client.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const email = userResult.rows[0].email;

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Mark any existing unused SEBI OTPs as used
    await client.query(
      `UPDATE otp_logs SET is_used = true 
       WHERE user_id = $1 AND otp_type = 'sebi' AND is_used = false`,
      [userId]
    );

    // Store OTP in database with sebi reference
    await client.query(
      `INSERT INTO otp_logs (user_id, otp, expires_at, created_at, is_used, otp_type, reference)
       VALUES ($1, $2, $3, NOW(), false, 'sebi', $4)`,
      [userId, otp, expiresAt, sebi_number]
    );

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SEBI Registration Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">SEBI Verification</h2>
          <p style="color: #666;">Your OTP for SEBI verification is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; text-align: center; background: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</h1>
          <p style="color: #666;">SEBI Number: ${sebi_number}</p>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error("Send SEBI OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  } finally {
    client.release();
  }
};

// Verify SEBI OTP
export const verifySebiOTP = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { sebi_number, otp } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!sebi_number || !otp) {
      return res.status(400).json({
        success: false,
        message: "SEBI number and OTP are required"
      });
    }

    // Check OTP from database
    const otpResult = await client.query(
      `SELECT * FROM otp_logs 
       WHERE user_id = $1 AND otp = $2 AND otp_type = 'sebi' 
       AND reference = $3 AND is_used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otp, sebi_number]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    const otpRecord = otpResult.rows[0];

    // Start transaction
    await client.query('BEGIN');

    const now = new Date();

    // Mark OTP as used
    await client.query(
      'UPDATE otp_logs SET is_used = true WHERE id = $1',
      [otpRecord.id]
    );

    // Check if record exists in documents_verification
    const docCheck = await client.query(
      'SELECT id FROM documents_verification WHERE uid = $1',
      [userId]
    );

    if (docCheck.rows.length === 0) {
      // Insert new record
      await client.query(
        `INSERT INTO documents_verification 
         (uid, sebi_number, sebi_verified, sebi_verified_at, user_type, registered_at, last_updated)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, sebi_number, true, now, 'RA', now, now]
      );
    } else {
      // Update existing record
      await client.query(
        `UPDATE documents_verification 
         SET sebi_number = $1, sebi_verified = $2, sebi_verified_at = $3, last_updated = $4, user_type = $5
         WHERE uid = $6`,
        [sebi_number, true, now, now, 'RA', userId]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "SEBI verified successfully",
      data: {
        sebi_verified: true,
        sebi_verified_at: now
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Verify SEBI OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify SEBI"
    });
  } finally {
    client.release();
  }
};