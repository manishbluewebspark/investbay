import express from 'express';
import { createSignal, getSignals } from "../controllers/signalController.js";

const router = express.Router();

router.post("/create-signal", createSignal);
router.get("/get-signals/:userId", getSignals);

export default router;