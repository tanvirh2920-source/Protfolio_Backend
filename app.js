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
app.use(helmet({ hsts: false }));

// CORS — must be before all routes
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Handle OPTIONS preflight for all routes
app.options("*", cors());

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

// ─── Test Email Endpoint (Debug) ──────────────────────────────
app.post("/api/test-email", async (req, res) => {
  const nodemailer = require("nodemailer");

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        error: "Email credentials not configured",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    const result = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: "🧪 Portfolio Backend - Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <h2>✅ Email System Working!</h2>
          <p>This is a test email from your Portfolio backend.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          <p><strong>To:</strong> ${process.env.EMAIL_TO || process.env.EMAIL_USER}</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "✅ Test email sent successfully!",
      messageId: result.messageId,
      recipient: process.env.EMAIL_TO || process.env.EMAIL_USER,
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      hint: "Check your Email credentials in .env file",
    });
  }
});

// ─── Error Handlers ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
