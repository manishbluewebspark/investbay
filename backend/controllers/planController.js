import { Plan } from "../models/Plan.js";

// =============================================== add Plan ===============================================

export const addPlan = async (req, res) => {
    try {
        const { userId, planName, segment, category, risk, idealCapital, duration, planPrice, discount, stopLoss, avgTrades, shortDescription, refundPolicy } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newPlan = await Plan.create({
            userId,
            uplodedImage: req.file,
            planName,
            segment,
            category,
            risk,
            idealCapital,
            duration,
            planPrice,
            discount,
            stopLoss,
            avgTrades,
            shortDescription,
            refundPolicy
        });
        res.status(201).json({ message: "plan addded successfully", data: newPlan });
    } catch (error) {
        console.log("plan adding error", error);
        res.status(500).json({ message: "internal server error", error: error.message });
    }
}

// =============================================== get paln  by id ===============================================

export const getPlanById = async (req, res) => {
    try {
        const { userId } = req.params;
        const plan = await Plan.findOne({ where: { userId } });
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.status(200).json({ data: plan});
    }
    catch (error) {
        console.log("Get plan by ID error", error);
        res.status(500).json({ message: "internal server error", error: error.message});
    }
}

// =============================================== delete plan ===============================================

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log("REQ BODY:", req.body);
    console.log("Delete plan called with:", id, userId);

    if (!userId) {
      return res.status(400).json({ message: "userId missing" });
    }

    const plan = await Plan.findOne({
      where: { id, userId },
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.destroy();

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.log("Delete plan error", error);
    res.status(500).json({ message: "internal server error" });
  }
};



// =============================================== update plan status ===============================================

export const updatePlanStatus = async (req, res) => {
    try {
        const { planId, userId, status } = req.body;

        if (!planId || !userId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const plan = await Plan.findOne({
            where: {
                id: planId,
                userId: userId,
            },
        });

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        plan.status = status;
        await plan.save();

        res.status(200).json({
            message: "Plan status updated successfully",
            status: plan.status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// =============================================== get plan name by userId ===============================================


export const getPlanNameByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await Plan.findAll({ 
      where: { userId },
      attributes: ['id', 'planName']
    });

    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No plans found for this user" });
    }

    const planData = plans.map(plan => ({
      id: plan.id,
      name: plan.planName,
    }));

    res.status(200).json(planData); 
  } catch (error) {
    console.error("Get plan name by user ID error:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};
