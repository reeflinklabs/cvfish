import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import UserAnalytics from '../models/userAnalyticsModel.js';

const createToken = (_id) =>
  jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });

export const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email.toLowerCase(),
      password
    );

    // Initialise user data
    const userData = new UserAnalytics({
      userId: user._id,
      dateSignedUp: new Date(),
    });

    await userData.save();

    const token = createToken(user._id);
    res.status(201).json({ email: user.email, token });
  } catch (err) {
    let errorMessage = 'Signup failed due to an unexpected error.';
    if (err.code === 11000) {
      errorMessage = 'Email already exists. Please try another one.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    res.status(400).json({ error: errorMessage });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email.toLowerCase(), password);

    // Update user data
    const userData = await UserAnalytics.findOne({ userId: user._id });
    if (userData) {
      userData.lastLoggedIn = new Date();
      userData.noLogins += 1;
      await userData.save();
    }

    const token = createToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (err) {
    res.status(401).json({ error: err.message || 'Authentication failed' });
  }
};
