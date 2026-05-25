// import crypto from 'crypto'
// import bcrypt from "bcrypt";
// import { pool } from '../db.js';
// import { signToken } from "../middleware/auth.js";
// import { sendResetPasswordMail, sendOTPEmail, sendPasswordEmail } from "../utils/sendPasswordResetMail.js";
// import jwt from 'jsonwebtoken';


// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const generateRandomPassword = () => {
//   return crypto.randomBytes(10).toString('hex');
// };

// // ================================= admin login ============================================
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email/UserID and password are required"
//       });
//     }

//     const loginValue = email.toLowerCase();
//     let user = null;
//     let role = null;

//     /* ============================
//        1️⃣ FIRST: Check USER table
//     ============================ */
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [loginValue]
//     );

//     if (userResult.rows.length > 0) {
//       user = userResult.rows[0];
//       role = user.role || "user"; // admin / user
//     }

//     /* ============================
//        2️⃣ SECOND: If not found → RA table
//     ============================ */
//     if (!user) {
//       const raResult = await pool.query(
//         `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
//         [loginValue, loginValue]
//       );

//       if (raResult.rows.length > 0) {
//         user = raResult.rows[0];
//         role = "ra";
//       }
//     }

//     /* ============================
//        3️⃣ If still not found
//     ============================ */
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     /* ============================
//        4️⃣ Password check
//     ============================ */
//     if (!user.password_hash) {
//       return res.status(400).json({
//         success: false,
//         message: "Password not set. Contact administrator."
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     /* ============================
//        5️⃣ Generate JWT
//     ============================ */
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         role,
//         isAdmin: role === "admin",
//         isRA: role === "ra"
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     /* ============================
//        6️⃣ Response
//     ============================ */
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role,
//         isAdmin: role === "admin",
//         isRA: role === "ra"
//       }
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// // ================================= seed ============================================
// export const seedAdmin = async (_req, res) => {
//   try {
//     const email = "admin@investbay.com";
//     const defaultPassword = "Admin@123";
//     const defaultNumber="8965029288"

//     // =========================
//     // 1️⃣ Check if admin exists
//     // =========================
//     const existsResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (existsResult.rows.length > 0) {
//       const exists = existsResult.rows[0];
//       return res.json({
//         success: true,
//         message: "Admin already exists",
//         admin: {
//           email: exists.email,
//           role: exists.role,
//           password: defaultPassword ,
//           phone:defaultNumber
//         }
//       });
//     }

//     // =========================
//     // 2️⃣ Hash the password
//     // =========================
//     const passwordHash = await bcrypt.hash(defaultPassword, 10);

//     // =========================
//     // 3️⃣ Insert admin into DB
//     // =========================
//     const insertResult = await pool.query(
//       `INSERT INTO users 
//       (email, password_hash, name, phone, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
//       RETURNING id, email, role`,
//       [
//         email,
//         passwordHash,
//         "System Administrator",
//         defaultNumber, 
//         null, // gender
//         null, // dob
//         null, // pan
//         null, // state
//         "email", // auth_provider
//         "admin", // role
//         null, // reset_code
//         null, // reset_code_expiry
//         true // is_verified
//       ]
//     );

//     const adminUser = insertResult.rows[0];

//     console.log("Admin created with ID:", adminUser.id);

//     // =========================
//     // 4️⃣ Response
//     // =========================
//     res.json({
//       success: true,
//       message: "Admin created successfully",
//       admin: {
//         id: adminUser.id,
//         email: adminUser.email,
//         role: adminUser.role,
//         password: defaultPassword,
//         phone:defaultNumber
//       }
//     });

//   } catch (e) {
//     console.error("Seed admin error:", e);
//     res.status(500).json({
//       success: false,
//       message: "Seed failed: " + e.message
//     });
//   }
// };

// // ==================================== login =============================================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email/UserId and password required" });
//     }

//     const loginValue = email.toLowerCase();
//     let user = null;
//     let passwordHash = null;
//     let role = null;

//     // ==========================
//     // 1️⃣ Check User table first
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [loginValue]
//     );

//     if (userResult.rows.length > 0) {
//       user = userResult.rows[0];
//       passwordHash = user.password_hash;
//       role = user.role || "user";
//     }

//     // ==========================
//     // 2️⃣ If not found, check ResearchAnalyst table
//     // ==========================
//     if (!user) {
//       const raResult = await pool.query(
//         `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
//         [loginValue, loginValue]
//       );

//       if (raResult.rows.length > 0) {
//         user = raResult.rows[0];
//         passwordHash = user.password; // RA table uses 'password'
//         role = "ra";
//       }
//     }

//     // ==========================
//     // 3️⃣ If still not found
//     // ==========================
//     if (!user || !passwordHash) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ==========================
//     // 4️⃣ Compare password
//     // ==========================
//     const ok = await bcrypt.compare(password, passwordHash);
//     if (!ok) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ==========================
//     // 5️⃣ Generate JWT
//     // ==========================
//     const token = signToken({
//       id: user.id,
//       email: user.email,
//       role,
//       isAdmin: role === "admin",
//       isRA: role === "ra",
//     });

//     // ==========================
//     // 6️⃣ Response
//     // ==========================
//     return res.json({
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: role,
//         image: user.profile_image || null,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ===================================== me ==========================================
// export const me = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // req.user already has id, email, role, isAdmin, isRA from JWT
//     return res.json({
//       user: {
//         id: req.user.id,
//         email: req.user.email,
//         role: req.user.role,
//         isAdmin: req.user.isAdmin,
//         isRA: req.user.isRA
//       }
//     });
//   } catch (err) {
//     console.error("Me endpoint error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ================================== forgot password ===================================
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body || {};
//     if (!email) {
//       return res.status(400).json({ message: "Email required" });
//     }

//     // ==========================
//     // 1️⃣ Get RA user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Already active OTP check
//     // ==========================
//     if (user.reset_code_expiry && new Date(user.reset_code_expiry) > new Date()) {
//       return res.status(429).json({
//         message: "OTP already sent. Please wait before requesting again",
//       });
//     }

//     // ==========================
//     // 3️⃣ Generate 4-digit OTP
//     // ==========================
//     const code = Math.floor(1000 + Math.random() * 9000).toString();
//     const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//     // ==========================
//     // 4️⃣ Update user record
//     // ==========================
//     await pool.query(
//       `UPDATE research_analysts
//        SET reset_code = $1,
//            reset_code_expiry = $2,
//            updated_at = NOW()
//        WHERE id = $3`,
//       [code, expiry, user.id]
//     );

//     // ==========================
//     // 5️⃣ Send email
//     // ==========================
//     await sendResetPasswordMail(email, code);

//     res.json({ message: "Verification code sent", email });

//   } catch (err) {
//     console.error("Forgot password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ==================================== verify code =============================
// export const verifyCode = async (req, res) => {
//   try {
//     const { email, code } = req.body || {};

//     if (!email || !code) {
//       return res.status(400).json({ message: "Email & code required" });
//     }

//     // ==========================
//     // 1️⃣ Fetch user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({ message: "Invalid or expired code" });
//     }

//     const user = userResult.rows[0];

//     if (!user.reset_code || !user.reset_code_expiry) {
//       return res.status(400).json({ message: "Invalid or expired code" });
//     }

//     const now = Date.now();
//     const expiry = new Date(user.reset_code_expiry).getTime();

//     if (user.reset_code !== String(code)) {
//       return res.status(400).json({ message: "Invalid code" });
//     }

//     if (expiry < now) {
//       return res.status(400).json({ message: "Code expired" });
//     }

//     // ==========================
//     // 2️⃣ Clear OTP after success
//     // ==========================
//     await pool.query(
//       `UPDATE research_analysts
//        SET reset_code = NULL,
//            reset_code_expiry = NULL,
//            updated_at = NOW()
//        WHERE id = $1`,
//       [user.id]
//     );

//     res.json({ message: "Code verified" });

//   } catch (err) {
//     console.error("Verify code error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ================================== update password =================================
// export const updatePassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body || {};

//     if (!email || !newPassword) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     // ==========================
//     // 1️⃣ Fetch user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Hash the new password
//     // ==========================
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // ==========================
//     // 3️⃣ Update password & clear OTP
//     // ==========================
//     await pool.query(
//       `UPDATE research_analysts
//        SET password = $1,
//            reset_code = NULL,
//            reset_code_expiry = NULL,
//            updated_at = NOW()
//        WHERE id = $2`,
//       [hashedPassword, user.id]
//     );

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     console.error("Update password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };





// // ================================ register with profile ===============================
// // export const registerWithProfile = async (req, res) => {
// //   console.log('Registration started...');

// //   try {
// //     const { name, email, gender, dob, pan, state, phone } = req.body;

   

// //     // ==========================
// //     // 1️⃣ Validation
// //     // ==========================
// //     const errors = [];

// //     if (!name || !name.trim()) errors.push('Name is required');
// //     if (!email || !email.includes('@')) errors.push('Valid email is required');
// //     if (!gender) errors.push('Gender is required');
// //     if (!dob) errors.push('Date of birth is required');
    
// //     // Phone validation - Required + exactly 10 digits
// //     if (!phone) {
// //       errors.push('Phone number is required');
// //     } else if (!/^[0-9]{10}$/.test(phone)) {
// //       errors.push('Phone number must be exactly 10 digits (e.g., 9876543210)');
// //     }
    
// //     if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
// //       errors.push('Valid PAN card number is required (e.g., ABCDE1234F)');
// //     }
// //     if (!state || !state.trim()) errors.push('State is required');

// //     // Age validation (18+)
// //     if (dob) {
// //       const birthDate = new Date(dob);
// //       const today = new Date();
// //       let age = today.getFullYear() - birthDate.getFullYear();
// //       const monthDiff = today.getMonth() - birthDate.getMonth();
// //       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
// //       if (age < 18) errors.push('You must be at least 18 years old to register');
// //     }

// //     if (errors.length > 0) {
// //       return res.status(400).json({ success: false, message: errors.join(', ') });
// //     }

// //     // ==========================
// //     // 2️⃣ Check email uniqueness
// //     // ==========================
// //     const emailCheck = await pool.query(
// //       `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
// //       [email.toLowerCase()]
// //     );
// //     if (emailCheck.rows.length > 0) {
// //       return res.status(400).json({ success: false, message: 'Email already registered' });
// //     }

// //     // ==========================
// //     // 3️⃣ Check PAN uniqueness
// //     // ==========================
// //     const panCheck = await pool.query(
// //       `SELECT id FROM users WHERE UPPER(pan) = $1 LIMIT 1`,
// //       [pan.toUpperCase()]
// //     );
// //     if (panCheck.rows.length > 0) {
// //       return res.status(400).json({ success: false, message: 'PAN card already registered' });
// //     }

// //     // ==========================
// //     // 4️⃣ Check Phone uniqueness
// //     // ==========================
// //     const phoneCheck = await pool.query(
// //       `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
// //       [phone]
// //     );
// //     if (phoneCheck.rows.length > 0) {
// //       return res.status(400).json({ success: false, message: 'Phone number already registered' });
// //     }

// //     // ==========================
// //     // 5️⃣ Generate random password & hash
// //     // ==========================
// //     const randomPassword = generateRandomPassword();
// //     console.log('Generated password for', email, ':', randomPassword);
// //     const passwordHash = await bcrypt.hash(randomPassword, 10);

// //     // ==========================
// //     // 6️⃣ Generate OTP
// //     // ==========================
// //     const otp = generateOTP();
// //     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

// //     // ==========================
// //     // 7️⃣ Insert new user (Phone included)
// //     // ==========================
// //     const insertResult = await pool.query(
// //       `INSERT INTO users 
// //        (email, name, phone, password_hash, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
// //        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
// //        RETURNING id, email, name, phone`,
// //       [
// //         email.toLowerCase().trim(),
// //         name.trim(),
// //         phone,  // ✅ Phone now saved
// //         passwordHash,
// //         gender,
// //         new Date(dob),
// //         pan.toUpperCase().trim(),
// //         state.trim(),
// //         'email',
// //         'user',
// //         otp,
// //         otpExpiry,
// //         false
// //       ]
// //     );

// //     const newUser = insertResult.rows[0];
// //     console.log('User created successfully with ID:', newUser.id);

// //     // // ==========================
// //     // // 8️⃣ Send Emails
// //     // // ==========================
// //     // const passwordEmailSent = await sendPasswordEmail(email, randomPassword, name);
// //     // const otpEmailSent = await sendOTPEmail(email, otp);

// //     // if (!passwordEmailSent || !otpEmailSent) {
// //     //   // Delete user if email fails
// //     //   await pool.query(`DELETE FROM users WHERE id = $1`, [newUser.id]);
// //     //   return res.status(500).json({ success: false, message: 'Failed to send emails. Please try again.' });
// //     // }

// //     // ==========================
// //     // 9️⃣ Response
// //     // ==========================
// //     res.status(201).json({
// //       success: true,
// //       message: 'Registration successful.',
// //       user: {
// //         id: newUser.id,
// //         email: newUser.email,
// //         name: newUser.name,
// //         phone: newUser.phone  
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Error in registerWithProfile:', error);
// //     res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
// //   }
// // };



// export const registerWithProfile = async (req, res) => {
//   console.log('Registration started...');
//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');
    
//     const { name, email, gender, dob, pan, state, phone } = req.body;

//     // ==========================
//     // 1️⃣ Validation
//     // ==========================
//     const errors = [];

//     if (!name || !name.trim()) errors.push('Name is required');
//     if (!email || !email.includes('@')) errors.push('Valid email is required');
//     if (!gender) errors.push('Gender is required');
//     if (!dob) errors.push('Date of birth is required');
    
//     // Phone validation
//     if (!phone) {
//       errors.push('Phone number is required');
//     } else if (!/^[0-9]{10}$/.test(phone)) {
//       errors.push('Phone number must be exactly 10 digits (e.g., 9876543210)');
//     }
    
//     if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
//       errors.push('Valid PAN card number is required (e.g., ABCDE1234F)');
//     }
//     if (!state || !state.trim()) errors.push('State is required');

//     // Age validation (18+)
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
//       if (age < 18) errors.push('You must be at least 18 years old to register');
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, message: errors.join(', ') });
//     }

//     const trimmedName = name.trim();
//     const trimmedEmail = email.toLowerCase().trim();
//     const formattedPan = pan.toUpperCase().trim();

//     // ==========================
//     // 2️⃣ Check email uniqueness
//     // ==========================
//     const emailCheck = await client.query(
//       `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [trimmedEmail]
//     );
//     if (emailCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     // Check in documents_verification table
//     const emailVerificationCheck = await client.query(
//       `SELECT uid FROM documents_verification WHERE LOWER(email) = $1 LIMIT 1`,
//       [trimmedEmail]
//     );
//     if (emailVerificationCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'Email already exists in system' });
//     }

//     // ==========================
//     // 3️⃣ Check PAN uniqueness
//     // ==========================
//     const panCheck = await client.query(
//       `SELECT id FROM users WHERE UPPER(pan) = $1 LIMIT 1`,
//       [formattedPan]
//     );
//     if (panCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'PAN card already registered' });
//     }

//     const panVerificationCheck = await client.query(
//       `SELECT uid FROM documents_verification WHERE pan_number = $1 LIMIT 1`,
//       [formattedPan]
//     );
//     if (panVerificationCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'PAN number already exists in system' });
//     }

//     // ==========================
//     // 4️⃣ Check Phone uniqueness
//     // ==========================
//     const phoneCheck = await client.query(
//       `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
//       [phone]
//     );
//     if (phoneCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'Phone number already registered' });
//     }

//     const phoneVerificationCheck = await client.query(
//       `SELECT uid FROM documents_verification WHERE phone_number = $1 LIMIT 1`,
//       [phone]
//     );
//     if (phoneVerificationCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(400).json({ success: false, message: 'Phone number already exists in system' });
//     }

//     // ==========================
//     // 5️⃣ Generate random password & hash
//     // ==========================
//     const randomPassword = generateRandomPassword();
//     console.log('Generated password for', trimmedEmail, ':', randomPassword);
//     const passwordHash = await bcrypt.hash(randomPassword, 10);

//     // ==========================
//     // 6️⃣ Generate OTP
//     // ==========================
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     // ==========================
//     // 7️⃣ Insert new user into users table
//     // ==========================
//     const insertResult = await client.query(
//       `INSERT INTO users 
//        (email, name, phone, password_hash, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
//        RETURNING id, email, name, phone, pan`,
//       [
//         trimmedEmail,
//         trimmedName,
//         phone,
//         passwordHash,
//         gender,
//         new Date(dob),
//         formattedPan,
//         state.trim(),
//         'email',
//         'user',
//         otp,
//         otpExpiry,
//         false
//       ]
//     );

//     const newUser = insertResult.rows[0];
//     console.log('User created successfully with ID:', newUser.id);

//     // ==========================
//     // 8️⃣ Insert into documents_verification table WITH user_type
//     // ==========================
//     const verificationUid = newUser.id;

//     const insertVerificationQuery = `
//       INSERT INTO documents_verification (
//         uid,
//         user_type,        -- Column 2
//         uname,            -- Column 3
//         email,            -- Column 4
//         phone_number,     -- Column 5
//         pan_number,       -- Column 6
//         sebi_number,      -- Column 7
//         phone_verified,   -- Column 8
//         pan_verified,     -- Column 9
//         sebi_verified,    -- Column 10
//         phone_verified_at,-- Column 11
//         pan_verified_at,  -- Column 12
//         sebi_verified_at, -- Column 13
//         date_of_birth,    -- Column 14
//         address,          -- Column 15
//         registered_at,    -- Column 16
//         last_updated      -- Column 17
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
//       RETURNING id
//     `;

//     const verificationValues = [
//       verificationUid,      // $1: uid
//       'user',               // $2: user_type = 'user'
//       trimmedName,          // $3: uname
//       trimmedEmail,         // $4: email
//       phone,                // $5: phone_number
//       formattedPan,         // $6: pan_number
//       null,                 // $7: sebi_number
//       false,                // $8: phone_verified
//       false,                // $9: pan_verified
//       null,                 // $10: sebi_verified
//       null,                 // $11: phone_verified_at
//       null,                 // $12: pan_verified_at
//       null,                 // $13: sebi_verified_at
//       new Date(dob),        // $14: date_of_birth
//       state.trim()          // $15: address
//     ];

//     await client.query(insertVerificationQuery, verificationValues);
//     console.log('Documents verification entry created for user ID:', newUser.id);

//     await client.query('COMMIT');

//     // ==========================
//     // 9️⃣ Response
//     // ==========================
//     res.status(201).json({
//       success: true,
//       message: 'Registration successful. Documents require verification.',
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         name: newUser.name,
//         phone: newUser.phone,
//         pan: newUser.pan
//       },
//       verificationStatus: {
//         phoneVerified: false,
//         panVerified: false,
//         sebiVerified: null,
//         overallStatus: 'pending_verification'
//       }
//     });

//   } catch (error) {
//     await client.query('ROLLBACK').catch(rollbackError => {
//       console.error('Rollback error:', rollbackError);
//     });
    
//     console.error('Error in registerWithProfile:', error);
    
//     if (error.code === '23505') {
//       let message = 'Duplicate entry detected. ';
      
//       if (error.constraint) {
//         if (error.constraint.includes('email')) {
//           message += 'Email already exists.';
//         } else if (error.constraint.includes('phone')) {
//           message += 'Phone number already exists.';
//         } else if (error.constraint.includes('pan')) {
//           message += 'PAN number already exists.';
//         } else if (error.constraint.includes('sebi')) {
//           message += 'SEBI number already exists.';
//         } else if (error.constraint.includes('unique_uid_per_type')) {
//           message += 'User already has a verification record.';
//         }
//       }
      
//       return res.status(409).json({ 
//         success: false, 
//         message 
//       });
//     }
    
//     res.status(500).json({ 
//       success: false, 
//       message: 'Internal server error: ' + (process.env.NODE_ENV === 'development' ? error.message : 'Please try again later') 
//     });
//   } finally {
//     client.release();
//   }
// };




// // =================================== check & send otp for login ==============================
// export const checkAndSendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.includes('@')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid email is required'
//       });
//     }

//     // ==========================
//     // 1️⃣ Find user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found. Please register first.',
//         userExists: false
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Generate OTP & expiry
//     // ==========================
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     // ==========================
//     // 3️⃣ Update user with OTP
//     // ==========================
//     await pool.query(
//       `UPDATE users 
//        SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
//        WHERE id = $3`,
//       [otp, otpExpiry, user.id]
//     );

//     // ==========================
//     // 4️⃣ Send OTP email
//     // ==========================
//     const emailSent = await sendOTPEmail(email, otp);

//     if (!emailSent) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to send OTP email'
//       });
//     }

//     // ==========================
//     // 5️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: user.is_verified
//         ? 'OTP sent successfully to your email'
//         : 'OTP sent to verify your account',
//       userExists: true,
//       isVerified: user.is_verified,
//       email
//     });

//   } catch (error) {
//     console.error('Error in checkAndSendOTP:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // =================================== verify otp and login ======================================
// export const verifyOTPAndLogin = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     console.log('Verifying OTP for:', email);

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and OTP are required'
//       });
//     }

//     // ==========================
//     // 1️⃣ Find user with valid OTP
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users 
//        WHERE LOWER(email) = $1 
//          AND reset_code = $2 
//          AND reset_code_expiry > NOW()
//        LIMIT 1`,
//       [email.toLowerCase(), otp]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP or OTP expired'
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Clear OTP & mark verified
//     // ==========================
//     const isVerified = user.is_verified || true; // mark verified if first login

//     await pool.query(
//       `UPDATE users
//        SET reset_code = NULL,
//            reset_code_expiry = NULL,
//            is_verified = $1,
//            updated_at = NOW()
//        WHERE id = $2`,
//       [isVerified, user.id]
//     );

//     // ==========================
//     // 3️⃣ Generate JWT token
//     // ==========================
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         pan: user.pan
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // ==========================
//     // 4️⃣ Set cookie (optional)
//     // ==========================
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     // ==========================
//     // 5️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         gender: user.gender,
//         dob: user.dob,
//         pan: user.pan,
//         state: user.state,
//         role: user.role,
//         isVerified: true
//       }
//     });

//   } catch (error) {
//     console.error('Error in verifyOTPAndLogin:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // ====================================== resend otp =====================================
// export const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.includes('@')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid email is required'
//       });
//     }

//     // ==========================
//     // 1️⃣ Find user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users 
//        WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Prevent spam: OTP sent less than 1 min ago
//     // ==========================
//     if (user.reset_code_expiry && new Date(user.reset_code_expiry) > new Date(Date.now() - 60 * 1000)) {
//       return res.status(429).json({
//         success: false,
//         message: 'Please wait 1 minute before requesting new OTP'
//       });
//     }

//     // ==========================
//     // 3️⃣ Generate new OTP & expiry
//     // ==========================
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // ==========================
//     // 4️⃣ Update user with new OTP
//     // ==========================
//     await pool.query(
//       `UPDATE users 
//        SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
//        WHERE id = $3`,
//       [otp, otpExpiry, user.id]
//     );

//     // ==========================
//     // 5️⃣ Send OTP email
//     // ==========================
//     const emailSent = await sendOTPEmail(email, otp);

//     if (!emailSent) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to send OTP email'
//       });
//     }

//     // ==========================
//     // 6️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: 'New OTP sent successfully to your email',
//       email
//     });

//   } catch (error) {
//     console.error('Error in resendOTP:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // ================================ login with password alternative ====================================
// export const loginWithPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     // ==========================
//     // 1️⃣ Find user by email
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Check if password exists
//     // ==========================
//     if (!user.password_hash) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please login with OTP method'
//       });
//     }

//     // ==========================
//     // 3️⃣ Verify password
//     // ==========================
//     const isValidPassword = await bcrypt.compare(password, user.password_hash);
//     if (!isValidPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // ==========================
//     // 4️⃣ Check if user is verified
//     // ==========================
//     if (!user.is_verified) {
//       const otp = generateOTP();
//       const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//       // Update user with OTP
//       await pool.query(
//         `UPDATE users 
//          SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
//          WHERE id = $3`,
//         [otp, otpExpiry, user.id]
//       );

//       await sendOTPEmail(email, otp);

//       return res.status(200).json({
//         success: false,
//         message: 'Account not verified. OTP sent to your email.',
//         requiresOTP: true,
//         email
//       });
//     }

//     // ==========================
//     // 5️⃣ Generate JWT
//     // ==========================
//     const token = jwt.sign(
//       { 
//         userId: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         pan: user.pan
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // ==========================
//     // 6️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         gender: user.gender,
//         dob: user.dob,
//         pan: user.pan,
//         state: user.state,
//         role: user.role,
//         isVerified: user.is_verified
//       }
//     });

//   } catch (error) {
//     console.error('Error in loginWithPassword:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // =============================== set password after opt verification =====================================
// export const setPassword = async (req, res) => {
//   try {
//     const { email, newPassword, confirmPassword } = req.body;

//     // ==========================
//     // 1️⃣ Validate inputs
//     // ==========================
//     if (!email || !email.includes('@')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid email is required'
//       });
//     }

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'Password must be at least 6 characters'
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Passwords do not match'
//       });
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
//       });
//     }

//     // ==========================
//     // 2️⃣ Find user
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
//       [email.toLowerCase()]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 3️⃣ Check if verified
//     // ==========================
//     if (!user.is_verified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please verify your email first before setting password'
//       });
//     }

//     // ==========================
//     // 4️⃣ Check if new password same as old
//     // ==========================
//     if (user.password_hash) {
//       const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
//       if (isSamePassword) {
//         return res.status(400).json({
//           success: false,
//           message: 'New password cannot be same as old password'
//         });
//       }
//     }

//     // ==========================
//     // 5️⃣ Hash new password
//     // ==========================
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // ==========================
//     // 6️⃣ Update password in DB
//     // ==========================
//     await pool.query(
//       `UPDATE users 
//        SET password_hash = $1, updated_at = NOW() 
//        WHERE id = $2`,
//       [hashedPassword, user.id]
//     );

//     console.log(`Password updated for user: ${email}`);

//     res.json({
//       success: true,
//       message: 'Password set successfully. You can now login with your new password.'
//     });

//   } catch (error) {
//     console.error('Error in setPassword:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };

// // ================================= changed password for logged in user ========================================
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;
//     const userId = req.user.id; // from auth middleware (JWT)

//     // ==========================
//     // 1️⃣ Validate inputs
//     // ==========================
//     if (!currentPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is required"
//       });
//     }

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be at least 6 characters"
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New passwords do not match"
//       });
//     }

//     // Password strength
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

//     if (!passwordRegex.test(newPassword)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
//       });
//     }

//     // ==========================
//     // 2️⃣ Find user by ID
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT id, password_hash 
//        FROM users 
//        WHERE id = $1
//        LIMIT 1`,
//       [userId]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 3️⃣ Check if password exists
//     // ==========================
//     if (!user.password_hash) {
//       return res.status(400).json({
//         success: false,
//         message: "Please set your password first"
//       });
//     }

//     // ==========================
//     // 4️⃣ Verify current password
//     // ==========================
//     const isCurrentPasswordValid = await bcrypt.compare(
//       currentPassword,
//       user.password_hash
//     );

//     if (!isCurrentPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect"
//       });
//     }

//     // ==========================
//     // 5️⃣ Prevent same password
//     // ==========================
//     const isSamePassword = await bcrypt.compare(
//       newPassword,
//       user.password_hash
//     );

//     if (isSamePassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password cannot be same as current password"
//       });
//     }

//     // ==========================
//     // 6️⃣ Hash & update password
//     // ==========================
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await pool.query(
//       `UPDATE users
//        SET password_hash = $1,
//            updated_at = NOW()
//        WHERE id = $2`,
//       [hashedPassword, userId]
//     );

//     console.log(`Password changed for user ID: ${userId}`);

//     // ==========================
//     // 7️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: "Password changed successfully"
//     });

//   } catch (error) {
//     console.error("Error in changePassword:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// // =================================== request password reset =============================================
// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !email.includes("@")) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid email is required"
//       });
//     }

//     // 🔹 Find user (RAW SQL)
//     const [users] = await sequelize.query(
//       `
//       SELECT id, reset_code_expiry 
//       FROM users 
//       WHERE email = :email 
//       AND auth_provider = 'email'
//       `,
//       {
//         replacements: { email: email.toLowerCase() },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     if (!users) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // 🔹 Check OTP resend cooldown
//     if (
//       users.reset_code_expiry &&
//       new Date(users.reset_code_expiry) >
//         new Date(Date.now() - 1 * 60 * 1000)
//     ) {
//       return res.status(429).json({
//         success: false,
//         message: "Please wait 1 minute before requesting new OTP"
//       });
//     }

//     // 🔹 Generate OTP
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     // 🔹 Update OTP (RAW SQL)
//     await sequelize.query(
//       `
//       UPDATE users 
//       SET reset_code = :otp,
//           reset_code_expiry = :expiry
//       WHERE id = :id
//       `,
//       {
//         replacements: {
//           otp,
//           expiry: otpExpiry,
//           id: users.id
//         }
//       }
//     );

//     // 🔹 Send OTP email
//     const emailSent = await sendOTPEmail(email, otp);

//     if (!emailSent) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send OTP email"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Password reset OTP sent to your email",
//       email
//     });
//   } catch (error) {
//     console.error("Error in requestPasswordReset:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// // ===================================== reset password with otp ===================================
// export const resetPasswordWithOTP = async (req, res) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     // Validate inputs
//     if (!email || !email.includes("@")) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid email is required"
//       });
//     }

//     if (!otp || otp.length !== 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid 6-digit OTP is required"
//       });
//     }

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters"
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match"
//       });
//     }

//     // 🔹 Find user with valid OTP (RAW SQL)
//     const [user] = await sequelize.query(
//       `
//       SELECT id 
//       FROM users
//       WHERE email = :email
//         AND reset_code = :otp
//         AND reset_code_expiry > NOW()
//       `,
//       {
//         replacements: {
//           email: email.toLowerCase(),
//           otp
//         },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP or OTP expired"
//       });
//     }

//     // 🔹 Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // 🔹 Update password & clear OTP (RAW SQL)
//     await sequelize.query(
//       `
//       UPDATE users
//       SET password_hash = :password,
//           reset_code = NULL,
//           reset_code_expiry = NULL
//       WHERE id = :id
//       `,
//       {
//         replacements: {
//           password: hashedPassword,
//           id: user.id
//         }
//       }
//     );

//     console.log(`Password reset for user: ${email}`);

//     res.json({
//       success: true,
//       message:
//         "Password reset successfully. You can now login with your new password."
//     });
//   } catch (error) {
//     console.error("Error in resetPasswordWithOTP:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };



// // ------------------------------------------------------------------------------------


// // Updated controllers to use documents_verification table directly (NO otps table needed)

// // Send Phone OTP
// export const sendPhoneOTP = async (req, res) => {
//     const client = await pool.connect();
    
//     try {
//         const { phone } = req.body;
//         const userId = req.user.id;

//         if (!phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Phone number is required'
//             });
//         }

//         // Validate Indian phone number
//         const phoneRegex = /^[6-9]\d{9}$/;
//         if (!phoneRegex.test(phone)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid Indian phone number'
//             });
//         }

//         await client.query('BEGIN');

//         // Check if user exists in documents_verification
//         const userCheck = await client.query(
//             'SELECT uid FROM documents_verification WHERE uid = $1',
//             [userId]
//         );

//         if (userCheck.rows.length === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found in documents verification'
//             });
//         }

//         const otp = generateOTP();
//         const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//         // Store OTP temporarily in a simple session/cache (Redis/Memory)
//         // For demo, we'll just generate and send - no DB storage needed
//         // In production, use Redis: redis.setex(`phone_otp_${userId}`, 600, otp);

//         // Message91 configuration
//         const message91Config = {
//             authkey: process.env.MESSAGE91_AUTH_KEY,
//             template_id: process.env.MESSAGE91_OTP_TEMPLATE_ID,
//             mobile: `91${phone}`,
//             otp: otp,
//             otp_length: 6,
//             otp_expiry: 10
//         };

//         // Send OTP via Message91
//         const response = await axios.post(
//             'https://api.msg91.com/api/v5/otp',
//             message91Config,
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         if (response.data.type === 'success') {
//             // Store OTP in memory/Redis with expiry (not in DB)
//             // redis.setex(`phone_otp_${userId}`, 600, otp);
            
//             await client.query('COMMIT');
            
//             return res.status(200).json({
//                 success: true,
//                 message: 'OTP sent successfully',
//                 data: {
//                     phone: `91${phone}`,
//                     otpSent: true
//                 }
//             });
//         } else {
//             await client.query('ROLLBACK');
//             throw new Error('Failed to send OTP via Message91');
//         }

//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Send OTP error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to send OTP',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// };

// // Verify Phone OTP
// export const verifyPhoneOTP = async (req, res) => {
//     const client = await pool.connect();
    
//     try {
//         const { phone, otp } = req.body;
//         const userId = req.user.id;

//         if (!phone || !otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Phone and OTP are required'
//             });
//         }

//         await client.query('BEGIN');

//         // Validate phone format
//         const phoneRegex = /^[6-9]\d{9}$/;
//         if (!phoneRegex.test(phone)) {
//             await client.query('ROLLBACK');
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid phone number format'
//             });
//         }

        

//         // Get stored OTP from Redis/Memory
//         // const storedOtp = redis.get(`phone_otp_${userId}`);
//         // if (!storedOtp || storedOtp !== otp) {
//         //     return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//         // }

//         // For demo - assume OTP is correct (implement Redis check in production)
//         // redis.del(`phone_otp_${userId}`);

//         // Update documents_verification table directly
//         const result = await client.query(
//             `UPDATE documents_verification 
//              SET 
//                  phone_number = $1,
//                  phone_verified = true,
//                  phone_verified_at = NOW(),
//                  last_updated = NOW()
//              WHERE uid = $2
//              RETURNING uid, phone_number, phone_verified, phone_verified_at`,
//             [`91${phone}`, userId]
//         );

//         if (result.rowCount === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         await client.query('COMMIT');

//         return res.status(200).json({
//             success: true,
//             message: 'Phone verified successfully',
//             data: {
//                 uid: result.rows[0].uid,
//                 phone_number: result.rows[0].phone_number,
//                 phone_verified: true,
//                 phone_verified_at: result.rows[0].phone_verified_at
//             }
//         });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Verify OTP error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to verify OTP',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// };

// // Send PAN OTP
// export const sendPANOTP = async (req, res) => {
//     const client = await pool.connect();
    
//     try {
//         const { pan } = req.body;
//         const userId = req.user.id;

//         if (!pan) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'PAN number is required'
//             });
//         }

//         const panUpper = pan.toUpperCase();
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//         if (!panRegex.test(panUpper)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid PAN format'
//             });
//         }

//         await client.query('BEGIN');

//         // Check if user exists
//         const userCheck = await client.query(
//             'SELECT uid FROM documents_verification WHERE uid = $1',
//             [userId]
//         );

//         if (userCheck.rows.length === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         const otp = generateOTP();
        
//         // Store OTP in memory/Redis (not DB)
//         // redis.setex(`pan_otp_${userId}`, 600, otp);

//         // In production: Integrate with Signzy/Digio to get registered mobile and send OTP
//         // For now, just generate OTP

//         await client.query('COMMIT');

//         return res.status(200).json({
//             success: true,
//             message: 'PAN OTP generated successfully',
//             data: {
//                 pan: panUpper,
//                 otpSent: true,
//                 otp: process.env.NODE_ENV === 'development' ? otp : undefined
//             }
//         });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Send PAN OTP error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to generate PAN OTP',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// };

// // Verify PAN OTP
// export const verifyPANOTP = async (req, res) => {
//     const client = await pool.connect();
    
//     try {
//         const { pan, otp } = req.body;
//         const userId = req.user.id;

//         if (!pan || !otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'PAN and OTP are required'
//             });
//         }

//         const panUpper = pan.toUpperCase();

//         await client.query('BEGIN');

//         // Validate PAN format
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//         if (!panRegex.test(panUpper)) {
//             await client.query('ROLLBACK');
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid PAN format'
//             });
//         }

//         // Verify OTP from Redis/Memory
//         // const storedOtp = redis.get(`pan_otp_${userId}`);
//         // if (!storedOtp || storedOtp !== otp) {
//         //     return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//         // }

//         // Update documents_verification table directly
//         const result = await client.query(
//             `UPDATE documents_verification 
//              SET 
//                  pan_number = $1,
//                  pan_verified = true,
//                  pan_verified_at = NOW(),
//                  last_updated = NOW()
//              WHERE uid = $2
//              RETURNING uid, pan_number, pan_verified, pan_verified_at`,
//             [panUpper, userId]
//         );

//         if (result.rowCount === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         await client.query('COMMIT');

//         return res.status(200).json({
//             success: true,
//             message: 'PAN verified successfully',
//             data: {
//                 uid: result.rows[0].uid,
//                 pan_number: result.rows[0].pan_number,
//                 pan_verified: true,
//                 pan_verified_at: result.rows[0].pan_verified_at
//             }
//         });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Verify PAN OTP error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to verify PAN OTP',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// };

// -----------------------------------------------------------old code -----------------------------------------

import crypto from 'crypto'
import bcrypt from "bcrypt";
import { pool } from '../db.js';
import { signToken } from "../middleware/auth.js";
import { sendResetPasswordMail, sendOTPEmail, sendPasswordEmail } from "../utils/sendPasswordResetMail.js";
import jwt from 'jsonwebtoken';
import { request } from 'http';


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateRandomPassword = () => {
  return crypto.randomBytes(10).toString('hex');
};

// ================================= admin login ============================================
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email/UserID and password are required"
//       });
//     }

//     const loginValue = email.toLowerCase();
//     let user = null;
//     let role = null;

//     /* ============================
//        1️⃣ FIRST: Check USER table
//     ============================ */
//     const userResult = await pool.query(
//       `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [loginValue]
//     );

//     if (userResult.rows.length > 0) {
//       user = userResult.rows[0];
//       role = user.role || "user"; // admin / user
//     }

//     /* ============================
//        2️⃣ SECOND: If not found → RA table
//     ============================ */
//     if (!user) {
//       const raResult = await pool.query(
//         `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
//         [loginValue, loginValue]
//       );

//       if (raResult.rows.length > 0) {
//         user = raResult.rows[0];
//         role = "ra";
//       }
//     }

//     /* ============================
//        3️⃣ If still not found
//     ============================ */
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     /* ============================
//        4️⃣ Password check
//     ============================ */
//     if (!user.password_hash) {
//       return res.status(400).json({
//         success: false,
//         message: "Password not set. Contact administrator."
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     /* ============================
//        5️⃣ Generate JWT
//     ============================ */
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         role,
//         isAdmin: role === "admin",
//         isRA: role === "ra"
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     /* ============================
//        6️⃣ Response
//     ============================ */
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role,
//         isAdmin: role === "admin",
//         isRA: role === "ra"
//       }
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// export const adminLogin = async (req, res) => {
//   const client = await pool.connect(); // ✅ Transaction client
  
//   try {
//     const { email, password } = req.body || {};

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email/UserID and password are required"
//       });
//     }

//     const loginValue = email.toLowerCase();
//     let user = null;
//     let role = null;

//     // 🔥 Start Transaction
//     await client.query('BEGIN');

//     try {
//       /* ============================
//          1️⃣ FIRST: Check USER table
//       ============================ */
//       const userResult = await client.query(
//         `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//         [loginValue]
//       );

//       if (userResult.rows.length > 0) {
//         user = userResult.rows[0];
//         role = user.role || "user"; // admin / user
//       }

//       /* ============================
//          2️⃣ SECOND: If not found → RA table
//       ============================ */
//       if (!user) {
//         const raResult = await client.query(
//           `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
//           [loginValue, loginValue]
//         );

//         if (raResult.rows.length > 0) {
//           user = raResult.rows[0];
//           role = "ra";
//         }
//       }

//       /* ============================
//          3️⃣ If still not found
//       ============================ */
//       if (!user) {
//         throw new Error("Invalid credentials");
//       }

//       /* ============================
//          4️⃣ Password check
//       ============================ */
//       if (!user.password_hash) {
//         throw new Error("Password not set. Contact administrator.");
//       }

//       const isMatch = await bcrypt.compare(password, user.password_hash);
//       if (!isMatch) {
//         throw new Error("Invalid credentials");
//       }

//       /* ============================
//          5️⃣ Generate JWT
//       ============================ */
//       const token = jwt.sign(
//         {
//           userId: user.id,
//           email: user.email,
//           role,
//           isAdmin: role === "admin",
//           isRA: role === "ra"
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );

//       /* 🔥 6️⃣ LOGIN LOG - Transaction Safe */
//       await client.query(`
//         INSERT INTO login_logs (user_id, ip_address, user_agent, role, action)
//         VALUES ($1, $2, $3, $4, 'LOGIN')
//       `, [
//         user.id,
//         req.ip || req.connection.remoteAddress || 'unknown',
//         req.get('User-Agent') || 'unknown',
//         role
//       ]);

//       // ✅ Commit Transaction
//       await client.query('COMMIT');

//       console.log(`✅ ADMIN LOGIN LOG: User ${user.id} (${role}) from ${req.ip || 'unknown'}`);

//       /* ============================
//          7️⃣ Success Response
//       ============================ */
//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token,
//         user: {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role,
//           isAdmin: role === "admin",
//           isRA: role === "ra"
//         }
//       });

//     } catch (authError) {
//       // Rollback on auth failure
//       await client.query('ROLLBACK');
      
//       if (authError.message === "Invalid credentials") {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid credentials"
//         });
//       }
      
//       if (authError.message === "Password not set. Contact administrator.") {
//         return res.status(400).json({
//           success: false,
//           message: "Password not set. Contact administrator."
//         });
//       }
      
//       throw authError; // Re-throw for general errors
//     }

//   } catch (err) {
//     // Final rollback & error handling
//     try {
//       await client.query('ROLLBACK');
//     } catch (rollbackError) {
//       console.error("Rollback failed:", rollbackError);
//     }
    
//     console.error("Admin login error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   } finally {
//     client.release(); 
//   }
// };


export const adminLogin = async (req, res) => {
  const client = await pool.connect(); // ✅ Transaction client
  
  try {
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/UserID and password are required"
      });
    }

    const loginValue = email.toLowerCase();
    let user = null;
    let role = null;
    let userIdForLog = null; // ✅ This will store the integer ID from users table

    // 🔥 Start Transaction
    await client.query('BEGIN');

    try {
      /* ============================
         1️⃣ FIRST: Check USER table
      ============================ */
      const userResult = await client.query(
        `SELECT * FROM users WHERE LOWER(email) = $1 AND is_verified = true LIMIT 1`,
        [loginValue]
      );

      if (userResult.rows.length > 0) {
        user = userResult.rows[0];
        role = user.role || "user";
        userIdForLog = user.id; // ✅ Integer ID from users table
      }

      /* ============================
         2️⃣ SECOND: If not found → RA table
      ============================ */
      if (!user) {
        const raResult = await client.query(
          `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
          [loginValue, loginValue]
        );

        if (raResult.rows.length > 0) {
          user = raResult.rows[0];
          role = "ra";
          
          // ❌ DON'T use user.id here as it's a string like "RAKB9D8462"
          // ✅ Instead, we need to find the corresponding user in users table
          
          // Check if there's a linked user account
          const linkedUserResult = await client.query(
            `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
            [user.email.toLowerCase()]
          );
          
          if (linkedUserResult.rows.length > 0) {
            // ✅ Use the existing user's ID from users table
            userIdForLog = linkedUserResult.rows[0].id;
          } else {
            // Option 1: Create a user record for this RA (recommended)
            const newUserResult = await client.query(
              `INSERT INTO users (email, name, role, password_hash, created_at)
               VALUES ($1, $2, 'ra', $3, NOW())
               RETURNING id`,
              [user.email, user.name || user.email, user.password_hash]
            );
            userIdForLog = newUserResult.rows[0].id;
            
            // Optionally update the research_analysts table with the new user_id
            await client.query(
              `UPDATE research_analysts SET user_id = $1 WHERE id = $2`,
              [userIdForLog, user.id]
            );
          }
        }
      }

      /* ============================
         3️⃣ If still not found
      ============================ */
      if (!user) {
        throw new Error("Invalid credentials");
      }

      /* ============================
         4️⃣ Password check
      ============================ */
      if (!user.password_hash) {
        throw new Error("Password not set. Contact administrator.");
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      /* ============================
         5️⃣ Generate JWT
      ============================ */
      const token = jwt.sign(
        {
          userId: user.id, // This can be string ID for RA, integer for regular users
          email: user.email,
          role,
          isAdmin: role === "admin",
          isRA: role === "ra"
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      /* 🔥 6️⃣ LOGIN LOG - Transaction Safe */
      // Only insert login_logs if we have a valid integer user_id
      if (userIdForLog) {
        await client.query(`
          INSERT INTO login_logs (user_id, ip_address, user_agent, role, action)
          VALUES ($1, $2, $3, $4, 'LOGIN')
        `, [
          userIdForLog, // ✅ This is now guaranteed to be an integer from users table
          req.ip || req.connection.remoteAddress || 'unknown',
          req.get('User-Agent') || 'unknown',
          role
        ]);
      } else {
        // Log to console if no user_id is available
        console.log(`⚠️ Login log skipped for RA ${user.id} - no linked user account`);
      }

      // ✅ Commit Transaction
      await client.query('COMMIT');

      console.log(`✅ ADMIN LOGIN LOG: User ${user.id} (${role}) from ${req.ip || 'unknown'}`);

      /* ============================
         7️⃣ Success Response
      ============================ */
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
          isAdmin: role === "admin",
          isRA: role === "ra"
        }
      });

    } catch (authError) {
      // Rollback on auth failure
      await client.query('ROLLBACK');
      
      if (authError.message === "Invalid credentials") {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }
      
      if (authError.message === "Password not set. Contact administrator.") {
        return res.status(400).json({
          success: false,
          message: "Password not set. Contact administrator."
        });
      }
      
      throw authError;
    }

  } catch (err) {
    // Final rollback & error handling
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    
    console.error("Admin login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    client.release(); 
  }
};


// ================================= seed ============================================
export const seedAdmin = async (_req, res) => {
  try {
    const email = "admin@investbay.com";
    const defaultPassword = "Admin@123";
    const defaultNumber="8965029288"

    // =========================
    // 1️⃣ Check if admin exists
    // =========================
    const existsResult = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (existsResult.rows.length > 0) {
      const exists = existsResult.rows[0];
      return res.json({
        success: true,
        message: "Admin already exists",
        admin: {
          email: exists.email,
          role: exists.role,
          password: defaultPassword ,
          phone:defaultNumber
        }
      });
    }

    // =========================
    // 2️⃣ Hash the password
    // =========================
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // =========================
    // 3️⃣ Insert admin into DB
    // =========================
    const insertResult = await pool.query(
      `INSERT INTO users 
      (email, password_hash, name, phone, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
      RETURNING id, email, role`,
      [
        email,
        passwordHash,
        "System Administrator",
        defaultNumber, 
        null, // gender
        null, // dob
        null, // pan
        null, // state
        "email", // auth_provider
        "admin", // role
        null, // reset_code
        null, // reset_code_expiry
        true // is_verified
      ]
    );

    const adminUser = insertResult.rows[0];

    console.log("Admin created with ID:", adminUser.id);

    // =========================
    // 4️⃣ Response
    // =========================
    res.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        password: defaultPassword,
        phone:defaultNumber
      }
    });

  } catch (e) {
    console.error("Seed admin error:", e);
    res.status(500).json({
      success: false,
      message: "Seed failed: " + e.message
    });
  }
};

// ==================================== login =============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email/UserId and password required" });
    }

    const loginValue = email.toLowerCase();
    let user = null;
    let passwordHash = null;
    let role = null;

    // ==========================
    // 1️⃣ Check User table first
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [loginValue]
    );

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      passwordHash = user.password_hash;
      role = user.role || "user";
    }

    // ==========================
    // 2️⃣ If not found, check ResearchAnalyst table
    // ==========================
    if (!user) {
      const raResult = await pool.query(
        `SELECT * FROM research_analysts WHERE LOWER(email) = $1 OR user_id = $2 LIMIT 1`,
        [loginValue, loginValue]
      );

      if (raResult.rows.length > 0) {
        user = raResult.rows[0];
        passwordHash = user.password;
        role = "ra";
      }
    }

    // ==========================
    // 3️⃣ If still not found
    // ==========================
    if (!user || !passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ==========================
    // 4️⃣ Compare password
    // ==========================
    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ==========================
    // 5️⃣ Generate JWT
    // ==========================

    
    const token = signToken({
      id: user.id,
      email: user.email,
      role,
      isAdmin: role === "admin",
      isRA: role === "ra",
    });


    const raResult = await pool.query(`
      INSERT INTO login_logs (user_id, ip_address, user_agent, role, action)
      VALUES ($1, $2, $3, $4, 'LOGIN')
    `, [user.id, req.ip || req.connection.remoteAddress, req.get('User-Agent'), role]);
    
  
    console.log(`✅ LOGIN: User ${user.id} (${role}) from ${req.ip}`);


    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
        image: user.profile_image || null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};











// ===================================== me ==========================================
export const me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // req.user already has id, email, role, isAdmin, isRA from JWT
    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
        isRA: req.user.isRA
      }
    });
  } catch (err) {
    console.error("Me endpoint error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================================== forgot password ===================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // ==========================
    // 1️⃣ Get RA user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // ==========================
    // 2️⃣ Already active OTP check
    // ==========================
    if (user.reset_code_expiry && new Date(user.reset_code_expiry) > new Date()) {
      return res.status(429).json({
        message: "OTP already sent. Please wait before requesting again",
      });
    }

    // ==========================
    // 3️⃣ Generate 4-digit OTP
    // ==========================
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // ==========================
    // 4️⃣ Update user record
    // ==========================
    await pool.query(
      `UPDATE research_analysts
       SET reset_code = $1,
           reset_code_expiry = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [code, expiry, user.id]
    );

    // ==========================
    // 5️⃣ Send email
    // ==========================
    await sendResetPasswordMail(email, code);

    res.json({ message: "Verification code sent", email });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================================== verify code =============================
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({ message: "Email & code required" });
    }

    // ==========================
    // 1️⃣ Fetch user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const user = userResult.rows[0];

    if (!user.reset_code || !user.reset_code_expiry) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const now = Date.now();
    const expiry = new Date(user.reset_code_expiry).getTime();

    if (user.reset_code !== String(code)) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (expiry < now) {
      return res.status(400).json({ message: "Code expired" });
    }

    // ==========================
    // 2️⃣ Clear OTP after success
    // ==========================
    await pool.query(
      `UPDATE research_analysts
       SET reset_code = NULL,
           reset_code_expiry = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    res.json({ message: "Code verified" });

  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================== update password =================================
export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body || {};

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // ==========================
    // 1️⃣ Fetch user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM research_analysts WHERE LOWER(email) = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // ==========================
    // 2️⃣ Hash the new password
    // ==========================
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ==========================
    // 3️⃣ Update password & clear OTP
    // ==========================
    await pool.query(
      `UPDATE research_analysts
       SET password = $1,
           reset_code = NULL,
           reset_code_expiry = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





// ================================ register with profile ===============================
// export const registerWithProfile = async (req, res) => {
//   console.log('Registration started...');

//   try {
//     const { name, email, gender, dob, pan, state, phone } = req.body;

   

//     // ==========================
//     // 1️⃣ Validation
//     // ==========================
//     const errors = [];

//     if (!name || !name.trim()) errors.push('Name is required');
//     if (!email || !email.includes('@')) errors.push('Valid email is required');
//     if (!gender) errors.push('Gender is required');
//     if (!dob) errors.push('Date of birth is required');
    
//     // Phone validation - Required + exactly 10 digits
//     if (!phone) {
//       errors.push('Phone number is required');
//     } else if (!/^[0-9]{10}$/.test(phone)) {
//       errors.push('Phone number must be exactly 10 digits (e.g., 9876543210)');
//     }
    
//     if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
//       errors.push('Valid PAN card number is required (e.g., ABCDE1234F)');
//     }
//     if (!state || !state.trim()) errors.push('State is required');

//     // Age validation (18+)
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
//       if (age < 18) errors.push('You must be at least 18 years old to register');
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, message: errors.join(', ') });
//     }

//     // ==========================
//     // 2️⃣ Check email uniqueness
//     // ==========================
//     const emailCheck = await pool.query(
//       `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
//       [email.toLowerCase()]
//     );
//     if (emailCheck.rows.length > 0) {
//       return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     // ==========================
//     // 3️⃣ Check PAN uniqueness
//     // ==========================
//     const panCheck = await pool.query(
//       `SELECT id FROM users WHERE UPPER(pan) = $1 LIMIT 1`,
//       [pan.toUpperCase()]
//     );
//     if (panCheck.rows.length > 0) {
//       return res.status(400).json({ success: false, message: 'PAN card already registered' });
//     }

//     // ==========================
//     // 4️⃣ Check Phone uniqueness
//     // ==========================
//     const phoneCheck = await pool.query(
//       `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
//       [phone]
//     );
//     if (phoneCheck.rows.length > 0) {
//       return res.status(400).json({ success: false, message: 'Phone number already registered' });
//     }

//     // ==========================
//     // 5️⃣ Generate random password & hash
//     // ==========================
//     const randomPassword = generateRandomPassword();
//     console.log('Generated password for', email, ':', randomPassword);
//     const passwordHash = await bcrypt.hash(randomPassword, 10);

//     // ==========================
//     // 6️⃣ Generate OTP
//     // ==========================
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     // ==========================
//     // 7️⃣ Insert new user (Phone included)
//     // ==========================
//     const insertResult = await pool.query(
//       `INSERT INTO users 
//        (email, name, phone, password_hash, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
//        RETURNING id, email, name, phone`,
//       [
//         email.toLowerCase().trim(),
//         name.trim(),
//         phone,  // ✅ Phone now saved
//         passwordHash,
//         gender,
//         new Date(dob),
//         pan.toUpperCase().trim(),
//         state.trim(),
//         'email',
//         'user',
//         otp,
//         otpExpiry,
//         false
//       ]
//     );

//     const newUser = insertResult.rows[0];
//     console.log('User created successfully with ID:', newUser.id);

//     // // ==========================
//     // // 8️⃣ Send Emails
//     // // ==========================
//     // const passwordEmailSent = await sendPasswordEmail(email, randomPassword, name);
//     // const otpEmailSent = await sendOTPEmail(email, otp);

//     // if (!passwordEmailSent || !otpEmailSent) {
//     //   // Delete user if email fails
//     //   await pool.query(`DELETE FROM users WHERE id = $1`, [newUser.id]);
//     //   return res.status(500).json({ success: false, message: 'Failed to send emails. Please try again.' });
//     // }

//     // ==========================
//     // 9️⃣ Response
//     // ==========================
//     res.status(201).json({
//       success: true,
//       message: 'Registration successful.',
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         name: newUser.name,
//         phone: newUser.phone  
//       }
//     });

//   } catch (error) {
//     console.error('Error in registerWithProfile:', error);
//     res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
//   }
// };



export const registerWithProfile = async (req, res) => {
  console.log('Registration started...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    const { name, email, gender, dob, pan, state, phone } = req.body;

    // ==========================
    // 1️⃣ Validation
    // ==========================
    const errors = [];

    if (!name || !name.trim()) errors.push('Name is required');
    if (!email || !email.includes('@')) errors.push('Valid email is required');
    if (!gender) errors.push('Gender is required');
    if (!dob) errors.push('Date of birth is required');
    
    // Phone validation
    if (!phone) {
      errors.push('Phone number is required');
    } else if (!/^[0-9]{10}$/.test(phone)) {
      errors.push('Phone number must be exactly 10 digits (e.g., 9876543210)');
    }
    
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      errors.push('Valid PAN card number is required (e.g., ABCDE1234F)');
    }
    if (!state || !state.trim()) errors.push('State is required');

    // Age validation (18+)
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) errors.push('You must be at least 18 years old to register');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.toLowerCase().trim();
    const formattedPan = pan.toUpperCase().trim();

    // ==========================
    // 2️⃣ Check email uniqueness
    // ==========================
    const emailCheck = await client.query(
      `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [trimmedEmail]
    );
    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check in documents_verification table
    const emailVerificationCheck = await client.query(
      `SELECT uid FROM documents_verification WHERE LOWER(email) = $1 LIMIT 1`,
      [trimmedEmail]
    );
    if (emailVerificationCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Email already exists in system' });
    }

    // ==========================
    // 3️⃣ Check PAN uniqueness
    // ==========================
    const panCheck = await client.query(
      `SELECT id FROM users WHERE UPPER(pan) = $1 LIMIT 1`,
      [formattedPan]
    );
    if (panCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'PAN card already registered' });
    }

    const panVerificationCheck = await client.query(
      `SELECT uid FROM documents_verification WHERE pan_number = $1 LIMIT 1`,
      [formattedPan]
    );
    if (panVerificationCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'PAN number already exists in system' });
    }

    // ==========================
    // 4️⃣ Check Phone uniqueness
    // ==========================
    const phoneCheck = await client.query(
      `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
      [phone]
    );
    if (phoneCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const phoneVerificationCheck = await client.query(
      `SELECT uid FROM documents_verification WHERE phone_number = $1 LIMIT 1`,
      [phone]
    );
    if (phoneVerificationCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Phone number already exists in system' });
    }

    // ==========================
    // 5️⃣ Generate random password & hash
    // ==========================
    const randomPassword = generateRandomPassword();
    console.log('Generated password for', trimmedEmail, ':', randomPassword);
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    // ==========================
    // 6️⃣ Generate OTP
    // ==========================
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // ==========================
    // 7️⃣ Insert new user into users table
    // ==========================
    const insertResult = await client.query(
      `INSERT INTO users 
       (email, name, phone, password_hash, gender, dob, pan, state, auth_provider, role, reset_code, reset_code_expiry, is_verified, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
       RETURNING id, email, name, phone, pan`,
      [
        trimmedEmail,
        trimmedName,
        phone,
        passwordHash,
        gender,
        new Date(dob),
        formattedPan,
        state.trim(),
        'email',
        'user',
        otp,
        otpExpiry,
        false
      ]
    );

    const newUser = insertResult.rows[0];
    console.log('User created successfully with ID:', newUser.id);

    // ==========================
    // 8️⃣ Insert into documents_verification table WITH user_type
    // ==========================
    const verificationUid = newUser.id;

    const insertVerificationQuery = `
      INSERT INTO documents_verification (
        uid,
        user_type,        -- Column 2
        uname,            -- Column 3
        email,            -- Column 4
        phone_number,     -- Column 5
        pan_number,       -- Column 6
        sebi_number,      -- Column 7
        phone_verified,   -- Column 8
        pan_verified,     -- Column 9
        sebi_verified,    -- Column 10
        phone_verified_at,-- Column 11
        pan_verified_at,  -- Column 12
        sebi_verified_at, -- Column 13
        date_of_birth,    -- Column 14
        address,          -- Column 15
        registered_at,    -- Column 16
        last_updated      -- Column 17
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING id
    `;

    const verificationValues = [
      verificationUid,      // $1: uid
      'user',               // $2: user_type = 'user'
      trimmedName,          // $3: uname
      trimmedEmail,         // $4: email
      phone,                // $5: phone_number
      formattedPan,         // $6: pan_number
      null,                 // $7: sebi_number
      false,                // $8: phone_verified
      false,                // $9: pan_verified
      null,                 // $10: sebi_verified
      null,                 // $11: phone_verified_at
      null,                 // $12: pan_verified_at
      null,                 // $13: sebi_verified_at
      new Date(dob),        // $14: date_of_birth
      state.trim()          // $15: address
    ];

    await client.query(insertVerificationQuery, verificationValues);
    console.log('Documents verification entry created for user ID:', newUser.id);

    await client.query('COMMIT');

    // ==========================
    // 9️⃣ Response
    // ==========================
    res.status(201).json({
      success: true,
      message: 'Registration successful. Documents require verification.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        pan: newUser.pan
      },
      verificationStatus: {
        phoneVerified: false,
        panVerified: false,
        sebiVerified: null,
        overallStatus: 'pending_verification'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK').catch(rollbackError => {
      console.error('Rollback error:', rollbackError);
    });
    
    console.error('Error in registerWithProfile:', error);
    
    if (error.code === '23505') {
      let message = 'Duplicate entry detected. ';
      
      if (error.constraint) {
        if (error.constraint.includes('email')) {
          message += 'Email already exists.';
        } else if (error.constraint.includes('phone')) {
          message += 'Phone number already exists.';
        } else if (error.constraint.includes('pan')) {
          message += 'PAN number already exists.';
        } else if (error.constraint.includes('sebi')) {
          message += 'SEBI number already exists.';
        } else if (error.constraint.includes('unique_uid_per_type')) {
          message += 'User already has a verification record.';
        }
      }
      
      return res.status(409).json({ 
        success: false, 
        message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error: ' + (process.env.NODE_ENV === 'development' ? error.message : 'Please try again later') 
    });
  } finally {
    client.release();
  }
};




// =================================== check & send otp for login ==============================
export const checkAndSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    // ==========================
    // 1️⃣ Find user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
        userExists: false
      });
    }

    const user = userResult.rows[0];

    // ==========================
    // 2️⃣ Generate OTP & expiry
    // ==========================
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // ==========================
    // 3️⃣ Update user with OTP
    // ==========================
    await pool.query(
      `UPDATE users 
       SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
       WHERE id = $3`,
      [otp, otpExpiry, user.id]
    );

    // ==========================
    // 4️⃣ Send OTP email
    // ==========================
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    // ==========================
    // 5️⃣ Response
    // ==========================
    res.json({
      success: true,
      message: user.is_verified
        ? 'OTP sent successfully to your email'
        : 'OTP sent to verify your account',
      userExists: true,
      isVerified: user.is_verified,
      email
    });

  } catch (error) {
    console.error('Error in checkAndSendOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =================================== verify otp and login ======================================
// export const verifyOTPAndLogin = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     console.log('Verifying OTP for:', email);

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and OTP are required'
//       });
//     }

//     // ==========================
//     // 1️⃣ Find user with valid OTP
//     // ==========================
//     const userResult = await pool.query(
//       `SELECT * FROM users 
//        WHERE LOWER(email) = $1 
//          AND reset_code = $2 
//          AND reset_code_expiry > NOW()
//        LIMIT 1`,
//       [email.toLowerCase(), otp]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP or OTP expired'
//       });
//     }

//     const user = userResult.rows[0];

//     // ==========================
//     // 2️⃣ Clear OTP & mark verified
//     // ==========================
//     const isVerified = user.is_verified || true; // mark verified if first login

//     await pool.query(
//       `UPDATE users
//        SET reset_code = NULL,
//            reset_code_expiry = NULL,
//            is_verified = $1,
//            updated_at = NOW()
//        WHERE id = $2`,
//       [isVerified, user.id]
//     );

//     // ==========================
//     // 3️⃣ Generate JWT token
//     // ==========================
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         pan: user.pan
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // ==========================
//     // 4️⃣ Set cookie (optional)
//     // ==========================
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     // ==========================
//     // 5️⃣ Response
//     // ==========================
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         gender: user.gender,
//         dob: user.dob,
//         pan: user.pan,
//         state: user.state,
//         role: user.role,
//         isVerified: true
//       }
//     });

//   } catch (error) {
//     console.error('Error in verifyOTPAndLogin:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// export const verifyOTPAndLogin = async (req, res) => {
//   const client = await pool.connect(); // ✅ Transaction client
  
//   try {
//     const { email, otp } = req.body;

//     console.log('Verifying OTP for:', email);

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and OTP are required'
//       });
//     }

//     // 🔥 Start Transaction
//     await client.query('BEGIN');

//     try {
//       // ==========================
//       // 1️⃣ Find user with valid OTP
//       // ==========================
//       const userResult = await client.query(
//         `SELECT * FROM users 
//          WHERE LOWER(email) = $1 
//            AND reset_code = $2 
//            AND reset_code_expiry > NOW()
//          LIMIT 1`,
//         [email.toLowerCase(), otp]
//       );

//       if (userResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid OTP or OTP expired'
//         });
//       }

//       const user = userResult.rows[0];

//       // ==========================
//       // 2️⃣ Clear OTP & mark verified
//       // ==========================
//       const isVerified = user.is_verified || true;

//       await client.query(
//         `UPDATE users
//          SET reset_code = NULL,
//              reset_code_expiry = NULL,
//              is_verified = $1,
//              updated_at = NOW()
//          WHERE id = $2`,
//         [isVerified, user.id]
//       );

//       // 🔥 3️⃣ LOGIN LOG - OTP Login भी track होगा
//       await client.query(`
//         INSERT INTO login_logs (user_id, ip_address, user_agent, role, action)
//         VALUES ($1, $2, $3, $4, 'OTP_LOGIN')
//       `, [
//         user.id,
//         req.ip || req.connection.remoteAddress || 'unknown',
//         req.get('User-Agent') || 'unknown',
//         user.role || 'user'
//       ]);

//       // ==========================
//       // 4️⃣ Generate JWT token
//       // ==========================
//       const token = jwt.sign(
//         {
//           userId: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           pan: user.pan
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '7d' }
//       );

//       // ✅ Commit Transaction
//       await client.query('COMMIT');

//       console.log(`✅ OTP LOGIN LOG: User ${user.id} (${user.role || 'user'}) from ${req.ip || 'unknown'}`);

//       // ==========================
//       // 5️⃣ Set cookie (optional)
//       // ==========================
//       res.cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//       });

//       // ==========================
//       // 6️⃣ Success Response
//       // ==========================
//       res.json({
//         success: true,
//         message: 'Login successful via OTP',
//         token,
//         user: {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           gender: user.gender,
//           dob: user.dob,
//           pan: user.pan,
//           state: user.state,
//           role: user.role,
//           isVerified: true
//         }
//       });

//     } catch (authError) {
//       // Rollback on auth/OTP failure
//       await client.query('ROLLBACK');
//       throw authError;
//     }

//   } catch (error) {
//     // Final error handling with rollback
//     try {
//       await client.query('ROLLBACK');
//     } catch (rollbackError) {
//       console.error('Rollback failed:', rollbackError);
//     }
    
//     console.error('Error in verifyOTPAndLogin:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   } finally {
//     client.release(); // Always release connection
//   }
// };


export const verifyOTPAndLogin = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    await client.query('BEGIN');

    try {
      // 1️⃣ Find user with valid OTP
      const userResult = await client.query(
        `SELECT * FROM users 
         WHERE LOWER(email) = $1 
           AND reset_code = $2 
           AND reset_code_expiry > NOW()
         LIMIT 1`,
        [email.toLowerCase(), otp]
      );

      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP or OTP expired'
        });
      }

      const user = userResult.rows[0];

      // 2️⃣ Clear OTP & mark verified
      const isVerified = user.is_verified || true;
      await client.query(
        `UPDATE users
         SET reset_code = NULL,
             reset_code_expiry = NULL,
             is_verified = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [isVerified, user.id]
      );

      // 🔥 3️⃣ LOGIN LOG - Use 'LOGIN' instead of 'OTP_LOGIN'
      await client.query(`
        INSERT INTO login_logs (user_id, ip_address, user_agent, role, action)
        VALUES ($1, $2, $3, $4, 'LOGIN')  -- ✅ Changed to 'LOGIN'
      `, [
        user.id,
        req.ip || req.connection.remoteAddress || 'unknown',
        req.get('User-Agent') || 'unknown',
        user.role || 'user'
      ]);

      // 4️⃣ Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          pan: user.pan
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      await client.query('COMMIT');

      console.log(`✅ OTP LOGIN: User ${user.id} (${user.role || 'user'})`);

      // 5️⃣ Response
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Login successful via OTP',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          dob: user.dob,
          pan: user.pan,
          state: user.state,
          role: user.role,
          isVerified: true,
          loginMethod: 'OTP'  // Frontend के लिए extra info
        }
      });

    } catch (authError) {
      await client.query('ROLLBACK');
      throw authError;
    }

  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    
    console.error('OTP Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  } finally {
    client.release();
  }
};


// ====================================== resend otp =====================================
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    // ==========================
    // 1️⃣ Find user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM users 
       WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // ==========================
    // 2️⃣ Prevent spam: OTP sent less than 1 min ago
    // ==========================
    if (user.reset_code_expiry && new Date(user.reset_code_expiry) > new Date(Date.now() - 60 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting new OTP'
      });
    }

    // ==========================
    // 3️⃣ Generate new OTP & expiry
    // ==========================
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ==========================
    // 4️⃣ Update user with new OTP
    // ==========================
    await pool.query(
      `UPDATE users 
       SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
       WHERE id = $3`,
      [otp, otpExpiry, user.id]
    );

    // ==========================
    // 5️⃣ Send OTP email
    // ==========================
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    // ==========================
    // 6️⃣ Response
    // ==========================
    res.json({
      success: true,
      message: 'New OTP sent successfully to your email',
      email
    });

  } catch (error) {
    console.error('Error in resendOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ================================ login with password alternative ====================================
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // ==========================
    // 1️⃣ Find user by email
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // ==========================
    // 2️⃣ Check if password exists
    // ==========================
    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: 'Please login with OTP method'
      });
    }

    // ==========================
    // 3️⃣ Verify password
    // ==========================
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ==========================
    // 4️⃣ Check if user is verified
    // ==========================
    if (!user.is_verified) {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Update user with OTP
      await pool.query(
        `UPDATE users 
         SET reset_code = $1, reset_code_expiry = $2, updated_at = NOW()
         WHERE id = $3`,
        [otp, otpExpiry, user.id]
      );

      await sendOTPEmail(email, otp);

      return res.status(200).json({
        success: false,
        message: 'Account not verified. OTP sent to your email.',
        requiresOTP: true,
        email
      });
    }

    // ==========================
    // 5️⃣ Generate JWT
    // ==========================
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        pan: user.pan
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ==========================
    // 6️⃣ Response
    // ==========================
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        pan: user.pan,
        state: user.state,
        role: user.role,
        isVerified: user.is_verified
      }
    });

  } catch (error) {
    console.error('Error in loginWithPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =============================== set password after opt verification =====================================
export const setPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // ==========================
    // 1️⃣ Validate inputs
    // ==========================
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      });
    }

    // ==========================
    // 2️⃣ Find user
    // ==========================
    const userResult = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 AND auth_provider = 'email' LIMIT 1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // ==========================
    // 3️⃣ Check if verified
    // ==========================
    if (!user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first before setting password'
      });
    }

    // ==========================
    // 4️⃣ Check if new password same as old
    // ==========================
    if (user.password_hash) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be same as old password'
        });
      }
    }

    // ==========================
    // 5️⃣ Hash new password
    // ==========================
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ==========================
    // 6️⃣ Update password in DB
    // ==========================
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW() 
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    console.log(`Password updated for user: ${email}`);

    res.json({
      success: true,
      message: 'Password set successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error in setPassword:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

// ================================= changed password for logged in user ========================================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // from auth middleware (JWT)

    // ==========================
    // 1️⃣ Validate inputs
    // ==========================
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required"
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });
    }

    // Password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      });
    }

    // ==========================
    // 2️⃣ Find user by ID
    // ==========================
    const userResult = await pool.query(
      `SELECT id, password_hash 
       FROM users 
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];

    // ==========================
    // 3️⃣ Check if password exists
    // ==========================
    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: "Please set your password first"
      });
    }

    // ==========================
    // 4️⃣ Verify current password
    // ==========================
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // ==========================
    // 5️⃣ Prevent same password
    // ==========================
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as current password"
      });
    }

    // ==========================
    // 6️⃣ Hash & update password
    // ==========================
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, userId]
    );

    console.log(`Password changed for user ID: ${userId}`);

    // ==========================
    // 7️⃣ Response
    // ==========================
    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// =================================== request password reset =============================================
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    // 🔹 Find user (RAW SQL)
    const [users] = await sequelize.query(
      `
      SELECT id, reset_code_expiry 
      FROM users 
      WHERE email = :email 
      AND auth_provider = 'email'
      `,
      {
        replacements: { email: email.toLowerCase() },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔹 Check OTP resend cooldown
    if (
      users.reset_code_expiry &&
      new Date(users.reset_code_expiry) >
        new Date(Date.now() - 1 * 60 * 1000)
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 1 minute before requesting new OTP"
      });
    }

    // 🔹 Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 🔹 Update OTP (RAW SQL)
    await sequelize.query(
      `
      UPDATE users 
      SET reset_code = :otp,
          reset_code_expiry = :expiry
      WHERE id = :id
      `,
      {
        replacements: {
          otp,
          expiry: otpExpiry,
          id: users.id
        }
      }
    );

    // 🔹 Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email"
      });
    }

    res.json({
      success: true,
      message: "Password reset OTP sent to your email",
      email
    });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// ===================================== reset password with otp ===================================
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit OTP is required"
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // 🔹 Find user with valid OTP (RAW SQL)
    const [user] = await sequelize.query(
      `
      SELECT id 
      FROM users
      WHERE email = :email
        AND reset_code = :otp
        AND reset_code_expiry > NOW()
      `,
      {
        replacements: {
          email: email.toLowerCase(),
          otp
        },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or OTP expired"
      });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password & clear OTP (RAW SQL)
    await sequelize.query(
      `
      UPDATE users
      SET password_hash = :password,
          reset_code = NULL,
          reset_code_expiry = NULL
      WHERE id = :id
      `,
      {
        replacements: {
          password: hashedPassword,
          id: user.id
        }
      }
    );

    console.log(`Password reset for user: ${email}`);

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password."
    });
  } catch (error) {
    console.error("Error in resetPasswordWithOTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



// ------------------------------------------------------------------------------------


// Updated controllers to use documents_verification table directly (NO otps table needed)
export const sendPhoneOTP = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { phone, id } = req.body;
        let userId = id;
        
        console.log('📱 Request received:', { phone: `91${phone}`, userId });

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Indian phone number'
            });
        }

        if (!process.env.MESSAGE91_AUTH_KEY) {
            console.error('❌ MESSAGE91_AUTH_KEY not found');
            return res.status(500).json({
                success: false,
                message: 'SMS service configuration error'
            });
        }

        await client.query('BEGIN');

        // User verification
        const userCheck = await client.query(
            'SELECT uid FROM documents_verification WHERE uid = $1',
            [userId]
        );

        console.log('🔍 User check result:', userCheck.rows.length);

        if (userCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'User not found in documents verification'
            });
        }

        // ✅ Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const fullPhone = `91${phone}`;
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        console.log('🔢 Generated OTP:', otp, 'for phone:', fullPhone);

        // ✅ Store OTP in database
        await client.query(
            `INSERT INTO otp_logs (user_id, phone, otp, expires_at) 
             VALUES ($1, $2, $3, $4)`,
            [userId, fullPhone, otp, expiresAt]
        );

        await client.query('COMMIT');

        // ✅ Send SMS via Message91 Direct API
        const smsMessage = `Your KYC verification OTP is ${otp}. Valid for 5 minutes. Do not share. MSG91`;
        const smsUrl = `https://api.msg91.com/api/v5/flow/?` +
            `authkey=${process.env.MESSAGE91_AUTH_KEY}&` +
            `mobile=${fullPhone}&` +
            `message=${encodeURIComponent(smsMessage)}&` +
            `route=4&` +        // Promotional/Transactional route
            `country=91`;

        console.log('📤 Sending SMS to:', smsUrl);

        // Make actual SMS request
        const fetch = (await import('node-fetch')).default;
        const smsResponse = await fetch(smsUrl, { 
            method: 'GET',
            timeout: 10000 
        });

        const smsResult = await smsResponse.text();
        console.log('📨 SMS Response:', smsResult);

        if (!smsResponse.ok) {
            console.error('❌ SMS Failed:', smsResult);
            // Don't fail the response if SMS fails (OTP is already stored)
        }

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your phone',
            data: {
                phone: fullPhone,
                otp_sent: true,
                userId: userId,
                expires_in_minutes: 5
            }
        });

    } catch (error) {
        if (client) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
        }
        
        console.error('💥 Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    } finally {
        if (client) client.release();
    }
};


export const verifyPhoneOTP = async (req, res) => {
    try {
        const { phone, otp, userId } = req.body;
        const fullPhone = `91${phone}`;

        const result = await pool.query(
            `SELECT * FROM otp_logs 
             WHERE phone = $1 AND otp = $2 AND expires_at > NOW() AND is_used = FALSE`,
            [fullPhone, otp]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark OTP as used
        await pool.query(
            'UPDATE otp_logs SET is_used = TRUE WHERE id = $1',
            [result.rows[0].id]
        );

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: { userId }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed'
        });
    }
};


export const sendPANOTP = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { pan } = req.body;
        const userId = req.user.id;

        if (!pan) {
            return res.status(400).json({
                success: false,
                message: 'PAN number is required'
            });
        }

        const panUpper = pan.toUpperCase();
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panUpper)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid PAN format'
            });
        }

        await client.query('BEGIN');

        const userCheck = await client.query(
            'SELECT uid FROM documents_verification WHERE uid = $1',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await client.query('COMMIT');

        // PAN के लिए phone registered निकालकर Message91 widget भेजें
        // Signzy/Digio integration pending - demo के लिए widget URL
        const widgetUrl = `https://control.msg91.com/api/v5/otp/generate?authkey=${process.env.MESSAGE91_AUTH_KEY}&mobile=91${process.env.DEMO_PAN_PHONE || '9876543210'}&otp_length=6`;

        return res.status(200).json({
            success: true,
            message: 'PAN OTP widget ready',
            data: {
                pan: panUpper,
                otp_widget_url: widgetUrl,
                otpSent: true
            }
        });

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Send PAN OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate PAN OTP',
            error: error.message
        });
    } finally {
        if (client) client.release();
    }
};


export const verifyPANOTP = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { jwt_token, pan } = req.body;
        const userId = req.user.id;

        if (!jwt_token || !pan) {
            return res.status(400).json({
                success: false,
                message: 'JWT token and PAN are required'
            });
        }

        const panUpper = pan.toUpperCase();
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panUpper)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid PAN format'
            });
        }

        await client.query('BEGIN');

        // Message91 verifyAccessToken API
        const verifyUrl = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';
        const verifyBody = {
            authkey: process.env.MESSAGE91_AUTH_KEY,
            'access-token': jwt_token
        };

        const verifyResponse = await axios.post(verifyUrl, verifyBody, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (verifyResponse.data.type !== 'success') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired PAN OTP',
                error: verifyResponse.data.message || 'Verification failed'
            });
        }

        // Update documents_verification
        const result = await client.query(
            `UPDATE documents_verification 
             SET 
                 pan_number = $1,
                 pan_verified = true,
                 pan_verified_at = NOW(),
                 last_updated = NOW()
             WHERE uid = $2
             RETURNING uid, pan_number, pan_verified, pan_verified_at`,
            [panUpper, userId]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await client.query('COMMIT');

        return res.status(200).json({
            success: true,
            message: 'PAN verified successfully',
            data: result.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Verify PAN OTP error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'PAN verification failed',
            error: error.response?.data?.message || error.message
        });
    } finally {
        client.release();
    }
};


// -------------------------------------------------------------------



export const logout = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { user_id, ip_address, user_agent, role } = req.body;
    
    // Insert logout log
    const logQuery = `
      INSERT INTO login_logs (user_id, ip_address, user_agent, role, action, created_at)
      VALUES ($1, $2, $3, $4, 'LOGOUT', NOW())
      RETURNING *
    `;
    
    await client.query(logQuery, [user_id, ip_address || req.ip || req.connection.remoteAddress, user_agent, role]);
    
    console.log(`✅ LOGOUT: User ${user_id} (${role}) from ${ip_address}`);
    
    res.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
    
  } catch (error) {
    console.error("Logout log error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Logout failed" 
    });
  } finally {
    client.release();
  }
};



// export const getLoginLogs = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     // 🔥 Dynamic query with proper table joining based on role
//     const logsQuery = `
//       SELECT 
//         ll.id,
//         ll.user_id,
//         ll.ip_address,
//         ll.user_agent,
//         ll.role,
//         ll.action,
//         ll.created_at,
//         COALESCE(u.name, ra.name, 'Unknown') as user_name,
//         COALESCE(u.email, ra.email, 'Unknown') as user_email,
//         CASE 
//           WHEN ll.role = 'user' THEN 'users'
//           WHEN ll.role = 'ra' THEN 'research_analysts'
//           ELSE 'unknown'
//         END as table_source
//       FROM login_logs ll
//       LEFT JOIN users u ON (ll.role = 'user' AND ll.user_id = u.id)
//       LEFT JOIN research_analysts ra ON (ll.role = 'ra' AND ll.user_id = ra.id)
//       ORDER BY ll.created_at DESC
//       LIMIT 100
//     `;

//     const { rows } = await client.query(logsQuery);
    
//     return res.status(200).json({
//       success: true,
//       message: 'Login logs fetched successfully',
//       data: rows,
//       total: rows.length
//     });

//   } catch (error) {
//     console.error('Get login logs error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch login logs'
//     });
//   } finally {
//     client.release();
//   }
// };








export const getLoginLogs = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { 
      role, 
      action, 
      start_date, 
      end_date, 
      user_id,
      limit = 100,
      page = 1 
    } = req.query;

    console.log('📊 Login logs params:', req.query);

    // 🔥 Base condition: Exclude admin logs
    let whereConditions = ["ll.role != 'admin'"];
    const queryParams = [];

    // Role filter (user/ra only)
    if (role && ['user', 'ra'].includes(role)) {
      whereConditions.push(`ll.role = $${queryParams.length + 1}`);
      queryParams.push(role);
    }

    // Action filter
    if (action && ['LOGIN', 'LOGOUT', 'OTP_LOGIN'].includes(action)) {
      whereConditions.push(`ll.action = $${queryParams.length + 1}`);
      queryParams.push(action);
    }

    // User ID filter
    if (user_id) {
      whereConditions.push(`ll.user_id = $${queryParams.length + 1}`);
      queryParams.push(parseInt(user_id));
    }

    // Start date filter
    if (start_date) {
      whereConditions.push(`ll.created_at >= $${queryParams.length + 1}`);
      queryParams.push(`${start_date} 00:00:00`);
    }

    // End date filter
    if (end_date) {
      whereConditions.push(`ll.created_at <= $${queryParams.length + 1}`);
      queryParams.push(`${end_date} 23:59:59`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Pagination
    const limitVal = Math.min(parseInt(limit), 500); // Max 500
    const offset = (parseInt(page) - 1) * limitVal;
    queryParams.push(limitVal, offset);

    // Main query
    const logsQuery = `
      SELECT 
        ll.id, ll.user_id, ll.ip_address, ll.user_agent,
        ll.role, ll.action, ll.created_at,
        COALESCE(u.name, ra.name, 'Unknown') as user_name,
        COALESCE(u.email, ra.email, 'Unknown') as user_email
      FROM login_logs ll
      LEFT JOIN users u ON (ll.role = 'user' AND ll.user_id = u.id)
      LEFT JOIN research_analysts ra ON (ll.role = 'ra' AND ll.user_id = ra.id)
      WHERE ${whereClause}
      ORDER BY ll.created_at DESC
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `;

    const { rows } = await client.query(logsQuery, queryParams);

    // Count query
    const countParams = queryParams.slice(0, -2);
    const countQuery = `SELECT COUNT(*) as total FROM login_logs ll WHERE ${whereClause}`;
    const countResult = await client.query(countQuery, countParams);
    const totalRecords = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: totalRecords,
        page: parseInt(page),
        limit: limitVal,
        totalPages: Math.ceil(totalRecords / limitVal)
      }
    });

  } catch (error) {
    console.error('Login logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};


// /rohit