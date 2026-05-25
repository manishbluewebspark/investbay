import { pool } from '../db.js';
import { sendWhatsAppMessage } from '../utils/whatsappService.js'
import { checkAndEnforceLoss } from './lossSecurityController.js';

// =============================================== create Signal ===============================================

const sendToAllSubscribers = async (signal) => {
  try {
    // 1. Company name research_analysts table se nikalo
    const analystQuery = `
      SELECT company_name, name FROM research_analysts 
      WHERE user_id = $1
    `;
    const analystResult = await pool.query(analystQuery, [signal.user_id]);
    const companyName = analystResult.rows[0]?.company_name || analystResult.rows[0]?.name || "Research Analyst";

    // 2. Verified users with phone and role = 'user' lo
    const usersQuery = `
      SELECT DISTINCT phone, name
      FROM users
      WHERE is_verified = true 
      AND phone IS NOT NULL 
      AND phone != ''
      AND role = 'user'
    `;
    const usersResult = await pool.query(usersQuery);
    const verifiedUsers = usersResult.rows;

    console.log(`📱 ${verifiedUsers.length} verified users ko signal bhej raha hu...`);

    let successCount = 0;
    let failCount = 0;

    // 3. Har verified user ko message bhejo
    for (const user of verifiedUsers) {
      // Check if phone exists and is valid
      if (!user.phone) {
        console.log(`⚠️ Skipping ${user.name} - No phone number`);
        failCount++;
        continue;
      }

      const message = formatPerfectWhatsAppMessage(signal, companyName, user.name);

      // 🔥 FIXED: Proper phone number formatting for WhatsApp
      let phoneNumber = user.phone.toString().trim();
      const originalPhone = phoneNumber; // Store original for logging

      // Remove all non-numeric characters
      phoneNumber = phoneNumber.replace(/\D/g, '');

      // WhatsApp India numbers should be: 91XXXXXXXXXX (12 digits total)
      // Step-by-step fixing:

      // Step 1: Remove leading zero if present
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }

      // Step 2: Handle different formats
      if (phoneNumber.length === 10) {
        // Simple 10-digit number: add 91 prefix
        phoneNumber = `91${phoneNumber}`;
      }
      else if (phoneNumber.length === 12 && phoneNumber.startsWith('91')) {
        // Already correct format: keep as is
        console.log(`✅ Valid WhatsApp format: ${phoneNumber}`);
      }
      else if (phoneNumber.length === 11) {
        // 11 digits -可能是带0的号码或者少了一位
        if (phoneNumber.startsWith('91')) {
          // 91 + 9 digits? 缺少一位
          console.log(`⚠️ Invalid: 91 prefix but only 9 digits after`);
          failCount++;
          continue;
        } else {
          // 可能是0开头然后10位数字
          phoneNumber = `91${phoneNumber.substring(1)}`; // Remove leading 0 and add 91
        }
      }
      else if (phoneNumber.length > 12) {
        // Too long - take last 10 digits and add 91
        const last10Digits = phoneNumber.slice(-10);
        phoneNumber = `91${last10Digits}`;
      }
      else {
        console.log(`⚠️ Skipping ${user.name} - Invalid phone format: ${originalPhone} (cleaned: ${phoneNumber})`);
        failCount++;
        continue;
      }

      // Final validation: Must be exactly 12 digits and start with 91
      if (!phoneNumber.startsWith('91') || phoneNumber.length !== 12) {
        console.log(`❌ Invalid WhatsApp number for ${user.name}: ${phoneNumber} (original: ${originalPhone})`);
        failCount++;
        continue;
      }

      console.log(`📞 Sending to ${user.name}: ${phoneNumber} (original: ${originalPhone})`);

      try {
        await sendWhatsAppMessage(phoneNumber, message);
        console.log(`✅ Signal sent to ${user.name}`);
        successCount++;
      } catch (whatsappError) {
        console.error(`❌ Failed to send to ${user.name} (${phoneNumber}):`, whatsappError.message);
        failCount++;
        // Check specific error types
        if (whatsappError.message.includes('404')) {
          console.log(`   💡 Tip: Number ${phoneNumber} might not be registered on WhatsApp or API endpoint is wrong`);
        } else if (whatsappError.message.includes('rate')) {
          console.log(`   ⏳ Rate limited - waiting longer...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait extra if rate limited
        }
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`🎉 Signal sending process completed: ✅ ${successCount} successful, ❌ ${failCount} failed`);

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

🔗 *Signal:* ${signalUrl}
🔗 *Mentor Profile:* https://www.investbay.in/mentors/${signal.user_id}

⚡ *Please review the details and take necessary action.!*`;
};




export const testWhatsAppAPI = async () => {
  try {
    // Check if credentials are set
    if (!process.env.ULTRAMSG_INSTANCE_ID || !process.env.ULTRAMSG_API_KEY) {
      throw new Error('ULTRAMSG_INSTANCE_ID or ULTRAMSG_API_KEY not set in environment');
    }

    const testNumber = "919111017074";
    const testMessage = `🧪 Test message from InvestBay - ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    console.log("🧪 Testing UltraMsg API...");
    console.log("📱 Instance ID:", process.env.ULTRAMSG_INSTANCE_ID);
    console.log("📞 Test Number:", testNumber);

    const result = await sendWhatsAppMessage(testNumber, testMessage);

    console.log("✅ UltraMsg API test successful!");
    console.log("📦 Response:", result);
    return true;

  } catch (error) {
    console.error("❌ UltraMsg API test failed:", error.message);
    console.log("\n💡 Troubleshooting UltraMsg:");
    console.log("   1. Check if your Instance ID is correct:", process.env.ULTRAMSG_INSTANCE_ID);
    console.log("   2. Verify your API Key is valid");
    console.log("   3. Make sure the phone number 919111017074 is:");
    console.log("      - Registered on WhatsApp");
    console.log("      - Hasn't blocked your number");
    console.log("      - In correct format (91 + 10 digits)");
    console.log("   4. Check your UltraMsg dashboard for:");
    console.log("      - Account balance/credits");
    console.log("      - Instance status (should be connected)");
    console.log("      - Message logs for more details");
    return false;
  }
};






export const createSignal = async (req, res) => {
  try {
    const {
      planId, userId, instrument, instrumentType, tradeDirection,
      segment, exchange, duration, riskRewardRatio, subscriptionPlan,
      entryPrice, stopLoss, targetFirst, targetSecond, targetThird, is_paid, script, strike_price, scriptToken, scriptName
    } = req.body;
    console.log(req.body)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }


    // ✅ Loss check pehle
    const lossCheck = await checkAndEnforceLoss(userId, {
      instrument: req.body.instrument,
      trade_id: null
    });

    if (!lossCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: lossCheck.reason
      });
    }

    // // Signal create karo
    const createSignalQuery = `
      INSERT INTO signals (
        plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        is_paid,strike_price,script,script_token,status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 , $17 , $18 , $19 ,'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const values = [
      planId, userId, script, instrumentType, tradeDirection,
      segment, exchange, duration, riskRewardRatio, subscriptionPlan,
      entryPrice, stopLoss, targetFirst, targetSecond || null, targetThird || null, is_paid || false, strike_price || null, scriptName || '', scriptToken || null
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




export const getSignalsFree = async (req, res) => {
  try {

    // Get signals using raw SQL query
    const getSignalsQuery = `
      SELECT 
        id, plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        status, created_at, updated_at
      FROM signals 
      WHERE is_paid=false 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(getSignalsQuery);
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




export const getSignalsPaid = async (req, res) => {
  try {


    // Get signals using raw SQL query
    const getSignalsQuery = `
      SELECT 
        id, plan_id, user_id, instrument, instrument_type, trade_direction,
        segment, exchange, duration, risk_reward_ratio, subscription_plan,
        entry_price, stop_loss, target_first, target_second, target_third,
        status, created_at, updated_at
      FROM signals 
      WHERE is_paid=true
      ORDER BY created_at DESC
    `;

    const result = await pool.query(getSignalsQuery);
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



    return res.status(200).json({
      success: true,
      message: "Signals retrieved successfully",
      data: signals || {}
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


export const getAllSignalsbyid = async (req, res) => {
  try {

    const { id } = req.params

    // Get signals using raw SQL query
    const getSignalsQuery = `SELECT 
  s.*,
  

  p.*,
  
  ra.*
  
FROM signals s
LEFT JOIN plans p ON s.plan_id = p.id
LEFT JOIN research_analysts ra ON s.user_id = ra.id
WHERE s.id = $1
ORDER BY s.created_at DESC`

    const result = await pool.query(getSignalsQuery, [id]);
    const signals = result.rows[0];



    return res.status(200).json({
      success: true,
      message: "Signals retrieved successfully",
      data: signals || {}
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





// export const getSignalsFreeWithLimit = async (req, res) => {
//     try {
//         // Check if user exists
//         if (!req.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Authentication required'
//             });
//         }

//         const userId = req.user.id;

//         // Check subscription
//         let hasActiveSubscription = false;
//         try {
//             const subscriptionCheck = await pool.query(`
//                 SELECT * FROM plans 
//                 WHERE user_id = $1 
//                 AND status = 'active' 

//             `, [userId]);

//             hasActiveSubscription = subscriptionCheck.rows.length > 0;
//         } catch (subError) {
//             console.log('Subscription check error:', subError.message);
//         }

//         // Get all free signals
//         const signalsResult = await pool.query(`
//             SELECT s.*, 
//                    p.plan_name,
//                    p.plan_price
//             FROM signals s
//             LEFT JOIN plans p ON s.plan_id = p.id
//             WHERE s.is_paid = false 
//             AND s.status = 'active'
//             ORDER BY s.created_at DESC
//         `);

//         // If subscribed - return all unlocked
//         if (hasActiveSubscription) {
//             const signalsWithAccess = signalsResult.rows.map(signal => ({
//                 ...signal,
//                 canView: true,
//                 isLocked: false,
//                 alreadyViewed: false,
//                 unlockButton: true  // ✅ Unlock button available
//             }));

//             return res.status(200).json({
//                 success: true,
//                 data: signalsWithAccess,
//                 hasSubscription: true,
//                 viewedCount: 0,
//                 remainingViews: 'unlimited',
//                 limitReached: false
//             });
//         }

//         // Get viewed signals count (UNIQUE signals only)
//         const viewCountResult = await pool.query(`
//             SELECT COUNT(DISTINCT signal_id) as count 
//             FROM user_signal_views 
//             WHERE user_id = $1
//         `, [userId]);

//         const viewedCount = parseInt(viewCountResult.rows[0]?.count || '0');
//         const FREE_LIMIT = 5;
//         const remainingViews = Math.max(0, FREE_LIMIT - viewedCount);

//         // Get which signals user has already viewed
//         const viewedSignals = await pool.query(`
//             SELECT signal_id FROM user_signal_views WHERE user_id = $1
//         `, [userId]);

//         const viewedSignalIds = new Set(viewedSignals.rows.map(v => v.signal_id));

//         // Prepare signals with access info
//         const signalsWithAccess = signalsResult.rows.map((signal) => {
//             const alreadyViewed = viewedSignalIds.has(signal.id);

//             // ✅ UNLOCK BUTTON LOGIC:
//             // - Agar already viewed hai to unlock button dikhega
//             // - Agar remaining views hain to unlock button dikhega
//             // - Agar limit reached hai to lock dikhega
//             const canView = alreadyViewed || remainingViews > 0;

//             return {
//                 ...signal,
//                 alreadyViewed,
//                 canView,
//                 isLocked: !canView,
//                 unlockButton: !alreadyViewed && remainingViews > 0, // ✅ Naye signals ke liye unlock button
//                 remainingViews
//             };
//         });

//         res.status(200).json({
//             success: true,
//             data: signalsWithAccess,
//             viewedCount,
//             remainingViews,
//             limit: FREE_LIMIT,
//             limitReached: remainingViews === 0,
//             hasSubscription: false
//         });

//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

// ============================================
// 3. TRACK SIGNAL VIEW (COUNT INCREASE)
// ============================================



// export const trackSignalView = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user.id;

//         console.log(`📝 Tracking view for user ${userId}, signal ${id}`);

//         // Check if already viewed (unique constraint will prevent duplicate)
//         const existing = await pool.query(`
//             SELECT * FROM user_signal_views 
//             WHERE user_id = $1 AND signal_id = $2
//         `, [userId, id]);

//         // Agar already viewed hai to return karo (count nahi badhega)
//         if (existing.rows.length > 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Signal already viewed',
//                 alreadyViewed: true,
//                 tracked: false
//             });
//         }

//         // Check current UNIQUE view count
//         const viewCount = await pool.query(`
//             SELECT COUNT(DISTINCT signal_id) as count 
//             FROM user_signal_views 
//             WHERE user_id = $1
//         `, [userId]);

//         const currentCount = parseInt(viewCount.rows[0]?.count || '0');

//         // Agar limit cross ho gayi to reject
//         if (currentCount >= 5) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Free limit reached',
//                 limitReached: true
//             });
//         }

//         // ✅ INSERT new view (count +1 hoga)
//         await pool.query(`
//             INSERT INTO user_signal_views (user_id, signal_id)
//             VALUES ($1, $2)
//         `, [userId, id]);

//         const newCount = currentCount + 1;
//         console.log(`✅ New signal tracked. Total unique views: ${newCount}`);

//         res.status(200).json({
//             success: true,
//             message: 'Signal view tracked',
//             tracked: true,
//             viewedCount: newCount,
//             remainingViews: 5 - newCount
//         });

//     } catch (error) {
//         console.error('Error tracking view:', error);

//         // Unique constraint violation error
//         if (error.code === '23505') {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Signal already viewed',
//                 alreadyViewed: true
//             });
//         }

//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };


export const getSignalsFreeWithLimit = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userId = req.user.id;

    // Check subscription
    let hasActiveSubscription = false;
    try {
      const subscriptionCheck = await pool.query(`
                SELECT * FROM plans 
                WHERE user_id = $1 
                AND status = 'active' 
                AND end_date > NOW()
            `, [userId]);
      hasActiveSubscription = subscriptionCheck.rows.length > 0;
    } catch (subError) {
      console.log('Subscription check error:', subError.message);
    }

    // Get all free signals
    const signalsResult = await pool.query(`
            SELECT s.*, p.plan_name, p.plan_price
            FROM signals s
            LEFT JOIN plans p ON s.plan_id = p.id
            WHERE s.is_paid = false AND s.status = 'active'
            ORDER BY s.created_at DESC
        `);

    // If subscribed - return all unlocked
    if (hasActiveSubscription) {
      return res.status(200).json({
        success: true,
        data: signalsResult.rows.map(signal => ({
          ...signal,
          canView: true,
          isLocked: false,
          alreadyViewed: false,
          unlockButton: false
        })),
        hasSubscription: true,
        viewedCount: 0,
        remainingViews: 'unlimited',
        limitReached: false
      });
    }

    // ✅ FIX: Get UNIQUE viewed signals count
    const viewCountResult = await pool.query(`
            SELECT COUNT(DISTINCT signal_id) as count 
            FROM user_signal_views 
            WHERE user_id = $1
        `, [userId]);

    const viewedCount = parseInt(viewCountResult.rows[0]?.count || '0');
    const FREE_LIMIT = 5;
    const remainingViews = Math.max(0, FREE_LIMIT - viewedCount);

    // Get which signals user has already viewed
    const viewedSignals = await pool.query(`
            SELECT signal_id FROM user_signal_views WHERE user_id = $1
        `, [userId]);

    const viewedSignalIds = new Set(viewedSignals.rows.map(v => v.signal_id));

    // ✅ Prepare signals with proper flags
    const signalsWithAccess = signalsResult.rows.map((signal) => {
      const alreadyViewed = viewedSignalIds.has(signal.id);

      // ✅ UNLOCK BUTTON LOGIC:
      // - unlockButton true tabhi hoga jab:
      //   1. User logged in hai
      //   2. Signal already viewed nahi hai
      //   3. Remaining views > 0
      const unlockButton = !alreadyViewed && remainingViews > 0;

      // isLocked true tabhi hoga jab:
      //   1. Already viewed nahi hai
      //   2. Remaining views = 0
      const isLocked = !alreadyViewed && remainingViews === 0;

      return {
        ...signal,
        alreadyViewed,
        canView: alreadyViewed || remainingViews > 0,
        isLocked,
        unlockButton,  // ✅ YEH IMPORTANT HAI
        remainingViews
      };
    });

    console.log('✅ Signals prepared:', signalsWithAccess.map(s => ({
      id: s.id,
      alreadyViewed: s.alreadyViewed,
      unlockButton: s.unlockButton,
      isLocked: s.isLocked
    })));

    res.status(200).json({
      success: true,
      data: signalsWithAccess,
      viewedCount,
      remainingViews,
      limit: FREE_LIMIT,
      limitReached: remainingViews === 0,
      hasSubscription: false
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




export const trackSignalView = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`📝 Tracking view for user ${userId}, signal ${id}`);

    // Check if already viewed
    const existing = await pool.query(`
            SELECT * FROM user_signal_views 
            WHERE user_id = $1 AND signal_id = $2
        `, [userId, id]);

    if (existing.rows.length > 0) {
      console.log(`ℹ️ Signal ${id} already viewed`);
      return res.status(200).json({
        success: true,
        message: 'Signal already viewed',
        alreadyViewed: true,
        tracked: false
      });
    }

    // Check current UNIQUE view count
    const viewCount = await pool.query(`
            SELECT COUNT(DISTINCT signal_id) as count 
            FROM user_signal_views 
            WHERE user_id = $1
        `, [userId]);

    const currentCount = parseInt(viewCount.rows[0]?.count || '0');

    if (currentCount >= 5) {
      console.log(`⚠️ User ${userId} limit reached`);
      return res.status(403).json({
        success: false,
        message: 'Free limit reached',
        limitReached: true
      });
    }

    // ✅ INSERT new view
    await pool.query(`
            INSERT INTO user_signal_views (user_id, signal_id)
            VALUES ($1, $2)
        `, [userId, id]);

    const newCount = currentCount + 1;
    console.log(`✅ View tracked. Total: ${newCount}`);

    res.status(200).json({
      success: true,
      message: 'Signal view tracked',
      tracked: true,
      viewedCount: newCount,
      remainingViews: 5 - newCount
    });

  } catch (error) {
    console.error('Error:', error);

    if (error.code === '23505') { // Unique violation
      return res.status(200).json({
        success: true,
        message: 'Signal already viewed',
        alreadyViewed: true
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// ============================================
// 4. GET USER FREE COUNT
// ============================================
export const getUserFreeSignalCount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Auth required' });
    }

    const userId = req.user.id;

    const result = await pool.query(`
            SELECT COUNT(DISTINCT signal_id) as count 
            FROM user_signal_views 
            WHERE user_id = $1
        `, [userId]);

    const count = parseInt(result.rows[0]?.count || '0');

    res.status(200).json({
      success: true,
      data: {
        viewedCount: count,
        remainingCount: Math.max(0, 5 - count),
        limit: 5,
        limitReached: count >= 5
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 5. GET PAID SIGNALS WITH ACCESS
// ============================================
// export const getSignalsPaidWithAccess = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ success: false, message: 'Auth required' });
//         }

//         const userId = req.user.id;

//         // Check subscription
//         const subscriptionCheck = await pool.query(`
//             SELECT * FROM plans 
//             WHERE user_id = $1 
//             AND status = 'active' 
//         `, [userId]);

//         const hasActiveSubscription = subscriptionCheck.rows.length > 0;

//         // Get paid signals
//         const signalsResult = await pool.query(`
//             SELECT s.*, p.plan_name, p.plan_price
//             FROM signals s
//             LEFT JOIN plans p ON s.plan_id = p.id
//             WHERE s.is_paid = true AND s.status = 'active'
//             ORDER BY s.created_at DESC
//         `);

//         if (hasActiveSubscription) {
//             return res.status(200).json({
//                 success: true,
//                 data: signalsResult.rows.map(s => ({ ...s, canView: true, isLocked: true })),
//                 hasSubscription: false
//             });
//         }

//         // Preview only
//         res.status(200).json({
//             success: true,
//             data: signalsResult.rows.map(s => ({
//                 id: s.id,
//                 instrument: s.instrument,
//                 instrument_type: s.instrument_type,
//                 segment: s.segment,
//                 created_at: s.created_at,
//                 status: s.status,
//                 is_paid: true,
//                 canView: false,
//                 isLocked: true,
//                 message: 'Subscribe to view'
//             })),
//             hasSubscription: false
//         });

//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };



export const getSignalsPaidWithAccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Auth required' });
    }

    const userId = req.user.id;

    // Get all active subscriptions for this user (plan-wise)
    const userSubscriptions = await pool.query(`
            SELECT *
            FROM plans 
            WHERE user_id = $1 
            AND status = 'active' 
        `, [userId]);




    const subscribedPlanIds = new Set(userSubscriptions.rows.map(sub => sub.id));

    console.log('User subscribed plans:', Array.from(subscribedPlanIds));

    // Get all paid signals with their plan details
    const signalsResult = await pool.query(`
            SELECT s.*, 
                   p.plan_name,
                   p.plan_price,
                   p.id as plan_id
            FROM signals s
            LEFT JOIN plans p ON s.plan_id = p.id
            WHERE s.is_paid = true AND s.status = 'active'
            ORDER BY s.created_at DESC
        `);

    // Prepare signals with plan-wise access info
    const signalsWithAccess = signalsResult.rows.map(signal => {
      const planId = signal.plan_id;
      const isSubscribedToPlan = planId ? subscribedPlanIds.has(planId) : false;

      return {
        ...signal,
        canView: isSubscribedToPlan,
        isLocked: !isSubscribedToPlan,
        requiredPlanId: planId,
        requiredPlanName: signal.plan_name || 'Premium Plan',
        message: isSubscribedToPlan
          ? 'Access granted'
          : `Subscribe to ${signal.plan_name || 'Premium Plan'} to view this signal`
      };
    });

    res.status(200).json({
      success: true,
      data: signalsWithAccess,
      hasAnySubscription: subscribedPlanIds.size > 0,
      subscribedPlanIds: Array.from(subscribedPlanIds)
    });

  } catch (error) {
    console.error('Error in getSignalsPaidWithAccess:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};