import express from 'express';
import { getUserAnalytics } from '../controllers/userAnalyticsController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Use the auth middleware to protect the routes
router.use(requireAuth);

router.get('/user-analytics', getUserAnalytics);

export default router;
