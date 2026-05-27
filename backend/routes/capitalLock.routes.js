// routes/capitalLock.routes.js
import express from 'express';
import { setCapitalLock, getCapitalLock, removeCapitalLock } from '../controllers/capitalLockController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
router.post('/set',    authRequired, setCapitalLock);
router.get('/status', authRequired, getCapitalLock);
router.post('/remove',authRequired, removeCapitalLock);
export default router;

