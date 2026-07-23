const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import Routers
const publicRouter = require("./router/publicRouter");
const projectsRouter = require("./router/projectsRouter");
const messagesRouter = require("./router/messagesRouter");
const adminRouter = require("./router/adminRouter");
const uploadRouter = require("./router/uploadRouter");

// Import Middlewares
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middlewares/errorMiddleware");

const app = express();

// ─── Core Middlewares ─────────────────────────────────────────
app.use(
  helmet({
    hsts: false, // Vercel handles HTTPS, disabling to prevent redirect issues
  }),
);

// Handle OPTIONS preflight before CORS
app.options("*", (req, res) => {
  res.sendStatus(204);
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some((allowed) =>
          origin.startsWith(allowed.replace(/\/$/, "")),
        )
      ) {
        return callback(null, true);
      }
      // Also allow all vercel.app subdomains for preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

// Rate limiter for contact messages
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many messages sent. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Static uploads ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Route Mounting ──────────────────────────────────────────
app.use("/api", publicRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/messages", messageLimiter, messagesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);

// ─── Error Handlers ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
