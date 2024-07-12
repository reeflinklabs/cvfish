import AppStats from '../models/appStatsModel.js';

// Get app stats
export const getAppStats = async (req, res) => {
  try {
    const appStats = await AppStats.findOne();
    if (!appStats) {
      return res.status(404).json({ message: 'App stats not found' });
    }

    res.status(200).json(appStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
