// routes/lossSecurity.routes.js
import express from 'express';
import { setLossLimit, getLossStatus, monitorAndExitIfLimitHit } from '../controllers/lossSecurityController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();
router.post('/set', authRequired, setLossLimit);
router.get('/status', authRequired, getLossStatus);

// routes/lossSecurity.routes.js mein test route update karo
router.post('/test-monitor', authRequired, async (req, res) => {
    const userId = req.user?.id || req.user?.userId;
    console.log('🧪 Test monitor called for userId:', userId);

    try {
        const result = await monitorAndExitIfLimitHit(userId);
        console.log('🧪 Monitor result:', JSON.stringify(result, null, 2));
        res.json({ success: true, result });
    } catch (err) {
        console.error('🧪 Monitor error:', err.message);
        res.json({ success: false, error: err.message });
    }
});

export default router;