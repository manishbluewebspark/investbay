// routes/demat.routes.js
import express from 'express';
import { connectDemat, getDematStatus } from '../controllers/dematController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
router.post('/connect',    authRequired, connectDemat);
router.get('/status',      authRequired, getDematStatus);
export default router;

