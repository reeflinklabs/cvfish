import express from 'express';
import { upsertCV, deleteCV, getCV } from '../controllers/cvController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

// Use the auth middleware to protect the routes
router.use(requireAuth);

router.post('/cv', upsertCV);
router.delete('/cv', deleteCV);
router.get('/cv', getCV);

export default router;
