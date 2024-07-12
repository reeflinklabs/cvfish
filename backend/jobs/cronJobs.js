import cron from 'node-cron';
import AppStats from '../models/appStatsModel.js';

// Schedule a task to reset weekly stats every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
  const appStats = await AppStats.findOne();
  if (appStats) {
    appStats.weeklySignups = 0;
    appStats.weeklyLogins = 0;
    await appStats.save();
  }
});

export default cron;
