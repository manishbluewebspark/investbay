import { pool } from '../db.js';
import { SmartAPI } from 'smartapi-javascript';
import { decrypt } from '../utils/encryption.js'; 

// Stoploss set karo
export const setLossLimit = async (req, res) => {
  const client = await pool.connect();
  try {
    const { loss_limit } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!loss_limit || loss_limit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid loss_limit required (e.g. 10000)'
      });
    }

    // Demat connected hai ya nahi check karo
    const dematCheck = await client.query(
      `SELECT is_connected FROM demat_accounts WHERE user_id = $1`,
      [userId]
    );
    if (!dematCheck.rows.length || !dematCheck.rows[0].is_connected) {
      return res.status(400).json({
        success: false,
        message: 'Please connect your demat account first'
      });
    }

    const result = await client.query(`
      INSERT INTO loss_security (user_id, loss_limit, is_active)
      VALUES ($1, $2, true)
      ON CONFLICT (user_id) DO UPDATE SET
        loss_limit   = EXCLUDED.loss_limit,
        is_active    = true,
        is_triggered = false,
        current_loss = 0,
        updated_at   = NOW()
      RETURNING *
    `, [userId, loss_limit]);

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error('setLossLimit error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};

// Current status fetch karo
export const getLossStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT ls.*, da.broker_name
       FROM loss_security ls
       LEFT JOIN demat_accounts da ON da.user_id = ls.user_id
       WHERE ls.user_id = $1`,
      [userId]
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Main check — ye har trade se pehle call hoga
export const checkAndEnforceLoss = async (userId, tradeInfo) => {
  const client = await pool.connect();
  try {
    // Loss security active hai?
    const lsResult = await client.query(
      `SELECT * FROM loss_security WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    if (!lsResult.rows.length) return { allowed: true };

    const ls = lsResult.rows[0];

    // Already triggered?
    if (ls.is_triggered) {
      return { allowed: false, reason: 'Daily loss limit already reached' };
    }

    // Broker se latest PnL fetch karo
    const currentPnL = await fetchPnLFromBroker(userId);
    const currentLoss = currentPnL < 0 ? Math.abs(currentPnL) : 0;

    // DB update karo
    await client.query(
      `UPDATE loss_security 
       SET current_loss = $1, updated_at = NOW() 
       WHERE user_id = $2`,
      [currentLoss, userId]
    );

    // Log karo
    await client.query(
      `INSERT INTO loss_logs 
         (user_id, trade_id, instrument, pnl, cumulative_loss, action_taken)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        tradeInfo?.trade_id || null,
        tradeInfo?.instrument || null,
        currentPnL,
        currentLoss,
        currentLoss >= ls.loss_limit ? 'blocked' : 'allowed'
      ]
    );

    // Limit hit check
    if (currentLoss >= ls.loss_limit) {
      await client.query(
        `UPDATE loss_security 
         SET is_triggered = true, triggered_at = NOW() 
         WHERE user_id = $1`,
        [userId]
      );

      // Notification bhejo
      await sendLossAlert(userId, currentLoss, ls.loss_limit);

      return {
        allowed: false,
        reason: `Loss limit of ₹${ls.loss_limit} reached. Current loss: ₹${currentLoss}`
      };
    }

    return { allowed: true, currentLoss, limit: ls.loss_limit };

  } finally {
    client.release();
  }
};

// Broker se PnL fetch karo
const fetchPnLFromBroker = async (userId) => {
  try {
    const demat = await pool.query(
      `SELECT broker_name, api_key, access_token 
       FROM demat_accounts WHERE user_id = $1`,
      [userId]
    );
    if (!demat.rows.length) return 0;

    const { broker_name, api_key, access_token } = demat.rows[0];

    if (broker_name === 'zerodha') {
      // const kite = new KiteConnect({ api_key });
      // kite.setAccessToken(access_token);
      // const positions = await kite.getPositions();
      // return positions.net.reduce((sum, p) => sum + p.pnl, 0);
      return -8500; // demo value
    }
    return 0;
  } catch {
    return 0;
  }
};

// Daily midnight reset (cron mein lagao)
export const resetDailyLoss = async () => {
  await pool.query(`
    UPDATE loss_security
    SET current_loss = 0,
        is_triggered = false,
        triggered_at = NULL,
        reset_at = NOW(),
        updated_at = NOW()
    WHERE is_active = true
  `);
  console.log('✅ Daily loss reset done');
};

// Alert function
const sendLossAlert = async (userId, currentLoss, limit) => {
  const user = await pool.query(
    `SELECT name, email, phone FROM users WHERE id = $1`, [userId]
  );
  if (!user.rows.length) return;
  const { name, phone } = user.rows[0];

  // WhatsApp (tumhara existing sendWhatsAppMessage use karo)
  const message = `⚠️ *Loss Limit Alert - InvestBay*\n\nHi ${name},\n\nYour daily loss limit of ₹${limit} has been reached.\nCurrent Loss: ₹${currentLoss}\n\nAll new trades have been blocked for today.\nLimit resets at midnight.`;
  // await sendWhatsAppMessage(`91${phone}`, message);
  console.log('Alert sent to', name);
};



// ✅ Main function — PnL check + auto exit
export const monitorAndExitIfLimitHit = async (userId) => {
  const client = await pool.connect();
  try {
    // 1. Loss security active hai?
    const lsResult = await client.query(
      `SELECT * FROM loss_security WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    if (!lsResult.rows.length) return;
    const ls = lsResult.rows[0];

    // Already triggered — skip
    if (ls.is_triggered) return;

    // 2. Demat credentials lo
    const dematResult = await client.query(
      `SELECT * FROM demat_accounts WHERE user_id = $1 AND is_connected = true`,
      [userId]
    );
    if (!dematResult.rows.length) return;
    const demat = dematResult.rows[0];

    // 3. Angel One se connect karo
    const smart = new SmartAPI({ api_key: process.env.ANGELONE_API_KEY });
    smart.setAccessToken(demat.access_token);

    // 4. Current positions lo
    const positions = await smart.getPosition();
    console.log("📊 Positions:", JSON.stringify(positions, null, 2));

    if (!positions.status || !positions.data) return;

    // 5. Total unrealized loss calculate karo
    const allPositions = [
      ...(positions.data.net || []),
      ...(positions.data.day || [])
    ];

    let totalLoss = 0;
    const losingPositions = [];

    allPositions.forEach(pos => {
      const pnl = parseFloat(pos.unrealised || pos.pnl || 0);
      if (pnl < 0) {
        totalLoss += Math.abs(pnl);
        losingPositions.push(pos);
      }
    });

    console.log(`💰 Total loss: ₹${totalLoss}, Limit: ₹${ls.loss_limit}`);

    // 6. DB update karo
    await client.query(
      `UPDATE loss_security SET current_loss = $1, updated_at = NOW() WHERE user_id = $2`,
      [totalLoss, userId]
    );

    // 7. Limit hit check
    if (totalLoss >= ls.loss_limit) {
      console.log(`🚨 Loss limit hit! Exiting all positions...`);

      // 8. Saari losing positions exit karo
      const exitResults = await exitAllPositions(smart, losingPositions);

      // 9. DB mein triggered mark karo
      await client.query(
        `UPDATE loss_security 
         SET is_triggered = true, triggered_at = NOW(), updated_at = NOW()
         WHERE user_id = $1`,
        [userId]
      );

      // 10. Log karo
      await client.query(
        `INSERT INTO loss_logs 
           (user_id, instrument, pnl, cumulative_loss, action_taken, logged_at)
         VALUES ($1, $2, $3, $4, 'auto_exit', NOW())`,
        [userId, 'ALL_POSITIONS', -totalLoss, totalLoss]
      );

      // 11. Alert bhejo
      await sendLossAlert(userId, totalLoss, ls.loss_limit);

      return { triggered: true, totalLoss, exitResults };
    }

    return { triggered: false, totalLoss };

  } catch (err) {
    console.error('Monitor error:', err.message);
  } finally {
    client.release();
  }
};

// ✅ All positions exit karo
const exitAllPositions = async (smart, positions) => {
  const results = [];

  for (const pos of positions) {
    try {
      // Quantity 0 hai toh skip
      if (!pos.netqty || pos.netqty === '0') continue;

      const qty = Math.abs(parseInt(pos.netqty));
      const isBuy = parseInt(pos.netqty) > 0;

      // Opposite order place karo — BUY position hai toh SELL karo
      const orderParams = {
        variety:          'NORMAL',
        tradingsymbol:    pos.tradingsymbol,
        symboltoken:      pos.symboltoken,
        transactiontype:  isBuy ? 'SELL' : 'BUY',  // opposite
        exchange:         pos.exchange,
        ordertype:        'MARKET',                  // market order — instant execute
        producttype:      pos.producttype,
        duration:         'DAY',
        quantity:         qty.toString(),
        price:            '0',
        triggerprice:     '0',
      };

      console.log(`📤 Exiting: ${pos.tradingsymbol} qty:${qty} side:${orderParams.transactiontype}`);

      const orderResult = await smart.placeOrder(orderParams);
      console.log(`✅ Exit order placed:`, orderResult);

      results.push({
        symbol: pos.tradingsymbol,
        qty,
        side: orderParams.transactiontype,
        success: orderResult.status,
        orderId: orderResult.data?.orderid
      });

    } catch (err) {
      console.error(`❌ Exit failed for ${pos.tradingsymbol}:`, err.message);
      results.push({
        symbol: pos.tradingsymbol,
        success: false,
        error: err.message
      });
    }
  }

  return results;
};