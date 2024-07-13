import CV from '../models/cvModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import sendCVEmail from '../services/sendgridService.js';

// Create or update a CV
export const upsertCV = async (req, res) => {
  const {
    country,
    city,
    phoneNumber,
    linkedIn,
    education,
    work,
    extracurriculars,
    other,
  } = req.body;
  const userId = req.user._id;
  const userEmail = req.user.email;

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedCV = await CV.findOneAndUpdate(
      { userId },
      {
        country,
        city,
        phoneNumber,
        linkedIn,
        education,
        work,
        extracurriculars,
        other,
      },
      { new: true, upsert: true }
    );

    // Send CV email
    await sendCVEmail(
      {
        userId,
        firstName: user.firstName, // Add firstName
        lastName: user.lastName, // Add lastName
        country,
        city,
        phoneNumber,
        linkedIn,
        education,
        work,
        extracurriculars,
        other,
      },
      userEmail
    );

    res.status(200).json(updatedCV);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a CV
export const deleteCV = async (req, res) => {
  const userId = req.user._id;

  try {
    const deletedCV = await CV.findOneAndDelete({ userId });
    if (!deletedCV) {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(200).json({ message: 'CV deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a user's CV
export const getCV = async (req, res) => {
  const userId = req.user._id;

  try {
    const cv = await CV.findOne({ userId });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.status(200).json(cv);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
