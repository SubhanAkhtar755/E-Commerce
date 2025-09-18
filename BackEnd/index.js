import express from 'express';
import helmet from 'helmet';
import routes from './src/routes/index.js';
import mongoose from './src/db/index.js';
import chalk from 'chalk';
import env from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

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
    "https://e-commerce-upo6.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true
}));

// // ✅ Test route
// app.get('/', (req, res) => {
//   res.send(new Date().toString());
// });

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"], // ✅ allow external images
      connectSrc: ["'self'", "http://localhost:4001"],
    },
  })
);

// ✅ MongoDB connection checks
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("open", () => {
  console.log(chalk.magentaBright.bgWhite("----------MongoDB connection successful----------"));
});
// ✅ Routing
app.use('/api', routes);

const _dirname = path.resolve();



app.use(express.static(path.join(_dirname, "/FrontEnd/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "FrontEnd", "dist", "index.html"))
});


// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
});
