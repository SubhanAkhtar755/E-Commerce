import express from 'express';
import helmet from 'helmet';
import routes from './src/routes/index.js';
import mongoose from './src/db/index.js';
import chalk from 'chalk';
import env from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
env.config(); // ✅ required for .env

// ✅ dirname config (ESM ke liye)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(helmet());
app.use(cookieParser());

// ✅ Fix CORS (frontend aur backend same domain pe aayenge to zarurat bhi nahi padegi, but abhi rakho)
app.use(cors({
  origin: [
    "https://e-commerce-h7o7.onrender.com", // 👈 agar frontend bhi yahin hoga
    "https://e-commerce-h7o7.netlify.app"   // 👈 agar alag Netlify rakha to
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ MongoDB connection checks
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("open", () => {
  console.log(chalk.magentaBright.bgWhite("----------MongoDB connection successful----------"));
});

// ✅ API Routes
app.use('/api', routes);

// ✅ Serve frontend (dist folder)
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// ✅ Catch-all route for SPA (React Router ke liye)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
});
