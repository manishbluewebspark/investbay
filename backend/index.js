import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import researchAnalystRoutes from './routes/researchAnalystRoutes.js';
import { initDB } from './db.js';

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin:'*',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/login-user', (req, res, next) => {
  console.log('hello ji kese ho');
  next();
}, authRoutes);
app.use("/api/research-analyst", researchAnalystRoutes);


app.get('/api/health', (_req, res) => res.json({ ok: true }));



const PORT = process.env.PORT;
initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
});
