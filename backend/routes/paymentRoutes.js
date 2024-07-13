import express from 'express';
import {
  createPaymentIntent,
  handlePaymentSuccess,
} from '../controllers/paymentController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/create-payment-intent', requireAuth, createPaymentIntent);
router.post('/handle-payment-success', requireAuth, handlePaymentSuccess);

export default router;
