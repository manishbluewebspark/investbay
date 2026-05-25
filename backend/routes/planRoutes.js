import  express from 'express';
import upload from '../middleware/upload.js';
import { addPlan, getPlanById,getPlanNameByUserId, deletePlan, updatePlanStatus, updatePlan, getAllPlans, getPlanByUserId, getAllPlansByUserId } from "../controllers/plan.controller.js";

const router = express.Router();

router.post("/add-plan", upload.single('uplodedImage'), addPlan);
router.get("/plans", getAllPlans);
router.get("/plansbyuser/:userId", getAllPlansByUserId);
router.get("/get-plan-name/:userId", getPlanNameByUserId);
router.get("/:userId", getPlanByUserId);
router.get("/details/:id", getPlanById);
router.delete("/:id", deletePlan);
router.put("/status", updatePlanStatus);
router.put("/update-plan/:id", upload.single('uplodedImage'), updatePlan);

export default router;