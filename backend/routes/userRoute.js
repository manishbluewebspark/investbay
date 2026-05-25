import express from "express";
import { getWebsiteUserData,getWebsiteRaData, allUsers, checkVerifiedStatus, getUserProfile, sendEmailOTP, verifyEmailOTP, checkEmailVerificationStatus, updateUserEmail, sendPhoneOTP, verifyPhoneOTP, sendPANOTP, verifyPANOTP, sendSebiOTP, verifySebiOTP } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user-all", allUsers);
router.get("/profile/:id", getUserProfile);
router.get("/:id", getWebsiteUserData);
router.get("/ra/:id", getWebsiteRaData);
router.get("/verify/:id", checkVerifiedStatus);


// ✅ Email verification routes - MATCHING frontend URLs
router.post("/verification/email/send-otp", sendEmailOTP);
router.post("/verification/email/verify-otp", verifyEmailOTP);
router.get("/verification/email/status/:id", checkEmailVerificationStatus);
router.put("/verification/email/update/:id", updateUserEmail);

// ✅ Phone verification routes - MATCHING frontend URLs
router.post("/verification/phone/send-otp", sendPhoneOTP);
router.post("/verification/phone/verify-otp", verifyPhoneOTP);

// ✅ PAN verification routes - MATCHING frontend URLs
router.post("/verification/pan/send-otp", sendPANOTP);
router.post("/verification/pan/verify-otp", verifyPANOTP);

// ✅ SEBI verification routes - MATCHING frontend URLs
router.post("/verification/sebi/send-otp", sendSebiOTP);
router.post("/verification/sebi/verify-otp", verifySebiOTP);

export default router;

