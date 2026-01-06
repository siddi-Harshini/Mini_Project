const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
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
    required: true
  },
  amount: {
    type: String // e.g., "$5000", "Full Tuition"
  },
  deadline: {
    type: Date,
    required: true
  },
  applicationLink: {
    type: String
  },
  // Eligibility Criteria
  eligibility: {
    gender: {
      type: [String], // ['female', 'other'] or ['all']
      default: ['all']
    },
    minCGPA: {
      type: Number,
      default: 0
    },
    year: {
      type: [Number], // [1, 2, 3, 4] or empty for all
      default: []
    },
    departments: {
      type: [String], // ['CS', 'IT'] or empty for all
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    location: {
      type: [String], // Geographic restrictions
      default: []
    }
  },
  tags: [String], // For categorization
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
scholarshipSchema.index({ deadline: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
