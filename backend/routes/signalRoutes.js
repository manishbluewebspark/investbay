import express from 'express';
import { createSignal, getSignals, deleteSignal } from "../controllers/signalController.js";

const router = express.Router();

router.post("/create-signal", createSignal);
router.get("/get-signals/:userId", getSignals);
router.delete("/:id", deleteSignal);

export default router;