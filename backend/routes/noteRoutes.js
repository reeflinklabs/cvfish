import express from 'express';
import {
  createNote,
  updateNote,
  deleteNote,
  getAllNotesForJob,
  getNoteById,
} from '../controllers/noteController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Use the auth middleware to protect the routes
router.use(requireAuth);

router.post('/notes', createNote);
router.put('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);
router.get('/jobs/:jobId/notes', getAllNotesForJob);
router.get('/notes/:id', getNoteById);

export default router;
