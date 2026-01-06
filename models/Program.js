const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true // Google, Microsoft, GitHub, etc.
  },
  type: {
    type: String,
    enum: ['internship', 'fellowship', 'ambassador', 'hackathon', 'conference', 'coding-event', 'other'],
    required: true
  },
  duration: {
    type: String // "3 months", "Summer 2024", etc.
  },
  deadline: {
    type: Date,
    required: true
  },
  applicationLink: {
    type: String
  },
  location: {
    type: String // "Remote", "USA", "India", etc.
  },
  // Eligibility Criteria
  eligibility: {
    gender: {
      type: [String],
      default: ['all']
    },
    minCGPA: {
      type: Number,
      default: 0
    },
    year: {
      type: [Number],
      default: []
    },
    departments: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for sorting by deadline
programSchema.index({ deadline: 1 });

module.exports = mongoose.model('Program', programSchema);
