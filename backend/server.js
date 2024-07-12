import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import userAnalyticsRoutes from './routes/userAnalyticsRoutes.js';
import appStatsRoutes from './routes/appStatsRoutes.js';
import './jobs/cronJobs.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

app.use(express.json());

app.use('/v1', userRoutes);
app.use('/v1', jobRoutes);
app.use('/v1', noteRoutes);
app.use('/v1', cvRoutes);
app.use('/v1', userAnalyticsRoutes);
app.use('/v1', appStatsRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();
