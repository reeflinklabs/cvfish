import express from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
} from '../controllers/jobController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Use the auth middleware to protect the routes
router.use(requireAuth);

router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);

export default router;
