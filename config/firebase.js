const admin = require("firebase-admin");

const initializeFirebase = () => {
  // Check if we have required credentials
  const hasRequiredCredentials =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL;

  if (!hasRequiredCredentials) {
    console.warn(
      "⚠️  Firebase credentials not found. Using mock mode for development.",
    );
    // Return a mock admin object for development
    return {
      auth: () => ({
        verifyIdToken: async (token) => {
          // For development, accept any token and return a mock user
          // This allows testing with real Firebase client tokens
          if (token && token.startsWith("eyJ")) {
            // Parse basic info from Firebase token for better testing
            try {
              const payload = JSON.parse(
                Buffer.from(token.split(".")[1], "base64").toString(),
              );
              return {
                uid: payload.user_id || payload.sub || "mock-user-id",
                email: payload.email || "test@example.com",
                name: payload.name || payload.display_name || "Test User",
                picture: payload.picture || payload.photo_url || "",
              };
            } catch (e) {
              return {
                uid: "mock-user-id",
                email: "test@example.com",
                name: "Test User",
                picture: "",
              };
            }
          }
          return {
            uid: "mock-user-id",
            email: "test@example.com",
            name: "Test User",
            picture: "",
          };
        },
      }),
    };
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    return admin;
  } catch (error) {
    console.warn(
      "⚠️  Firebase initialization failed:",
      error.message,
      ". Using mock mode.",
    );
    return {
      auth: () => ({
        verifyIdToken: async (token) => ({
          uid: "mock-user-id",
          email: "test@example.com",
        }),
      }),
    };
  }
};

module.exports = initializeFirebase;
