import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import jwt from 'jsonwebtoken';
import UserAnalytics from '../models/userAnalyticsModel.js';
import AppStats from '../models/appStatsModel.js';

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

    // Create an example job for the new user
    const exampleJob = new Job({
      userId: user._id,
      title: 'Example!',
      description:
        "This is an example job to show you how things work around here. You can start tracking your job applications by hitting the new job button. It's best to copy and paste all the info for a job here to keep everything in one place. If a job has no set application deadline, just select a date in the future you'd like to finish your application!",
      status: 'incomplete',
      company: 'Acme Inc',
      jobType: 'gradscheme',
      dateApplied: new Date(),
    });

    await exampleJob.save();

    // Update application stats in AppStats
    const appStats = await AppStats.findOne();
    if (appStats) {
      appStats.noApplications += 1;
      await appStats.save();
    }

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
