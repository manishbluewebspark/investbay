// // routes/auth.js
// import express from "express";
// import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
// import { User } from "../models/User.js";

// const router = express.Router();

// // routes/auth.js
// router.post("/phone-check", verifyFirebaseToken, async (req, res) => {
//   const { uid, phone_number } = req.user;

//   const user = await User.findOne({
//     where: { firebaseUid: uid },
//   });

//   if (!user) {
//     return res.json({
//       exists: false,
//       phone: phone_number,
//     });
//   }

//   res.json({
//     exists: true,
//     user: {
//       id: user.id,
//       role: user.role,
//       name: user.name,
//     },
//   });
// });


// export default router;


import express from "express";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { pool } from "../db.js";

const router = express.Router();

router.post("/phone-check", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, phone_number } = req.user;

    const query = `
      SELECT id, role, name
      FROM users
      WHERE firebase_uid = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [uid]);

    // ❌ User not found
    if (rows.length === 0) {
      return res.json({
        exists: false,
        phone: phone_number
      });
    }

    // ✅ User found
    const user = rows[0];

    return res.json({
      exists: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Phone check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;
