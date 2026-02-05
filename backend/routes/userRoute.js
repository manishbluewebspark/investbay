import express from "express";
import { getWebsiteUserData,getWebsiteRaData } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getWebsiteUserData);
router.get("/ra/:id", getWebsiteRaData);

export default router;

