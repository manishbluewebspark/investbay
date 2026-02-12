import express from "express";
import { getWebsiteUserData,getWebsiteRaData, allUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user-all", allUsers);
router.get("/:id", getWebsiteUserData);
router.get("/ra/:id", getWebsiteRaData);

export default router;

