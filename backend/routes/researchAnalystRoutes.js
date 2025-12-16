import express from "express";
import upload from "../middleware/upload.js";
import { addResearchAnalyst, getAllReserchAnalysts, deleteResearchAnalyst, getResearchAnalystById } from "../controllers/researchAnalystController.js";

const router = express.Router();

router.post("/create", upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "panFile", maxCount: 1 },{ name: "sebiFile", maxCount: 1 }, { name: "professionalDocument", maxCount: 1 },]),addResearchAnalyst);

router.get("/all", getAllReserchAnalysts);

router.get("/:id", getResearchAnalystById);

router.delete("/:id", deleteResearchAnalyst);

export default router;
