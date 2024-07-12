import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import userAnalytics from './userAnalyticsModel.js';
import AppStats from './appStatsModel.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: (password) => password.length >= 8,
        message: 'Password must be at least 8 characters long',
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  const existingUser = await this.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email already exists. Please try another one.');
  }

  const user = new this({ firstName, lastName, email, password });

  try {
    await user.save();
    // Update signups statistics
    await AppStats.updateSignups(user._id);
    return user;
  } catch (error) {
    const errorMessage = error.errors
      ? Object.values(error.errors)
          .map((val) => val.message)
          .join(', ')
      : 'Signup failed due to an unexpected error.';
    throw new Error(errorMessage);
  }
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }

  // Record login in UserAnalytics and update login statistics
  await userAnalytics.recordLogin(user._id);
  await AppStats.updateLogins(user._id);

  return user;
};

export default mongoose.model('User', userSchema);
