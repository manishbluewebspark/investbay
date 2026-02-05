// import { Router } from "express";
// import {
//   seedAdmin,
//   login,
//   me,
//   forgotPassword,
//   verifyCode,
//   updatePassword,
//   checkAndSendOTP,
//   verifyOTPAndLogin,
//   registerWithProfile,
//   resendOTP,
//   loginWithPassword,
//   setPassword,
//   changePassword,
//   requestPasswordReset,
//   resetPasswordWithOTP,
//   adminLogin,
//   verifyPhoneOTP,
//   sendPhoneOTP,
//   sendPANOTP,
//   verifyPANOTP
// } from "../controllers/auth.controller.js";

// import { authRequired } from "../middleware/auth.js";

// const router = Router();

// // Admin routes
// router.post("/seed", seedAdmin);
// router.post("/admin/login", adminLogin); 


// router.post("/login", login);
// router.get("/me", authRequired, me);

// // Password reset routes (for research analysts)
// router.post("/forgot-password", forgotPassword);
// router.post("/verify-password", verifyCode);
// router.post("/update-password", updatePassword);

// // New user registration and login flow
// router.post('/register-with-email', registerWithProfile);
// router.post('/check-and-send-otp', checkAndSendOTP);
// router.post('/verify-otp-login', verifyOTPAndLogin);
// router.post('/resend-otp', resendOTP);
// router.post('/login-with-password', loginWithPassword);

// // Password management routes
// router.post('/set-password', setPassword); // Set initial password
// router.post('/change-password', authRequired, changePassword); // Change password (requires login)
// router.post('/request-password-reset', requestPasswordReset); // Request password reset OTP
// router.post('/reset-password-with-otp', resetPasswordWithOTP); // Reset password with OTP


// router.post('/phone/send-otp',  sendPhoneOTP);
// router.post('/phone/verify-otp',  verifyPhoneOTP);

// // PAN OTP verification routes
// router.post('/pan/send-otp',  sendPANOTP);
// router.post('/pan/verify-otp',  verifyPANOTP);



// export default router;


// ----------------------------------------------------------old code ---------------------------------------------------


import { Router } from "express";
import {
  seedAdmin,
  login,
  me,
  forgotPassword,
  verifyCode,
  updatePassword,
  checkAndSendOTP,
  verifyOTPAndLogin,
  registerWithProfile,
  resendOTP,
  loginWithPassword,
  setPassword,
  changePassword,
  requestPasswordReset,
  resetPasswordWithOTP,
  adminLogin,
  verifyPhoneOTP,
  sendPhoneOTP,
  sendPANOTP,
  verifyPANOTP
} from "../controllers/auth.controller.js";

import { authRequired } from "../middleware/auth.js";

const router = Router();

// Admin routes
router.post("/seed", seedAdmin);
router.post("/admin/login", adminLogin); 


router.post("/login", login);
router.get("/me", authRequired, me);

// Password reset routes (for research analysts)
router.post("/forgot-password", forgotPassword);
router.post("/verify-password", verifyCode);
router.post("/update-password", updatePassword);

// New user registration and login flow
router.post('/register-with-email', registerWithProfile);
router.post('/check-and-send-otp', checkAndSendOTP);
router.post('/verify-otp-login', verifyOTPAndLogin);
router.post('/resend-otp', resendOTP);
router.post('/login-with-password', loginWithPassword);

// Password management routes
router.post('/set-password', setPassword); // Set initial password
router.post('/change-password', authRequired, changePassword); // Change password (requires login)
router.post('/request-password-reset', requestPasswordReset); // Request password reset OTP
router.post('/reset-password-with-otp', resetPasswordWithOTP); // Reset password with OTP


router.post('/verification/phone/send-otp',  sendPhoneOTP);
router.post('/verification/phone/verify-otp',  verifyPhoneOTP);

// PAN OTP verification routes
router.post('/verification/pan/send-otp',  sendPANOTP);
router.post('/verification/pan/verify-otp',  verifyPANOTP);



export default router;