import { Signal } from "../models/Signal.js";

// =============================================== create Signal ===============================================

export const createSignal = async (req, res) => {
  try {
    const {
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

    const newSignal = await Signal.create({
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
    });

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

        const signals = await Signal.findAll({
            where: { userId }
        });

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
    const deletedCount = await Signal.destroy({
      where: { id, userId },
    });
    if (deletedCount === 0) {
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
}