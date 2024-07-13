import Stripe from 'stripe';
import dotenv from 'dotenv';
import CV from '../models/cvModel.js';
import User from '../models/userModel.js';
import sendCVEmail from '../services/sendgridService.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handlePaymentSuccess = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const { userId, cvId } = paymentIntent.metadata;

      // Update CV to mark as reviewed
      const cv = await CV.findOneAndUpdate(
        { _id: cvId, userId },
        { reviewed: true },
        { new: true }
      );

      // Fetch user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send CV email
      await sendCVEmail(
        {
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          country: cv.country,
          city: cv.city,
          phoneNumber: cv.phoneNumber,
          linkedIn: cv.linkedIn,
          education: cv.education,
          work: cv.work,
          extracurriculars: cv.extracurriculars,
          other: cv.other,
        },
        user.email
      );

      res.status(200).json({ message: 'Payment successful and email sent' });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
