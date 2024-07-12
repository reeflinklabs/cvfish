import mongoose from 'mongoose';

const { Schema } = mongoose;

const cvSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    linkedIn: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    work: {
      type: String,
      required: true,
    },
    extracurriculars: {
      type: String,
      required: true,
    },
    other: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CV', cvSchema);
