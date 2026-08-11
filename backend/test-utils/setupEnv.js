// Must be imported FIRST (before app.js) in every test file so JWT_SECRET
// and friends are set before any module reads them at import time.
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-vitest";
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "test-cloud";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "test-key";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "test-secret";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
process.env.SENDGRID_EMAIL_VERIFICATION = process.env.SENDGRID_EMAIL_VERIFICATION || "test-verify-template";
process.env.SENDGRID_RESET_PASSWORD_TEMPLATEID = process.env.SENDGRID_RESET_PASSWORD_TEMPLATEID || "test-reset-template";
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "SG.test-key";
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || "test-groq-key";
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "test-gemini-key";
