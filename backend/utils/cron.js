// utils/cron.js
import cron from 'node-cron';
import { resetDailyLoss } from '../controllers/lossSecurityController.js';

// Har raat 12 baje reset
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Running daily loss reset...');
  await resetDailyLoss();
}, { timezone: 'Asia/Kolkata' });