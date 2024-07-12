import express from 'express';
import { getAppStats } from '../controllers/appStatsController.js';

const router = express.Router();

router.get('/app-stats', getAppStats);

export default router;
