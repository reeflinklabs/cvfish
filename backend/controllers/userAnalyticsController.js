import UserAnalytics from '../models/userAnalyticsModel.js';

// Get user analytics
export const getUserAnalytics = async (req, res) => {
  const userId = req.user._id;

  try {
    const userAnalytics = await UserAnalytics.findOne({ userId });
    if (!userAnalytics) {
      return res.status(404).json({ message: 'User analytics not found' });
    }

    res.status(200).json(userAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
