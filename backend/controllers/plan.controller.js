
import { pool } from '../db.js';
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

// =============================================== add Plan ===============================================
export const addPlan = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { 
            userId, planName, segment, category, risk, 
            idealCapital, duration, planPrice, discount, 
            stopLoss, avgTrades, shortDescription, refundPolicy 
        } = req.body;

        console.log('📥 Request data:', { userId, planName }); // DEBUG

        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }

        await client.query('BEGIN');

        // 🔥 USER VALIDATION - ये missing था!
        const userCheck = await client.query(
            'SELECT id FROM research_analysts WHERE id = $1',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                message: "User not found in research_analysts table" 
            });
        }

        console.log('✅ User verified:', userId);

        // S3 Upload
        let s3ImageUrl = null;
        let s3ImageKey = null;
        
        if (req.file) {
            const s3ImageData = await uploadToS3(req.file, 'courses');
            s3ImageUrl = s3ImageData.url;
            s3ImageKey = s3ImageData.key;
            console.log('✅ S3 upload:', s3ImageUrl);
        }

        // Insert Plan
        const query = `
            INSERT INTO plans (
                user_id, uploded_image, s3_image_key, plan_name, segment, 
                category, risk, ideal_capital, duration, plan_price, 
                discount, stop_loss, avg_trades, short_description, refund_policy
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        
        const values = [
            parseInt(userId),     // 🔥 INTEGER बनाएं!
            s3ImageUrl, 
            s3ImageKey, 
            planName, 
            segment, 
            category, 
            risk, 
            idealCapital, 
            duration, 
            planPrice, 
            discount || null, 
            stopLoss, 
            avgTrades, 
            shortDescription || null, 
            refundPolicy || null
        ];

        console.log('📤 Insert values preview:', {
            user_id: values[0],
            plan_name: values[3]
        });

        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({ 
            success: true,
            message: "Plan added successfully", 
            data: result.rows[0] 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('💥 Add Plan Error:', error.message);
        
        // Specific error messages
        if (error.message.includes('foreign key')) {
            return res.status(400).json({ 
                message: "Invalid user ID - RA not found" 
            });
        }
        
        res.status(500).json({ 
            message: "Failed to add plan", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    } finally {
        client.release();
    }
};


// =============================================== update plan ===============================================
export const updatePlan = async (req, res) => {
    const client = await pool.connect();
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
        const checkQuery = `SELECT * FROM plans WHERE id = $1 AND user_id = $2`;
        const checkResult = await client.query(checkQuery, [id, userId]);
        const plan = checkResult.rows[0];

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        let newImageUrl = plan.uploded_image;
        let newImageKey = plan.s3_image_key;
        
        // If new file uploaded, upload to S3
        if (req.file) {
            try {
                // Upload new image to S3
                const s3ImageData = await uploadToS3(req.file, 'courses');
                console.log('New image uploaded to S3:', s3ImageData);
                newImageUrl = s3ImageData.url;
                newImageKey = s3ImageData.key;
                
                // Delete old image from S3 if exists
                if (plan.s3_image_key) {
                    try {
                        await deleteFromS3(plan.s3_image_key);
                        console.log('Old image deleted from S3:', plan.s3_image_key);
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
        const updateQuery = `
            UPDATE plans SET
                user_id = $1,
                uploded_image = $2,
                s3_image_key = $3,
                plan_name = $4,
                segment = $5,
                category = $6,
                risk = $7,
                ideal_capital = $8,
                duration = $9,
                plan_price = $10,
                discount = $11,
                stop_loss = $12,
                avg_trades = $13,
                short_description = $14,
                refund_policy = $15,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $16
            RETURNING *
        `;
        
        const values = [
            userId,
            newImageUrl,
            newImageKey,
            planName,
            segment,
            category,
            risk,
            idealCapital,
            duration,
            planPrice,
            discount || null,
            stopLoss,
            avgTrades,
            shortDescription || null,
            refundPolicy || null,
            id
        ];

        const result = await client.query(updateQuery, values);
        const updatedPlan = result.rows[0];

        res.status(200).json({
            message: "Plan updated successfully",
            data: updatedPlan
        });

    } catch (error) {
        console.log("Plan updating error", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    } finally {
        client.release();
    }
};

// =============================================== delete plan ===============================================
export const deletePlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { userId } = req.body;

        console.log("Delete plan called with:", id, userId);

        if (!userId) {
            return res.status(400).json({ message: "userId missing" });
        }

        // Check if plan exists
        const checkQuery = `SELECT * FROM plans WHERE id = $1 AND user_id = $2`;
        const checkResult = await client.query(checkQuery, [id, userId]);
        const plan = checkResult.rows[0];

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // ✅ Signals table se delete (planId match)
        const deleteSignalsQuery = `DELETE FROM signals WHERE plan_id = $1`;
        await client.query(deleteSignalsQuery, [id]);
        console.log("Signals deleted for planId:", id);

        if (plan.s3_image_key) {
            try {
                await deleteFromS3(plan.s3_image_key);
                console.log('Image deleted from S3:', plan.s3_image_key);
            } catch (s3Error) {
                console.error('Failed to delete image from S3:', s3Error);
            }
        }

        // Delete plan
        const deletePlanQuery = `DELETE FROM plans WHERE id = $1`;
        await client.query(deletePlanQuery, [id]);

        res.status(200).json({ message: "Plan and related signals deleted successfully" });

    } catch (error) {
        console.log("Delete plan error", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// =============================================== get plan by user id ===============================================
export const getPlanByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const query = `SELECT * FROM plans WHERE user_id = $1`;
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No plans found for this user" });
        }
        
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.log("Get plan by user ID error", error);
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

        const query = `
            UPDATE plans 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        
        const result = await pool.query(query, [status, planId, userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Plan not found" });
        }

        res.status(200).json({
            message: "Plan status updated successfully",
            status: result.rows[0].status,
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
        const query = `
            SELECT id, plan_name, status 
            FROM plans 
            WHERE user_id = $1 AND status = 'active'
        `;
        
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No plans found for this user" });
        }

        const planData = result.rows.map(plan => ({
            id: plan.id,
            name: plan.plan_name,
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
        const query = `SELECT * FROM plans ORDER BY created_at DESC`;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No plans found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows
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



// export const getAllPlansByUserId = async (req, res) => {
//     try {

//         const id = req.params.userId

//         console.log(id,1000 )

//         const query = `SELECT * FROM plans WHERE user_id = $1 `;
//         const result = await pool.query(query,[id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No plans found"
//             });
//         }

//           const plan = result.rows[0];


//         res.status(200).json({
//             success: true,
//             data: plan
//         });

//     } catch (error) {
//         console.log("Get all plans error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };


export const getAllPlansByUserId = async (req, res) => {
    try {
        const id = req.params.userId;
        console.log("User ID:", id);

        const query = `SELECT * FROM plans WHERE user_id = $1`;
        const result = await pool.query(query, [id]);

        // Instead of returning 404, return empty array with success true
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No plans found for this user",
                data: [] // Return empty array instead of error
            });
        }

        // If you want to return all plans (array), not just first one
        const plans = result.rows;

        res.status(200).json({
            success: true,
            data: plans // Return all plans as array
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
    const planQuery = `SELECT * FROM plans WHERE id = $1`;
    const planResult = await pool.query(planQuery, [id]);

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const plan = planResult.rows[0];

    // 2️⃣ Get analyst using plan.user_id matched with ResearchAnalyst.id
    const analystQuery = `SELECT * FROM research_analysts WHERE id = $1`;
    const analystResult = await pool.query(analystQuery, [plan.user_id]);
    const analyst = analystResult.rows[0] || null;

    res.status(200).json({
      success: true,
      data: {
        plan,
        analyst,
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