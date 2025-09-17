import express from 'express';
import helmet from 'helmet';
import routes from './src/routes/index.js';
import mongoose from './src/db/index.js';
import chalk from 'chalk';
import env from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
env.config(); // ✅ required for .env

// ✅ Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(helmet());
app.use(cookieParser());

// ✅ Fix CORS properly
app.use(cors({
  origin: [
    "https://e-commerce-1-f4a7.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// dirname config (ESM ke liye)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend
const frontendPath = path.join(__dirname, "../FrontEnd/dist");
app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ MongoDB connection checks
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("open", () => {
  console.log(chalk.magentaBright.bgWhite("----------MongoDB connection successful----------"));
});

// ✅ Routing
app.use('/api', routes);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
});
