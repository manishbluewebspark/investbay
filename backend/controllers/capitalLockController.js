import { pool } from '../db.js';

export const setCapitalLock = async (req, res) => {
  const client = await pool.connect();
  try {
    const { locked_amount } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!locked_amount || locked_amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum ₹100 capital lock required'
      });
    }

    const result = await client.query(`
      INSERT INTO capital_lock (user_id, locked_amount, is_active, locked_at, updated_at)
      VALUES ($1, $2, true, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        locked_amount = EXCLUDED.locked_amount,
        is_active     = true,
        updated_at    = NOW()
      RETURNING *
    `, [userId, locked_amount]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('setCapitalLock error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};

export const getCapitalLock = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const result = await pool.query(
      `SELECT * FROM capital_lock WHERE user_id = $1`,
      [userId]
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeCapitalLock = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    await pool.query(
      `UPDATE capital_lock SET is_active = false, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    );
    res.json({ success: true, message: 'Capital lock removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check karo — kisi bhi invest se pehle call karo
export const checkCapitalLock = async (userId, investAmount) => {
  try {
    const result = await pool.query(
      `SELECT * FROM capital_lock WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    if (!result.rows.length) return { allowed: true };

    const lock = result.rows[0];
    if (investAmount > lock.locked_amount) {
      return {
        allowed: false,
        reason: `Investment ₹${investAmount} exceeds your capital lock of ₹${lock.locked_amount}`
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
};