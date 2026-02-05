import express from 'express';
import { createSignal, getSignals, deleteSignal, getAllSignals } from "../controllers/signal.controller.js";

const router = express.Router();

router.post("/create-signal", createSignal);
router.get("/get-signals/:userId", getSignals);
router.get("/get-signals", getAllSignals);
router.delete("/:id", deleteSignal);

export default router;