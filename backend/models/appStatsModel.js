import mongoose from 'mongoose';

const { Schema } = mongoose;

const appStatsSchema = new Schema(
  {
    allTimeSignups: {
      type: Number,
      default: 0,
      required: true,
    },
    weeklySignups: {
      type: Number,
      default: 0,
      required: true,
    },
    allTimeLogins: {
      type: Number,
      default: 0,
      required: true,
    },
    weeklyLogins: {
      type: Number,
      default: 0,
      required: true,
    },
    topUsersByLogins: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        loginCount: Number,
      },
    ],
    topUsersByApplications: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        applicationCount: Number,
      },
    ],
    lastUsersSignup: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        dateSignedUp: Date,
      },
    ],
    lastUsersLogin: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        lastLoggedIn: Date,
      },
    ],
  },
  { timestamps: true }
);

appStatsSchema.statics.updateSignups = async function (userId) {
  const appStats = await this.findOne();
  if (!appStats) {
    await this.create({
      allTimeSignups: 1,
      weeklySignups: 1,
      lastUsersSignup: [{ userId, dateSignedUp: new Date() }],
    });
  } else {
    appStats.allTimeSignups += 1;
    appStats.weeklySignups += 1;
    appStats.lastUsersSignup.unshift({ userId, dateSignedUp: new Date() });
    if (appStats.lastUsersSignup.length > 10) {
      appStats.lastUsersSignup.pop();
    }
    await appStats.save();
  }
};

appStatsSchema.statics.updateLogins = async function (userId) {
  const appStats = await this.findOne();
  if (!appStats) {
    await this.create({
      allTimeLogins: 1,
      weeklyLogins: 1,
      lastUsersLogin: [{ userId, lastLoggedIn: new Date() }],
    });
  } else {
    appStats.allTimeLogins += 1;
    appStats.weeklyLogins += 1;
    appStats.lastUsersLogin.unshift({ userId, lastLoggedIn: new Date() });
    if (appStats.lastUsersLogin.length > 10) {
      appStats.lastUsersLogin.pop();
    }
    await appStats.save();
  }
};

export default mongoose.model('AppStats', appStatsSchema);
