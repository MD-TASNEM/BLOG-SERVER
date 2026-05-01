const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { connectDB } = require("./config/db");
const initializeFirebase = require("./config/firebase");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Initialize Firebase
initializeFirebase();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const usersRoutes = require("./routes/users");
const lessonsRoutes = require("./routes/lessons");
const favoritesRoutes = require("./routes/favorites");
const reportsRoutes = require("./routes/reports");
const paymentsRoutes = require("./routes/payments");
const commentsRoutes = require("./routes/comments");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");

app.use("/api/users", usersRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Digital Life Lessons Server is running");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is healthy" });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✓ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
