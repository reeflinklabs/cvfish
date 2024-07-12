import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    status: {
      type: String,
      enum: [
        'submitted cv',
        'submitted assessment',
        'submitted interview',
        'rejected at cv',
        'rejected at assessment',
        'rejected at interview',
        'incomplete',
        'rejected',
        'offer',
      ],
      default: 'incomplete',
      required: [true, 'Status is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    jobType: {
      type: String,
      enum: ['internship', 'gradscheme', 'fulltime', 'speculative'],
      required: [true, 'Job type is required'],
    },
    dateApplied: {
      type: Date,
      required: [true, 'Date applied is required'],
    },
  },
  { timestamps: true }
);

// Virtual field to populate notes
jobSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'jobId',
});

export default mongoose.model('Job', jobSchema);
