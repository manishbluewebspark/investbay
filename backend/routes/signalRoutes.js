import express from 'express';
import { createSignal, getSignals, deleteSignal, getAllSignals, testWhatsAppAPI, getAllSignalsbyid, getSignalsFree, getSignalsPaid, getSignalsFreeWithLimit, getSignalsPaidWithAccess, trackSignalView, getUserFreeSignalCount } from "../controllers/signal.controller.js";
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create-signal", createSignal);
router.get("/test", testWhatsAppAPI);
router.get("/get-signals-free/", getSignalsFree);
router.get("/get-signals-paid/", getSignalsPaid);
router.get("/get-signals/:userId", getSignals);
router.get("/get-signals", getAllSignals);
router.get("/get-signals-by-id/:id", getAllSignalsbyid);
router.delete("/:id", deleteSignal);

router.get("/get-signals-free/limited", authenticateUser, getSignalsFreeWithLimit);
router.get("/get-signals-paid/access", authenticateUser, getSignalsPaidWithAccess);
router.post("/track-signal-view/:id", authenticateUser, trackSignalView);
router.get("/get-user-free-count", authenticateUser, getUserFreeSignalCount);


export default router;