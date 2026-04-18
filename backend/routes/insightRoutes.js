import express from 'express';
import { getActiveInsights, dismissInsight } from '../controllers/insight-Controller.js';
import { isAuth } from "../utils/jwt.js";

const router = express.Router();

// GET /api/insights
// שליפת כל התובנות הפעילות של בעל המסעדה המחובר
router.get('/', isAuth, getActiveInsights);

// PATCH /api/insights/:id/dismiss
// סגירת תובנה ספציפית (למשל כשלוחצים "הבנתי" או "התעלם")
router.patch('/:id/dismiss', isAuth, dismissInsight);

export default router;