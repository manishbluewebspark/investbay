import { Plan } from "../models/Plan.js";
import { Signal } from "../models/Signal.js"
import ResearchAnalyst from "../models/ResearchAnalyst.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

// =============================================== add Plan ===============================================
export const addPlan = async (req, res) => {
    try {
        const { 
            userId, 
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
        } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Upload image to S3
        let s3ImageUrl = null;
        let s3ImageKey = null;
        
        if (req.file) {
            try {
                const s3ImageData = await uploadToS3(req.file, 'courses');
                console.log('Image uploaded to S3:', s3ImageData);
                s3ImageUrl = s3ImageData.url;
                s3ImageKey = s3ImageData.key;
            } catch (s3Error) {
                console.error('S3 upload failed:', s3Error);
                return res.status(500).json({ 
                    message: "Failed to upload image to S3", 
                    error: s3Error.message 
                });
            }
        }

        const newPlan = await Plan.create({
            userId,
            uplodedImage: s3ImageUrl, // ✅ सिर्फ URL string
            s3ImageKey: s3ImageKey,   // ✅ S3 key अलग से store
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

        res.status(201).json({ 
            message: "Plan added successfully", 
            data: newPlan 
        });
    } catch (error) {
        console.log("Plan adding error", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

// =============================================== update plan ===============================================
export const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            userId,
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
        } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Plan ID is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // 🔹 Check plan exists
        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        let newImageUrl = plan.uplodedImage;
        let newImageKey = plan.s3ImageKey;
        
        // If new file uploaded, upload to S3
        if (req.file) {
            try {
                // Upload new image to S3
                const s3ImageData = await uploadToS3(req.file, 'courses');
                console.log('New image uploaded to S3:', s3ImageData);
                newImageUrl = s3ImageData.url;
                newImageKey = s3ImageData.key;
                
                // Delete old image from S3 if exists
                if (plan.s3ImageKey) {
                    try {
                        await deleteFromS3(plan.s3ImageKey);
                        console.log('Old image deleted from S3:', plan.s3ImageKey);
                    } catch (deleteError) {
                        console.error('Failed to delete old image from S3:', deleteError);
                        // Continue even if old image deletion fails
                    }
                }
            } catch (s3Error) {
                console.error('S3 upload failed:', s3Error);
                return res.status(500).json({ 
                    message: "Failed to upload image to S3", 
                    error: s3Error.message 
                });
            }
        }

        // 🔹 Update plan
        await plan.update({
            userId,
            uplodedImage: newImageUrl,
            s3ImageKey: newImageKey,
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

        res.status(200).json({
            message: "Plan updated successfully",
            data: plan
        });

    } catch (error) {
        console.log("Plan updating error", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// =============================================== delete plan ===============================================
// export const deletePlan = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { userId } = req.body;

//         console.log("Delete plan called with:", id, userId);

//         if (!userId) {
//             return res.status(400).json({ message: "userId missing" });
//         }

//         const plan = await Plan.findOne({
//             where: { id, userId },
//         });

//         if (!plan) {
//             return res.status(404).json({ message: "Plan not found" });
//         }

//         if (plan.s3ImageKey) {
//             try {
//                 await deleteFromS3(plan.s3ImageKey);
//                 console.log('Image deleted from S3:', plan.s3ImageKey);
//             } catch (s3Error) {
//                 console.error('Failed to delete image from S3:', s3Error);
//             }
//         }

//         await plan.destroy();

//         res.status(200).json({ message: "Plan deleted successfully" });
//     } catch (error) {
//         console.log("Delete plan error", error);
//         res.status(500).json({ 
//             message: "Internal server error",
//             error: error.message 
//         });
//     }
// };
export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

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

        // ✅ Signals table se delete (planId match)
        await Signal.destroy({
            where: { planId: id }
        });

        console.log("Signals deleted for planId:", id);

        if (plan.s3ImageKey) {
            try {
                await deleteFromS3(plan.s3ImageKey);
                console.log('Image deleted from S3:', plan.s3ImageKey);
            } catch (s3Error) {
                console.error('Failed to delete image from S3:', s3Error);
            }
        }

        await plan.destroy();

        res.status(200).json({ message: "Plan and related signals deleted successfully" });

    } catch (error) {
        console.log("Delete plan error", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};


// =============================================== get plan by id ===============================================
export const getPlanByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const plan = await Plan.findAll({ where: { userId } });
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.status(200).json({ data: plan });
    } catch (error) {
        console.log("Get plan by ID error", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

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
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
};

// =============================================== get plan name by userId ===============================================
export const getPlanNameByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const plans = await Plan.findAll({ 
            where: { userId, status: 'active' },
            attributes: ['id', 'planName'],
        });

        if (!plans || plans.length === 0) {
            return res.status(404).json({ message: "No plans found for this user" });
        }

        const planData = plans.map(plan => ({
            id: plan.id,
            name: plan.planName,
            status: plan.status
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

// ========================================= GET ALL PLANS =============================================

export const getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();

        if (!plans || plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No plans found"
            });
        }

        res.status(200).json({
            success: true,
            data: plans
        });

    } catch (error) {
        console.log("Get all plans error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// ================================== get plan by id =====================================================

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get plan
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // 2️⃣ Get analyst using plan.userId matched with ResearchAnalyst.id
    const analyst = await ResearchAnalyst.findOne({
      where: { id: plan.userId }, // <- yaha change hua
    });

    res.status(200).json({
      success: true,
      data: {
        plan,
        analyst, // agar match nahi hua to null
      },
    });
  } catch (error) {
    console.log("Get plan by ID error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



