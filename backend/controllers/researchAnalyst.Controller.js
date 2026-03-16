import { pool } from '../db.js';
import { generateUserId } from "../utils/generateUserId.js";
import { generatePassword } from "../utils/generatePassword.js";
import bcrypt from "bcrypt";
import { sendAnalystCredentialsMail } from "../utils/sendAnalystCredentialsMail.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";




export const addResearchAnalyst = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      name,
      email,
      gender,
      dob,
      city,
      state,
      address,
      sebiNumber,
      specialization,
      education,
      experience,
      companyName,
      languages,
      terms,
      mobile,
      pan
    } = req.body;

    /* 🔴 REQUIRED CHECK */
    if (!name || !email) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    /* 🔴 NAME VALIDATION */
    const trimmedName = name.trim();
    if (trimmedName.length > 100) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Name must be maximum 100 characters",
      });
    }

    /* 🔴 EMAIL VALIDATION */
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail.length > 255) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Email must be maximum 255 characters",
      });
    }

    // Email duplicate check in research_analysts table
    const emailCheckQuery = 'SELECT email FROM research_analysts WHERE LOWER(email) = $1';
    const emailCheckResult = await client.query(emailCheckQuery, [trimmedEmail]);

    if (emailCheckResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: "Email already exists in research analysts",
      });
    }

    // Check email in documents_verification table
    const emailVerificationCheck = await client.query(
      'SELECT email FROM documents_verification WHERE LOWER(email) = $1',
      [trimmedEmail]
    );

    if (emailVerificationCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: "Email already exists in verification system",
      });
    }

    /* 🔴 MOBILE VALIDATION & FORMATTING */
    let formattedMobile = null;
    if (mobile) {
      // Remove all non-numeric characters
      const cleanMobile = mobile.toString().replace(/\D/g, '');
      console.log('Cleaned mobile:', cleanMobile);

      // Validate length (typically 10 digits for India, max 15 for international)
      if (cleanMobile.length < 10 || cleanMobile.length > 15) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "Mobile number must be between 10 and 15 digits",
        });
      }

      formattedMobile = cleanMobile;

      // Check mobile in research_analysts table
      const mobileCheckQueryRA = 'SELECT mobile FROM research_analysts WHERE mobile = $1';
      const mobileCheckResultRA = await client.query(mobileCheckQueryRA, [formattedMobile]);

      if (mobileCheckResultRA.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "Mobile number already exists in research analysts",
        });
      }

      // Check mobile in documents_verification table
      const mobileCheckQueryDV = 'SELECT phone_number FROM documents_verification WHERE phone_number = $1';
      const mobileCheckResultDV = await client.query(mobileCheckQueryDV, [formattedMobile]);

      if (mobileCheckResultDV.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "Mobile number already exists in verification system",
        });
      }
    }

    /* 🔴 PAN VALIDATION & FORMATTING */
    let formattedPan = null;
    if (pan) {
      // Remove spaces and convert to uppercase
      formattedPan = pan.toString().trim().replace(/\s/g, '').toUpperCase();

      // Validate PAN format: 5 letters, 4 numbers, 1 letter
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formattedPan)) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "Invalid PAN format. Must be 10 characters (5 letters, 4 numbers, 1 letter)",
        });
      }

      // Check PAN in research_analysts table
      const panCheckQueryRA = 'SELECT pan FROM research_analysts WHERE pan = $1';
      const panCheckResultRA = await client.query(panCheckQueryRA, [formattedPan]);

      if (panCheckResultRA.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "PAN number already exists in research analysts",
        });
      }

      // Check PAN in documents_verification table
      const panCheckQueryDV = 'SELECT pan_number FROM documents_verification WHERE pan_number = $1';
      const panCheckResultDV = await client.query(panCheckQueryDV, [formattedPan]);

      if (panCheckResultDV.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "PAN number already exists in verification system",
        });
      }
    }

    /* 🔴 SEBI NUMBER VALIDATION - UPDATED */
    let formattedSebiNumber = null;
    if (sebiNumber) {
      formattedSebiNumber = sebiNumber.trim().toUpperCase();

      // Validate SEBI number length (max 20 characters)
      if (formattedSebiNumber.length > 20) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: "SEBI registration number must be maximum 20 characters",
        });
      }

      // Check SEBI number in research_analysts table
      const sebiCheckQueryRA = 'SELECT sebi_number FROM research_analysts WHERE sebi_number = $1';
      const sebiCheckResultRA = await client.query(sebiCheckQueryRA, [formattedSebiNumber]);

      if (sebiCheckResultRA.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "SEBI registration number already exists in research analysts",
        });
      }

      // Check SEBI number in documents_verification table
      const sebiCheckQueryDV = 'SELECT sebi_number FROM documents_verification WHERE sebi_number = $1';
      const sebiCheckResultDV = await client.query(sebiCheckQueryDV, [formattedSebiNumber]);

      if (sebiCheckResultDV.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: "SEBI registration number already exists in verification system",
        });
      }
    }

    /* 🔴 OTHER FIELD VALIDATIONS */
    // Address validation
    const trimmedAddress = address ? address.trim() : null;
    if (trimmedAddress && trimmedAddress.length > 500) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Address must be maximum 500 characters",
      });
    }

    // Company name validation
    const trimmedCompanyName = companyName ? companyName.trim() : null;
    if (trimmedCompanyName && trimmedCompanyName.length > 255) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Company name must be maximum 255 characters",
      });
    }

    /* 🔐 USER CREDENTIALS */
    const userId = await generateUserId();
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    /* 📂 FILE UPLOADS - WITH PROPER ERROR HANDLING */
    let signatureData = null;
    let panFileData = null;
    let sebiFileData = null;
    let professionalDocumentData = null;
    let profileImageData = null;

    // Helper function for safe file access
    const getFirstFile = (files, fieldName) => {
      if (!files || !files[fieldName]) return null;
      const fileArray = files[fieldName];
      return Array.isArray(fileArray) && fileArray.length > 0 ? fileArray[0] : null;
    };

    try {
      const panFile = getFirstFile(req.files, 'panFile');
      if (panFile) {
        panFileData = await uploadToS3(panFile, "coursesimage");
      }

      const sebiFile = getFirstFile(req.files, 'sebiFile');
      if (sebiFile) {
        sebiFileData = await uploadToS3(sebiFile, "coursesimage");
      }

      const professionalDocument = getFirstFile(req.files, 'professionalDocument');
      if (professionalDocument) {
        professionalDocumentData = await uploadToS3(professionalDocument, "coursesimage");
      }

      const signatureFile = getFirstFile(req.files, 'signature');
      if (signatureFile) {
        signatureData = await uploadToS3(signatureFile, "coursesimage");
      }

      // Check both possible field names for profile image
      const profileImage = getFirstFile(req.files, 'profileImage') || getFirstFile(req.files, 'profImage');
      if (profileImage) {
        profileImageData = await uploadToS3(profileImage, "coursesimage");
      }
    } catch (fileError) {
      console.error("File upload error:", fileError);
      await client.query('ROLLBACK');
      return res.status(500).json({
        success: false,
        message: "Error uploading files",
        error: fileError.message,
      });
    }

    /* 🌐 LANGUAGES FIX */
    let parsedLanguages = [];
    if (languages) {
      if (typeof languages === "string") {
        parsedLanguages = languages.split(",").map((l) => l.trim()).filter(l => l);
      } else if (Array.isArray(languages)) {
        parsedLanguages = languages.filter(l => l);
      }
    }

    /* 💾 INSERT INTO research_analysts TABLE */
    // const insertAnalystQuery = `
    //   INSERT INTO research_analysts (
    //     name, email, user_id, password_hash, role, status,
    //     gender, dob, city, state, address, sebi_number,
    //     specialization, education, experience, company_name,
    //     languages, terms, pan_file, sebi_file,
    //     professional_document, profile_image, s3_image_key,
    //     mobile, pan,  
    //     created_at, updated_at
    //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    //   RETURNING id, name, email, user_id, role, status, profile_image, mobile, pan, sebi_number, created_at
    // `;


    const insertAnalystQuery = `
  INSERT INTO research_analysts (
    name, email, user_id, password_hash, role, status,
    gender, dob, city, state, address, sebi_number,
    specialization, education, experience, company_name,
    languages, terms, pan_file, sebi_file,
    professional_document, profile_image, s3_image_key,
    mobile, pan, signature,  -- Added signature field
    created_at, updated_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING id, name, email, user_id, role, status, profile_image, mobile, pan, sebi_number, created_at
`;

    // const analystValues = [
    //   trimmedName,
    //   trimmedEmail,
    //   userId,
    //   hashedPassword,
    //   'RA',
    //   'active',
    //   gender ? gender.trim() : null,
    //   dob || null,
    //   city ? city.trim() : null,
    //   state ? state.trim() : null,
    //   trimmedAddress,
    //   formattedSebiNumber,
    //   specialization ? specialization.trim() : null,
    //   education ? education.trim() : null,
    //   experience || null,
    //   trimmedCompanyName,
    //   parsedLanguages.length > 0 ? parsedLanguages : null,
    //   terms || null,
    //   panFileData?.url || null,
    //   sebiFileData?.url || null,
    //   professionalDocumentData?.url || null,
    //   profileImageData?.url || null,
    //   profileImageData?.key || null,
    //   formattedMobile,
    //   formattedPan
    // ];



    const analystValues = [
      trimmedName,
      trimmedEmail,
      userId,
      hashedPassword,
      'RA',
      'active',
      gender ? gender.trim() : null,
      dob || null,
      city ? city.trim() : null,
      state ? state.trim() : null,
      trimmedAddress,
      formattedSebiNumber,
      specialization ? specialization.trim() : null,
      education ? education.trim() : null,
      experience || null,
      trimmedCompanyName,
      parsedLanguages.length > 0 ? parsedLanguages : null,
      terms || null,
      panFileData?.url || null,
      sebiFileData?.url || null,
      professionalDocumentData?.url || null,
      profileImageData?.url || null,
      profileImageData?.key || null,
      formattedMobile,
      formattedPan,
      signatureData?.url || null  // Add signature URL
    ];


    const analystResult = await client.query(insertAnalystQuery, analystValues);
    const analyst = analystResult.rows[0];

    /* 📋 INSERT INTO documents_verification TABLE WITH user_type - FIXED */
    const insertVerificationQuery = `
      INSERT INTO documents_verification (
        uid,
        user_type,           -- Column 2
        uname,               -- Column 3
        email,               -- Column 4
        phone_number,        -- Column 5
        pan_number,          -- Column 6
        sebi_number,         -- Column 7
        phone_verified,      -- Column 8
        pan_verified,        -- Column 9
        sebi_verified,       -- Column 10
        phone_verified_at,   -- Column 11
        pan_verified_at,     -- Column 12
        sebi_verified_at,    -- Column 13
        date_of_birth,       -- Column 14
        address,             -- Column 15
        registered_at,       -- Column 16
        last_updated         -- Column 17
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `;

    const verificationValues = [
      analyst.id,            // $1: uid
      'RA',                  // $2: user_type = 'ra'
      trimmedName,           // $3: uname
      trimmedEmail,          // $4: email
      formattedMobile,       // $5: phone_number
      formattedPan,          // $6: pan_number
      formattedSebiNumber,   // $7: sebi_number
      false,                 // $8: phone_verified
      false,                 // $9: pan_verified
      false,                 // $10: sebi_verified
      null,                  // $11: phone_verified_at
      null,                  // $12: pan_verified_at
      null,                  // $13: sebi_verified_at
      dob || null,           // $14: date_of_birth
      trimmedAddress         // $15: address
    ];

    await client.query(insertVerificationQuery, verificationValues);

    /* 📧 SEND EMAIL (NON-BLOCKING) */
    let emailStatus = "pending";

    try {
      await sendAnalystCredentialsMail({
        to: email,
        name,
        userId,
        password: plainPassword,
      });
      emailStatus = "sent";
    } catch (emailError) {
      emailStatus = "failed";
      console.error("Email sending failed:", emailError.message);
      // Don't fail the whole request if email fails
    }

    await client.query('COMMIT');

    /* ✅ SUCCESS RESPONSE */
    return res.status(201).json({
      success: true,
      message: "Research Analyst created successfully. All documents require verification.",
      emailStatus,
      data: {
        id: analyst.id,
        name: analyst.name,
        email: analyst.email,
        userId: analyst.user_id,
        role: analyst.role,
        status: analyst.status,
        profileImage: analyst.profile_image,
        mobile: analyst.mobile,
        pan: analyst.pan,
        sebiNumber: analyst.sebi_number,
        documentVerification: {
          phoneVerified: false,
          panVerified: false,
          sebiVerified: false,
          status: "pending_verification"
        },
        createdAt: analyst.created_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Create Analyst Error:", {
      message: error.message,
      stack: error.stack,
      line: error.lineNumber
    });

    // Handle specific errors
    if (error.code === '23505') { // PostgreSQL unique violation
      const field = error.constraint;
      let message = "Duplicate entry detected.";

      if (field.includes('email')) {
        message = "Email already exists in system.";
      } else if (field.includes('phone')) {
        message = "Mobile number already exists in system.";
      } else if (field.includes('pan')) {
        message = "PAN number already exists in system.";
      } else if (field.includes('sebi')) {
        message = "SEBI registration number already exists in system.";
      } else if (field.includes('uname')) {
        message = "Username already exists in system.";
      } else if (field.includes('unique_uid_per_type')) {
        message = "Research Analyst already exists in verification system.";
      }

      return res.status(409).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Duplicate entry',
      });
    }

    if (error.message.includes('value too long for type character varying')) {
      const fieldMatch = error.message.match(/column "(.*?)"/);
      const fieldName = fieldMatch ? fieldMatch[1] : 'field';
      return res.status(400).json({
        success: false,
        message: `Input data too long for ${fieldName}. Please check and try again.`,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Data length validation failed',
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while creating the research analyst',
    });
  } finally {
    client.release();
  }
};



export const deleteResearchAnalyst = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the analyst to get S3 keys
    const findQuery = 'SELECT * FROM research_analysts WHERE id = $1';
    const findResult = await pool.query(findQuery, [id]);

    if (findResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Research Analyst not found"
      });
    }

    const analyst = findResult.rows[0];

    // Delete files from S3 if they exist
    try {
      if (analyst.profile_image) {
        const url = new URL(analyst.profile_image);
        const key = url.pathname.substring(1); // Remove leading slash
        await deleteFromS3(key);
      }

      // Similarly for other files if needed
      // ...

    } catch (s3Error) {
      console.error("Error deleting from S3:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    const deleteQuery = 'DELETE FROM research_analysts WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: "Research Analyst deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting analyst:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getResearchAnalystById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        id, name, user_id, role, status, email, gender, dob,
        city, state, address, profile_image, about_us, sebi_number,
        specialization, education, experience, company_name,
        s3_image_key, languages, professional_document, segment,
        pan_file, sebi_file, terms, reset_code, reset_code_expiry,
        created_at, updated_at
      FROM research_analysts 
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Research Analyst not found" });
    }
  } catch (error) {
    console.error("Error fetching analyst:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getAllResearchAnalysts = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, name, user_id, role, status, email, gender, dob,
        city, state, address, profile_image, about_us, sebi_number,
        specialization, education, experience, company_name,
        s3_image_key, languages, professional_document, segment,
        pan_file, sebi_file, terms, reset_code, reset_code_expiry,
        created_at, updated_at
      FROM research_analysts
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching analysts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Optional: Update function if you need it later
export const updateResearchAnalyst = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const updateFields = req.body;

    // Check if analyst exists
    const checkQuery = 'SELECT * FROM research_analysts WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Research Analyst not found"
      });
    }

    // Build dynamic update query
    const fieldMappings = {
      name: 'name',
      email: 'email',
      gender: 'gender',
      dob: 'dob',
      city: 'city',
      state: 'state',
      address: 'address',
      sebiNumber: 'sebi_number',
      specialization: 'specialization',
      education: 'education',
      experience: 'experience',
      companyName: 'company_name',
      status: 'status',
      aboutUs: 'about_us',
      segment: 'segment'
    };

    let setClause = [];
    let values = [];
    let paramCount = 1;

    // Add updated_at timestamp
    setClause.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    // Add other fields
    for (const [key, dbField] of Object.entries(fieldMappings)) {
      if (updateFields[key] !== undefined) {
        setClause.push(`${dbField} = $${paramCount}`);
        values.push(updateFields[key]);
        paramCount++;
      }
    }

    // Handle languages array separately
    if (updateFields.languages !== undefined) {
      const parsedLanguages =
        typeof updateFields.languages === 'string'
          ? updateFields.languages.split(',').map(l => l.trim())
          : Array.isArray(updateFields.languages)
            ? updateFields.languages
            : [];

      setClause.push(`languages = $${paramCount}`);
      values.push(parsedLanguages);
      paramCount++;
    }

    // Add ID as last parameter
    values.push(id);

    const updateQuery = `
      UPDATE research_analysts 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(updateQuery, values);
    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Research Analyst updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error updating analyst:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  } finally {
    client.release();
  }
};