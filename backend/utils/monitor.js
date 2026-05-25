// utils/monitor.js — naya file banao
import { pool } from '../db.js';
import { monitorAndExitIfLimitHit } from '../controllers/lossSecurityController.js';

export const startLossMonitor = async () => {
  console.log('🔄 Loss monitor started — checking every 30s');

  setInterval(async () => {
    try {
      // Saare active users lo jinka demat connected hai
      const result = await pool.query(`
        SELECT DISTINCT ls.user_id
        FROM loss_security ls
        JOIN demat_accounts da ON da.user_id = ls.user_id
        WHERE ls.is_active = true
          AND ls.is_triggered = false
          AND da.is_connected = true
      `);

      for (const row of result.rows) {
        await monitorAndExitIfLimitHit(row.user_id);
      }

    } catch (err) {
      console.error('Monitor loop error:', err.message);
    }
  }, 30000); // 30 seconds
};