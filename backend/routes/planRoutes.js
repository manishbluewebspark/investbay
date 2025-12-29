import  express from 'express';
import upload from '../middleware/upload.js';
import { addPlan, getPlanById,getPlanNameByUserId, deletePlan, updatePlanStatus } from "../controllers/planController.js";

const router = express.Router();

router.post("/add-plan", upload.single('uplodedImage'), addPlan);
router.get("/get-plan-name/:userId", getPlanNameByUserId);
router.get("/:userId", getPlanById);
router.delete("/:id", deletePlan);
router.put("/status", updatePlanStatus);

export default router;