import UserAnalytics from '../models/userAnalyticsModel.js';
import AppStats from '../models/appStatsModel.js';
import Job from '../models/jobModel.js';
import mongoose from 'mongoose';

// Create a new job
export const createJob = async (req, res) => {
  const { title, description, status, company, jobType, dateApplied } =
    req.body;
  const userId = req.user._id;

  try {
    const newJob = await Job.create({
      userId,
      title,
      description,
      status,
      company,
      jobType,
      dateApplied,
    });

    // Update user analytics
    await UserAnalytics.recordApplication(userId);

    // Update application stats in AppStats
    const appStats = await AppStats.findOne();
    if (appStats) {
      appStats.noApplications += 1;
      await appStats.save();
    }

    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing job
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Job not found' });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Job not found' });
  }

  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all jobs for a user
export const getAllJobs = async (req, res) => {
  const userId = req.user._id;

  try {
    const jobs = await Job.find({ userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Job not found' });
  }

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
