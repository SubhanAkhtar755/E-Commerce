import express from 'express';
import helmet from 'helmet';
import routes from './src/routes/index.js';
import mongoose from './src/db/index.js';
import chalk from 'chalk';
import env from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
env.config(); // ✅ required for .env

// ✅ Middleware

// 🚀 Increase body size limit for large payloads (images, etc.)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(helmet());
app.use(cookieParser());

// 🚀 Fix CORS properly
app.use(cors({
  origin: [
    "http://localhost:5173",     // local frontend
    "https://blog-site-6od5.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true
}));

// ✅ Test route
app.get('/', (req, res) => {
  res.send(new Date().toString());
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
