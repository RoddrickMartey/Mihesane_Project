import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

//Routes
import authRouter from "./src/routers/auth.route.js";

dotenv.config();

const app = express();

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

// Middlewares
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Misane API</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, sans-serif;
            background: #f9fafb;
            color: #111827;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .container {
            text-align: center;
            padding: 2rem;
            border-radius: 12px;
            background: white;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #10b981;
          }
          p {
            font-size: 1rem;
            color: #4b5563;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Misane API is Running</h1>
          <p>Welcome to the official backend for the Misane platform.</p>
        </div>
      </body>
    </html>
  `);
});

app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
