import ResearchAnalyst from "../models/ResearchAnalyst.js";
import { generateUserId } from "../utils/generateUserId.js";
import { generatePassword } from "../utils/generatePassword.js";
import bcrypt from "bcrypt";
import { sendAnalystCredentialsMail } from "../utils/sendAnalystCredentialsMail.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

export const addResearchAnalyst = async (req, res) => {
  try {
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
    } = req.body;

    /* 🔴 REQUIRED CHECK */
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    /* 🔴 EMAIL DUPLICATE CHECK */
    const emailExists = await ResearchAnalyst.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    /* 🔐 USER CREDENTIALS */
    const userId = await generateUserId();
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    /* 📂 FILE UPLOADS */
    let panFileData = null;
    let sebiFileData = null;
    let professionalDocumentData = null;
    let profileImageData = null;

    if (req.files?.panFile?.[0]) {
      panFileData = await uploadToS3(req.files.panFile[0], "coursesimage");
    }

    if (req.files?.sebiFile?.[0]) {
      sebiFileData = await uploadToS3(req.files.sebiFile[0], "coursesimage");
    }

    if (req.files?.professionalDocument?.[0]) {
      professionalDocumentData = await uploadToS3(
        req.files.professionalDocument[0],
        "coursesimage"
      );
    }

    if (req.files?.profileImage?.[0]) {
      profileImageData = await uploadToS3(
        req.files.profileImage[0],
        "coursesimage"
      );
    }

    /* 🌐 LANGUAGES FIX */
    const parsedLanguages =
      typeof languages === "string"
        ? languages.split(",").map((l) => l.trim())
        : Array.isArray(languages)
        ? languages
        : [];

    /* 💾 SAVE TO DATABASE */
    const analyst = await ResearchAnalyst.create({
      name,
      email,
      userId,
      password: hashedPassword,
      role: "RA",
      status: "active",
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
      languages: parsedLanguages,
      terms,

      panFile: panFileData?.url || null,
      sebiFile: sebiFileData?.url || null,
      professionalDocument: professionalDocumentData?.url || null,
      profileImage: profileImageData?.url || null,
      s3ImageKey: profileImageData?.key || null,
    });

    /* 📧 SEND EMAIL (NON-BLOCKING) */
    let emailStatus = "sent";

    sendAnalystCredentialsMail({
      to: email,
      name,
      userId,
      password: plainPassword,
    }).catch((err) => {
      emailStatus = "failed";
      console.error("Email sending failed:", err.message);
    });

    /* ✅ SUCCESS RESPONSE */
    return res.status(201).json({
      success: true,
      message: "Research Analyst created successfully",
      emailStatus,
      data: {
        id: analyst.id,
        name: analyst.name,
        email: analyst.email,
        userId: analyst.userId,
        role: analyst.role,
        status: analyst.status,
        profileImage: analyst.profileImage,
        createdAt: analyst.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Analyst Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const deleteResearchAnalyst = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First find the analyst to get S3 keys
    const analyst = await ResearchAnalyst.findByPk(id);
    if (!analyst) {
      return res.status(404).json({ 
        success: false, 
        message: "Research Analyst not found" 
      });
    }

    // Delete files from S3 if they exist
    try {
      // Extract key from URL or use stored key
      if (analyst.profileImage) {
        const url = new URL(analyst.profileImage);
        const key = url.pathname.substring(1); // Remove leading slash
        await deleteFromS3(key);
      }
      
      // Similarly for other files if you store their S3 keys
      // ...
      
    } catch (s3Error) {
      console.error("Error deleting from S3:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    await analyst.destroy();
    
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
}

// ================================================ Get Research Analyst by ID ================================================

export const getResearchAnalystById = async (req, res) => {
  try {
    const { id } = req.params;
    const analyst = await ResearchAnalyst.findByPk(id, {
      attributes: { exclude: ['password'] } // Exclude password from response
    });
    
    if (analyst) {
      res.status(200).json({ success: true, data: analyst });
    } else {
      res.status(404).json({ success: false, message: "Research Analyst not found" });
    }
  } catch (error) {
    console.error("Error fetching analyst:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}

// ================================================ Get All Research Analysts ================================================

export const getAllReserchAnalysts = async (req, res) => {
  try {
    const analysts = await ResearchAnalyst.findAll({
      attributes: { exclude: ['password'] } 
    });
    res.status(200).json({ success: true, data: analysts });
  } catch (error) {
    console.error("Error fetching analysts:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}