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
    noActive: {
      type: Number,
      default: 0,
      required: true,
    },
    noRejects: {
      type: Number,
      default: 0,
      required: true,
    },
    noOffers: {
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

userAnalyticsSchema.statics.recordApplication = async function (
  userId,
  status
) {
  const userAnalytics = await this.findOne({ userId });
  if (userAnalytics) {
    userAnalytics.noApplications += 1;
    if (status === 'rejected') {
      userAnalytics.noRejects += 1;
    } else if (status === 'offer') {
      userAnalytics.noOffers += 1;
    } else {
      userAnalytics.noActive += 1;
    }
    await userAnalytics.save();
  } else {
    const newUserAnalytics = {
      userId,
      noApplications: 1,
      noActive: 0,
      noRejects: 0,
      noOffers: 0,
    };
    if (status === 'rejected') {
      newUserAnalytics.noRejects = 1;
    } else if (status === 'offer') {
      newUserAnalytics.noOffers = 1;
    } else {
      newUserAnalytics.noActive = 1;
    }
    await this.create(newUserAnalytics);
  }
};

userAnalyticsSchema.statics.updateApplicationStatus = async function (
  userId,
  oldStatus,
  newStatus
) {
  const userAnalytics = await this.findOne({ userId });
  if (userAnalytics) {
    if (oldStatus === 'rejected') {
      userAnalytics.noRejects -= 1;
    } else if (oldStatus === 'offer') {
      userAnalytics.noOffers -= 1;
    } else {
      userAnalytics.noActive -= 1;
    }

    if (newStatus === 'rejected') {
      userAnalytics.noRejects += 1;
    } else if (newStatus === 'offer') {
      userAnalytics.noOffers += 1;
    } else {
      userAnalytics.noActive += 1;
    }

    await userAnalytics.save();
  }
};

userAnalyticsSchema.statics.deleteApplication = async function (
  userId,
  status
) {
  const userAnalytics = await this.findOne({ userId });
  if (userAnalytics) {
    userAnalytics.noApplications -= 1;

    if (status === 'rejected') {
      userAnalytics.noRejects -= 1;
    } else if (status === 'offer') {
      userAnalytics.noOffers -= 1;
    } else {
      userAnalytics.noActive -= 1;
    }

    await userAnalytics.save();
  }
};

export default mongoose.model('UserAnalytics', userAnalyticsSchema);
