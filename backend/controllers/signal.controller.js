import { pool } from '../db.js';
import {sendWhatsAppMessage} from '../utils/whatsappService.js'

// =============================================== create Signal ===============================================

// export const createSignal = async (req, res) => {
//   try {
//     const {
//       planId,
//       userId,
//       instrument,
//       instrumentType,
//       tradeDirection,
//       segment,
//       exchange,
//       duration,
//       riskRewardRatio,
//       subscriptionPlan,
//       entryPrice,
//       stopLoss,
//       targetFirst,
//       targetSecond,
//       targetThird,
//     } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Create signal using raw SQL query
//     const createSignalQuery = `
//       INSERT INTO signals (
//         plan_id, user_id, instrument, instrument_type, trade_direction,
//         segment, exchange, duration, risk_reward_ratio, subscription_plan,
//         entry_price, stop_loss, target_first, target_second, target_third,
//         status, created_at, updated_at
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
//       RETURNING *
//     `;

//     const values = [
//       planId,
//       userId,
//       instrument,
//       instrumentType,
//       tradeDirection,
//       segment,
//       exchange,
//       duration,
//       riskRewardRatio,
//       subscriptionPlan,
//       entryPrice,
//       stopLoss,
//       targetFirst,
//       targetSecond || null,
//       targetThird || null
//     ];

//     const result = await pool.query(createSignalQuery, values);
//     const newSignal = result.rows[0];

//     return res.status(201).json({
//       message: "Signal created successfully",
//       data: newSignal,
//     });
//   } catch (error) {
//     console.error("Signal creation error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };



// export const createSignal = async (req, res) => {
//   try {
//     const {
//       planId, userId, instrument, instrumentType, tradeDirection,
//       segment, exchange, duration, riskRewardRatio, subscriptionPlan,
//       entryPrice, stopLoss, targetFirst, targetSecond, targetThird,
//     } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // 1. Signal Database mein create karo
//     const createSignalQuery = `
//       INSERT INTO signals (
//         plan_id, user_id, instrument, instrument_type, trade_direction,
//         segment, exchange, duration, risk_reward_ratio, subscription_plan,
//         entry_price, stop_loss, target_first, target_second, target_third,
//         status, created_at, updated_at
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
//       RETURNING *
//     `;

//     const values = [
//       planId, userId, instrument, instrumentType, tradeDirection,
//       segment, exchange, duration, riskRewardRatio, subscriptionPlan,
//       entryPrice, stopLoss, targetFirst, targetSecond || null, targetThird || null
//     ];

//     const result = await pool.query(createSignalQuery, values);
//     const newSignal = result.rows[0];

//     // 2. Sabko WhatsApp message bhejo (background mein)
//     sendToAllSubscribers(newSignal).catch(console.error);

//     return res.status(201).json({
//       message: "✅ Signal created successfully & sent to subscribers!",
//       data: newSignal,
//     });

//   } catch (error) {
//     console.error("Signal creation error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // Background function - WhatsApp messages bhejne ke liye
// const sendToAllSubscribers = async (signal) => {
//   try {
//     // Active subscribers fetch karo
//     // const subscribersQuery = `
//     //   SELECT DISTINCT u.phone_number, u.name
//     //   FROM users u
//     //   JOIN user_subscriptions us ON u.id = us.user_id
//     //   WHERE us.status = 'active' 
//     //   AND us.plan_id = $1 
//     //   AND u.phone_number IS NOT NULL
//     // `;


//      const subscribersQuery = `
//       SELECT DISTINCT phone,name
//       FROM users WHERE  role='user' AND is_verified=true 
//       AND phone IS NOT NULL
//     `;



//     const subscribersResult = await pool.query(subscribersQuery);
//     const subscribers = subscribersResult.rows;

//     console.log(`📱 ${subscribers.length} subscribers ko signal bhej raha hu...`);

//     // Har ek ko message bhejo
//     for (const subscriber of subscribers) {
//       const message = formatWhatsAppMessage(signal, subscriber.name);
//       const phoneNumber = `91${subscriber.phone}`; // India country code
      
//       const result = await sendWhatsAppMessage(phoneNumber, message);
      
//       if (result) {
//         console.log(`✅ Message sent to ${subscriber.name}`);
//       } else {
//         console.log(`❌ Failed for ${subscriber.name}`);
//       }
      
//       // Rate limiting - 2 second wait
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }

//   } catch (error) {
//     console.error('WhatsApp sending error:', error);
//   }
// };

// // WhatsApp ke liye perfect message format
// const formatWhatsAppMessage = (signal, userName) => {
//   return `🚨 *LIVE SIGNAL ALERT* 🚨

// Namaste *${userName}*,

// *📊 FRESH TRADE SIGNAL*

// 🔹 *Symbol:* ${signal.instrument}
// 🔹 *Type:* ${signal.instrument_type}
// 🔹 *Direction:* ${signal.trade_direction}
// 🔹 *Entry:* ₹${signal.entry_price}
// 🔹 *Stop Loss:* ₹${signal.stop_loss}
// 🔹 *Target 1:* ₹${signal.target_first}
// 🔹 *Target 2:* ${signal.target_second ? `₹${signal.target_second}` : '📈 Coming Soon'}
// 🔹 *Target 3:* ${signal.target_third ? `₹${signal.target_third}` : '📈 Coming Soon'}

// ⚖️ *Risk:Reward:* 1:${signal.risk_reward_ratio}
// ⏰ *Duration:* ${signal.duration}
// 🏦 *Exchange:* ${signal.exchange}

// ⚡ *IMMEDIATELY TRADE KARO!*

// *Disclaimer:* Apne risk pe trade karo.

// *Happy Trading!* 🚀`;
// };




const sendToAllSubscribers = async (signal) => {
  try {
    // 1. Company name research_analysts table se nikalo
    const analystQuery = `
      SELECT company_name FROM research_analysts 
      WHERE user_id = $1
    `;
    const analystResult = await pool.query(analystQuery, [signal.user_id]);
    const companyName = analystResult.rows[0]?.company_name || "InvestBay Research";

    // 2. Active subscribers lo
    const subscribersQuery = `
      SELECT DISTINCT u.phone_number, u.name
      FROM users u
      JOIN user_subscriptions us ON u.id = us.user_id
      WHERE us.status = 'active' 
      AND us.plan_id = $1 
      AND u.phone_number IS NOT NULL
    `;
    const subscribersResult = await pool.query(subscribersQuery, [signal.plan_id]);
    const subscribers = subscribersResult.rows;

    console.log(`📱 ${subscribers.length} subscribers ko signal bhej raha hu...`);

    // 3. Har subscriber ko message bhejo
    for (const subscriber of subscribers) {
      const message = formatPerfectWhatsAppMessage(signal, companyName, subscriber.name);
      const phoneNumber = `91${subscriber.phone_number}`;
      
      await sendWhatsAppMessage(phoneNumber, message);
      console.log(`✅ Signal sent to ${subscriber.name}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

  } catch (error) {
    console.error('WhatsApp send error:', error);
  }
};

// 📱 PERFECT WHATSAPP MESSAGE FORMAT
const formatPerfectWhatsAppMessage = (signal, companyName, subscriberName) => {
  const signalUrl = `https://www.investbay.in/signal-details/${signal.id}`;
  const recommendedDate = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return `📌 *Your mentor has added a NEW SIGNAL*

📌 *Recommendation Name:* "${signal.instrument} ${signal.instrument_type} [${signal.id}]"
📌 *Recommended Date:* "${recommendedDate}"
🧑‍💼 *Provided by:* "${companyName}"
📝 *Signal Details:*
• *Direction:* ${signal.trade_direction}
• *Entry:* ₹${signal.entry_price}
• *Stop Loss:* ₹${signal.stop_loss}
• *Target 1:* ₹${signal.target_first}
• *Target 2:* ${signal.target_second ? `₹${signal.target_second}` : '📈'}
• *Target 3:* ${signal.target_third ? `₹${signal.target_third}` : '📈'}
• *RR Ratio:* 1:${signal.risk_reward_ratio}
• *Duration:* ${signal.duration}
• *Exchange:* ${signal.exchange}

🔔 *This was a:* "${signal.subscription_plan || 'Premium Signal'}"

🔗 *Signal:* ${signalUrl}
🔗 *Mentor Profile:* https://www.investbay.in/mentors/${signal.user_id}

⚡ *Review karo aur action lo immediately!*`;
};

export const createSignal = async (req, res) => {
  try {
    const {
      planId, userId, instrument, instrumentType, tradeDirection,
      segment, exchange, duration, riskRewardRatio, subscriptionPlan,
      entryPrice, stopLoss, targetFirst, targetSecond, targetThird,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Signal create karo
    const createSignalQuery = `
      INSERT INTO signals (
        plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [
      planId, userId, instrument, instrumentType, tradeDirection,
      segment, exchange, duration, riskRewardRatio, subscriptionPlan,
      entryPrice, stopLoss, targetFirst, targetSecond || null, targetThird || null
    ];

    const result = await pool.query(createSignalQuery, values);
    const newSignal = result.rows[0];

    // WhatsApp background mein bhejo
    sendToAllSubscribers(newSignal).catch(console.error);

    return res.status(201).json({
      message: "✅ Signal created & WhatsApp notifications sent!",
      data: newSignal,
    });

  } catch (error) {
    console.error("Signal creation error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// =============================================== get Signals ===============================================

export const getSignals = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Get signals using raw SQL query
    const getSignalsQuery = `
      SELECT 
        id, plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        status, created_at, updated_at
      FROM signals 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(getSignalsQuery, [userId]);
    const signals = result.rows;

    return res.status(200).json({
      success: true,
      message: "Signals retrieved successfully",
      data: signals || []
    });

  } catch (error) {
    console.error("Error retrieving signals:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



export const getAllSignals = async (req, res) => {
  try {
  

    // Get signals using raw SQL query
    const getSignalsQuery = `
      SELECT 
        id, plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        status, created_at, updated_at
      FROM signals ORDER BY created_at DESC
    `;

    const result = await pool.query(getSignalsQuery);
    const signals = result.rows;

    console.log(signals, 1000)

    return res.status(200).json({
      success: true,
      message: "Signals retrieved successfully",
      data: signals || []
    });

  } catch (error) {
    console.error("Error retrieving signals:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// =============================================== delete Signal ===============================================

export const deleteSignal = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "User ID and Signal ID are required",
      });
    }

    // Delete signal using raw SQL query
    const deleteSignalQuery = `
      DELETE FROM signals 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await pool.query(deleteSignalQuery, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Signal not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Signal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting signal:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};