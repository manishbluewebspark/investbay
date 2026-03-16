import express from 'express';
import bodyParser from 'body-parser';
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
import authFirebaseRoutes from './routes/authFirebaseRoutes.js'
import userRoutes from "./routes/userRoute.js";
import feedRoutes from "./routes/feedRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import termsRoutes from "./routes/termsRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import notifyRoutes from "./routes/notifyRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import { initDB } from './db.js';
import { connectWhatsApp } from './whatsapp.service.js';



dotenv.config();

const app = express();



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


// await connectWhatsApp()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());4
app.use(cookieParser());



app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/fireauth", authFirebaseRoutes);
app.use("/api/research-analyst", researchAnalystRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/signals", signalRoutes);
app.use("/api/courses", CourseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/news", newsRoutes);
app.use('/api/terms', termsRoutes);




app.use('/api', subscriberRoutes)
app.use('/api', notifyRoutes)
app.use('/api', logRoutes)


app.get('/api/health', (_req, res) => res.json({ ok: true }));



const PORT = process.env.PORT;
initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running at: http://localhost:${PORT}`));
});
