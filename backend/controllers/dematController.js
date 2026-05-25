import axios from 'axios';
import { pool } from '../db.js';
import crypto from 'crypto';
import { encrypt, decrypt } from '../utils/encryption.js';
// ← TOTP import nahi chahiye ab

const KEY = process.env.DEMAT_ENCRYPT_KEY;


export const connectDemat = async (req, res) => {
  const client = await pool.connect();
  try {
    const { broker_name, client_id, client_pass, totp_secret } = req.body;
    console.log("📱 Connect Demat Request:", { broker_name, client_id });
    const userId = req.user.id || req.user.userId;

    console.log("✅ userId:", userId); // verify karo

    if (!broker_name || !client_id || !client_pass) {
      return res.status(400).json({
        success: false,
        message: 'broker_name, client_id and password are required'
      });
    }

    const loginResult = await loginWithBroker(
      broker_name, client_id, client_pass, totp_secret
    );

    if (!loginResult.success) {
      return res.status(400).json({
        success: false,
        message: loginResult.message || 'Login failed. Check your credentials.'
      });
    }

    await client.query(`
      INSERT INTO demat_accounts 
        (user_id, broker_name, client_id, client_pass, totp_secret,
         access_token, token_expiry, is_connected, connected_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        broker_name   = EXCLUDED.broker_name,
        client_id     = EXCLUDED.client_id,
        client_pass   = EXCLUDED.client_pass,
        totp_secret   = EXCLUDED.totp_secret,
        access_token  = EXCLUDED.access_token,
        token_expiry  = EXCLUDED.token_expiry,
        is_connected  = true,
        connected_at  = NOW(),
        updated_at    = NOW()
    `, [
      userId,
      broker_name,
      encrypt(client_id),
      encrypt(client_pass),
      totp_secret ? encrypt(totp_secret) : null,
      loginResult.accessToken,
      loginResult.tokenExpiry
    ]);

    res.json({
      success: true,
      message: 'Demat connected successfully!',
      data: { broker_name, connected: true }
    });

  } catch (err) {
    console.error('connectDemat error:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

const loginWithBroker = async (broker, clientId, password, totpOtp) => {
  try {
    if (broker === 'angelone') {
      const { SmartAPI } = await import('smartapi-javascript');

      const smart = new SmartAPI({
        api_key: process.env.ANGELONE_API_KEY
      });

      // User ka 6-digit OTP directly use karo — generate nahi karna
      const totp = totpOtp || '';

      console.log("🔑 API Key:", process.env.ANGELONE_API_KEY ? "SET" : "MISSING");
      console.log("👤 Client ID:", clientId);
      console.log("🔐 OTP:", totp || "not provided");

      const session = await smart.generateSession(clientId, password, totp);
      console.log("📊 Session response:", JSON.stringify(session, null, 2));

      if (session.status === true || session.status === 'true') {
        return {
          success: true,
          accessToken: session.data.jwtToken,
          tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
      }

      console.log("❌ Session failed:", session.message);
      return { success: false, message: session.message || 'Login failed' };
    }

    return { success: false, message: 'Broker not supported yet' };

  } catch (err) {
    console.error('Broker login error:', err.message);
    return { success: false, message: err.message };
  }
};

// dematController.js — getDematStatus mein fix
export const getDematStatus = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId; // ✅ userId fix
    const result = await pool.query(
      `SELECT id, broker_name, is_connected, connected_at
       FROM demat_accounts WHERE user_id = $1`,
      [userId]
    );
    res.json({
      success: true,
      connected: result.rows[0]?.is_connected || false,
      data: result.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// dematController.js mein add karo
export const refreshAccessToken = async (userId) => {
  try {
    const demat = await pool.query(
      `SELECT * FROM demat_accounts WHERE user_id = $1`,
      [userId]
    );
    if (!demat.rows.length) return null;

    const d = demat.rows[0];
    const smart = new SmartAPI({ api_key: process.env.ANGELONE_API_KEY });

    // Re-login karo
    const session = await smart.generateSession(
      decrypt(d.client_id),
      decrypt(d.client_pass),
      '' // TOTP manually nahi de sakte — token daily refresh hoga
    );

    if (session.status) {
      await pool.query(
        `UPDATE demat_accounts 
         SET access_token = $1, token_expiry = $2, updated_at = NOW()
         WHERE user_id = $3`,
        [
          session.data.jwtToken,
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          userId
        ]
      );
      return session.data.jwtToken;
    }
  } catch (err) {
    console.error('Token refresh error:', err.message);
    return null;
  }
};