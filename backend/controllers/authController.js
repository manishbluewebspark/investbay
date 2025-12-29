import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "../models/User.js";
import  ResearchAnalyst  from '../models/ResearchAnalyst.js';
import { signToken } from "../middleware/auth.js";
import { sendResetPasswordMail } from "../utils/sendPasswordResetMail.js";

/* ---------------- SEED ADMIN ---------------- */
export const seedAdmin = async (_req, res) => {
  try {
    const exists = await User.findOne({ where: { email: "admin@example.com" } });
    if (exists) {
      return res.json({ ok: true, message: "User exists" });
    }

    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@example.com",
      passwordHash,
      name: "Admin"
    });

    res.json({ ok: true, message: "Admin created" });
  } catch (e) {
    res.status(500).json({ message: "Seed failed" });
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
