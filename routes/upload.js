const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Upload lesson image
router.post("/lesson-image", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create the file URL (adjust based on your hosting setup)
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    res.json({
      message: "Image uploaded successfully",
      imageUrl: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Upload profile image
router.post("/profile-image", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create the file URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files uploaded." });
    }
  }
  
  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ message: "Only image files are allowed." });
  }
  
  res.status(500).json({ message: "File upload error." });
});

module.exports = router;
