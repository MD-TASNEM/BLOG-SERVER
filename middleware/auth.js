const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided in authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;
    console.log(`Token verified successfully for user: ${decodedToken.uid}`);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    // In development mode with mock Firebase, we might want to be more lenient
    if (
      process.env.NODE_ENV === "development" &&
      !process.env.FIREBASE_PROJECT_ID
    ) {
      console.log(
        "Development mode detected with mock Firebase - proceeding with mock user",
      );
      req.userId = "mock-user-id";
      req.userEmail = "test@example.com";
      return next();
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional middleware that doesn't require authentication but provides user info if available
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(); // No token, but that's okay for optional auth
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;
    req.isAuthenticated = true;
  } catch (error) {
    console.log("Optional auth failed, proceeding without authentication");
    req.isAuthenticated = false;
  }

  next();
};

module.exports = { verifyToken, optionalAuth };
