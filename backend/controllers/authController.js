import crypto from 'crypto'
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "../models/User.js";
import  ResearchAnalyst  from '../models/ResearchAnalyst.js';
import { signToken } from "../middleware/auth.js";
import { sendResetPasswordMail, sendOTPEmail, sendPasswordEmail } from "../utils/sendPasswordResetMail.js";
import jwt from 'jsonwebtoken';


/* ---------------- SEED ADMIN ---------------- */

/* ---------------- ADMIN LOGIN ---------------- */

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/UserID and password are required"
      });
    }

    const loginValue = email.toLowerCase();
    let user = null;
    let role = null;

    /* ============================
       1️⃣ FIRST: Check USER table
    ============================ */
    user = await User.findOne({
      where: {
        email: loginValue
      }
    });

    if (user) {
      role = user.role || "user"; // admin / user
    }

    /* ============================
       2️⃣ SECOND: If not found → RA
    ============================ */
    if (!user) {
      user = await ResearchAnalyst.findOne({
        where: {
          [Op.or]: [
            { email: loginValue },
            { userId: loginValue } // change if field name differs
          ]
        }
      });

      if (user) {
        role = "ra";
      }
    }

    /* ============================
       3️⃣ If still not found
    ============================ */
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    /* ============================
       4️⃣ Password check
    ============================ */
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: "Password not set. Contact administrator."
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    /* ============================
       5️⃣ Generate JWT
    ============================ */
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role,
        isAdmin: role === "admin",
        isRA: role === "ra"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /* ============================
       6️⃣ Response
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

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- UPDATE SEED ADMIN (Better version) ---------------- */
export const seedAdmin = async (_req, res) => {
  try {
    const exists = await User.findOne({ 
      where: { 
        email: "admin@investbay.com"  // Better email
      } 
    });
    
    if (exists) {
      return res.json({ 
        success: true, 
        message: "Admin already exists",
        admin: {
          email: exists.email,
          role: exists.role,
          password: "Admin@123" // Remind the password
        }
      });
    }

    // Strong password for admin
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    
    const adminUser = await User.create({
      email: "admin@investbay.com",
      passwordHash,
      name: "System Administrator",
      phone: null,
      gender: null,
      dob: null,
      pan: null,
      state: null,
      authProvider: 'email',
      role: 'admin',  // Important: role = 'admin'
      resetCode: null,
      resetCodeExpiry: null,
      isVerified: true  // Admin is auto-verified
    });

    console.log('Admin created with ID:', adminUser.id);

    res.json({ 
      success: true, 
      message: "Admin created successfully",
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        password: "Admin@123" // Show password for first time
      }
    });
    
  } catch (e) {
    console.error('Seed admin error:', e);
    res.status(500).json({ 
      success: false,
      message: "Seed failed: " + e.message 
    });
  }
};



/* ---------------- LOGIN ---------------- */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email/UserId and password required" });
    }

    let user = null;
    let passwordHash = null;
    let role = null;

    user = await User.findOne({
      where: { email }
    });

    if (user) {
      passwordHash = user.passwordHash;
    }

    if (!user) {
      user = await ResearchAnalyst.findOne({
        where: {
          [Op.or]: [{ email }, { userId: email }]
        }
      });

      if (user) {
        passwordHash = user.password;
      }
    }

    if (!user || !passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image:user.profileImage
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ---------------- ME ---------------- */
export const me = async (req, res) => {
  res.json({ user: req.user });
};

/* ---------------- FORGOT PASSWORD ---------------- */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await ResearchAnalyst.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Already active OTP check
    if (
      user.resetCodeExpiry &&
      new Date(user.resetCodeExpiry) > new Date()
    ) {
      return res.status(429).json({
        message: "OTP already sent. Please wait before requesting again",
      });
    }

    // 🔢 4 digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetCode = code;
    user.resetCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // 📧 Mail send (separate util)
    await sendResetPasswordMail(email, code);

    res.json({ message: "Verification code sent", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- VERIFY CODE ---------------- */
export const verifyCode = async (req, res) => {
  const { email, code } = req.body || {};

  if (!email || !code) {
    return res.status(400).json({ message: "Email & code required" });
  }

  const user = await ResearchAnalyst.findOne({ where: { email } });

  if (!user || !user.resetCode || !user.resetCodeExpiry) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const now = Date.now();
  const expiry = new Date(user.resetCodeExpiry).getTime();

  if (user.resetCode !== String(code)) {
    return res.status(400).json({ message: "Invalid code" });
  }

  if (expiry < now) {
    return res.status(400).json({ message: "Code expired" });
  }

  // ✅ clear OTP after success
  user.resetCode = null;
  user.resetCodeExpiry = null;
  await user.save();

  res.json({ message: "Code verified" });
};



/* ---------------- UPDATE PASSWORD ---------------- */
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body || {};

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email & password required" });
  }

  const user = await ResearchAnalyst.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword; // 👈 same field you used in model
  user.resetCode = null;
  user.resetCodeExpiry = null;

  await user.save();

  res.json({ message: "Password updated successfully" });
};


// ------------------------------------------------------------------new function by amit ------------------
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random password
const generateRandomPassword = () => {
  return crypto.randomBytes(10).toString('hex'); // 20 character password
};

/* ---------------- REGISTER WITH PROFILE ---------------- */
export const registerWithProfile = async (req, res) => {
  console.log('Registration started...');
  
  try {
    const { name, email, gender, dob, pan, state } = req.body;

    console.log('Received data:', { name, email, gender, dob, pan, state });

    // Validate required fields
    const errors = [];

    if (!name || !name.trim()) {
      errors.push('Name is required');
    }

    if (!email || !email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!gender) {
      errors.push('Gender is required');
    }

    if (!dob) {
      errors.push('Date of birth is required');
    }

    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      errors.push('Valid PAN card number is required (e.g., ABCDE1234F)');
    }

    if (!state || !state.trim()) {
      errors.push('State is required');
    }

    // Validate age (should be at least 18 years)
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        errors.push('You must be at least 18 years old to register');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Check if email already exists
    const existingEmailUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if PAN already exists
    const existingPanUser = await User.findOne({ where: { pan: pan.toUpperCase() } });
    if (existingPanUser) {
      return res.status(400).json({
        success: false,
        message: 'PAN card already registered'
      });
    }

    // Generate random password
    const randomPassword = generateRandomPassword();
    console.log('Generated password for', email, ':', randomPassword);
    
    // Hash the password (ENCRYPTION)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(randomPassword, saltRounds);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Creating user in database...');

    // Create new user with password
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: null,
      passwordHash: passwordHash,
      gender,
      dob: new Date(dob),
      pan: pan.toUpperCase().trim(),
      state: state.trim(),
      authProvider: 'email',
      role: 'user',
      resetCode: otp,
      resetCodeExpiry: otpExpiry,
      isVerified: false
    });

    console.log('User created successfully with ID:', newUser.id);

    // Send password email
    const passwordEmailSent = await sendPasswordEmail(email, randomPassword, name);
    
    // Send OTP email
    const otpEmailSent = await sendOTPEmail(email, otp);

    if (!passwordEmailSent || !otpEmailSent) {
      // If email fails, delete the created user
      await newUser.destroy();
      return res.status(500).json({
        success: false,
        message: 'Failed to send emails. Please try again.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Password and OTP sent to your email.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Error in registerWithProfile:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      const message = field === 'email' ? 'Email already registered' : 
                     field === 'pan' ? 'PAN card already registered' : 
                     'Duplicate entry found';
      return res.status(400).json({
        success: false,
        message
      });
    }

    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

/* ---------------- CHECK AND SEND OTP (FOR LOGIN) ---------------- */
export const checkAndSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        authProvider: 'email'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
        userExists: false
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // User not verified, send new OTP for verification
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.resetCode = otp;
      user.resetCodeExpiry = otpExpiry;
      await user.save();

      await sendOTPEmail(email, otp);

      return res.status(200).json({
        success: true,
        message: 'OTP sent to verify your account',
        userExists: true,
        isVerified: false,
        email
      });
    }

    // User is verified, send OTP for login
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with OTP
    user.resetCode = otp;
    user.resetCodeExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      userExists: true,
      isVerified: true,
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

/* ---------------- VERIFY OTP AND LOGIN ---------------- */
export const verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verifying OTP for:', email);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user with valid OTP
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        resetCode: otp,
        resetCodeExpiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired'
      });
    }

    console.log('User found:', user.id);

    // Clear OTP after successful verification
    user.resetCode = null;
    user.resetCodeExpiry = null;
    
    // Mark email as verified if it's the first time
    if (!user.isVerified) {
      user.isVerified = true;
    }
    
    await user.save();

    // Generate JWT token
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

    // Set cookie (optional)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error in verifyOTPAndLogin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/* ---------------- RESEND OTP ---------------- */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        authProvider: 'email'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP was recently sent (prevent spam)
    if (user.resetCodeExpiry && new Date(user.resetCodeExpiry) > new Date(Date.now() - 1 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting new OTP'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTP
    user.resetCode = otp;
    user.resetCodeExpiry = otpExpiry;
    await user.save();

    // Send new OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

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

/* ---------------- LOGIN WITH PASSWORD (ALTERNATIVE) ---------------- */
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase()
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user has password (DECRYPTION and COMPARISON)
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'Please login with OTP method'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Send OTP for verification
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      user.resetCode = otp;
      user.resetCodeExpiry = otpExpiry;
      await user.save();
      
      await sendOTPEmail(email, otp);
      
      return res.status(200).json({
        success: false,
        message: 'Account not verified. OTP sent to your email.',
        requiresOTP: true,
        email
      });
    }

    // Generate JWT token
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
        isVerified: user.isVerified
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



/* ---------------- SET PASSWORD (After OTP verification) ---------------- */
export const setPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validate inputs
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

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      });
    }

    // Find user
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        authProvider: 'email'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first before setting password'
      });
    }

    // Check if the new password is same as old password
    if (user.passwordHash) {
      const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be same as old password'
        });
      }
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user with new password
    user.passwordHash = hashedPassword;
    await user.save();

    console.log(`Password updated for user: ${email}`);

    res.json({
      success: true,
      message: 'Password set successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error in setPassword:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

/* ---------------- CHANGE PASSWORD (For logged-in users) ---------------- */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate inputs
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required'
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      });
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'Please set your password first'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be same as current password'
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.passwordHash = hashedPassword;
    await user.save();

    console.log(`Password changed for user ID: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/* ---------------- REQUEST PASSWORD RESET ---------------- */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    // Find user
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        authProvider: 'email'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP was recently sent
    if (user.resetCodeExpiry && new Date(user.resetCodeExpiry) > new Date(Date.now() - 1 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting new OTP'
      });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with OTP
    user.resetCode = otp;
    user.resetCodeExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email',
      email
    });

  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/* ---------------- RESET PASSWORD WITH OTP ---------------- */
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid 6-digit OTP is required'
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

    // Find user with valid OTP
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase(),
        resetCode: otp,
        resetCodeExpiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired'
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user with new password and clear OTP
    user.passwordHash = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    console.log(`Password reset for user: ${email}`);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error in resetPasswordWithOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};