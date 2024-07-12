import express from 'express';
import { signupUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/users/signup', signupUser);
router.post('/users/login', loginUser);

export default router;
