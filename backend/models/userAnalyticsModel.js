import mongoose from 'mongoose';

const { Schema } = mongoose;

const userAnalyticsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dateSignedUp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastLoggedIn: {
      type: Date,
      default: null,
    },
    noLogins: {
      type: Number,
      default: 0,
      required: true,
    },
    noApplications: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

userAnalyticsSchema.statics.recordLogin = async function (userId) {
  const userAnalytics = await this.findOne({ userId });
  if (userAnalytics) {
    userAnalytics.noLogins += 1;
    userAnalytics.lastLoggedIn = new Date();
    await userAnalytics.save();
  } else {
    await this.create({ userId, noLogins: 1, lastLoggedIn: new Date() });
  }
};

userAnalyticsSchema.statics.recordApplication = async function (userId) {
  const userAnalytics = await this.findOne({ userId });
  if (userAnalytics) {
    userAnalytics.noApplications += 1;
    await userAnalytics.save();
  } else {
    await this.create({ userId, noApplications: 1 });
  }
};

export default mongoose.model('UserAnalytics', userAnalyticsSchema);
