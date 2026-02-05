import { pool } from '../db.js';

// =============================================== create Signal ===============================================

export const createSignal = async (req, res) => {
  try {
    const {
      planId,
      userId,
      instrument,
      instrumentType,
      tradeDirection,
      segment,
      exchange,
      duration,
      riskRewardRatio,
      subscriptionPlan,
      entryPrice,
      stopLoss,
      targetFirst,
      targetSecond,
      targetThird,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Create signal using raw SQL query
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
      planId,
      userId,
      instrument,
      instrumentType,
      tradeDirection,
      segment,
      exchange,
      duration,
      riskRewardRatio,
      subscriptionPlan,
      entryPrice,
      stopLoss,
      targetFirst,
      targetSecond || null,
      targetThird || null
    ];

    const result = await pool.query(createSignalQuery, values);
    const newSignal = result.rows[0];

    return res.status(201).json({
      message: "Signal created successfully",
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