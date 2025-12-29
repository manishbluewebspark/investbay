import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import researchAnalystRoutes from './routes/researchAnalystRoutes.js';
import planRoutes from './routes/planRoutes.js';
import signalRoutes from './routes/signalRoutes.js';
import CourseRoutes from './routes/courseRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
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

app.use("/api/auth", authRoutes);
app.use("/api/research-analyst", researchAnalystRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/signals", signalRoutes);
app.use("/api/courses", CourseRoutes);
app.use("/api/videos", videoRoutes);


app.get('/api/health', (_req, res) => res.json({ ok: true }));



const PORT = process.env.PORT;
initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
});
