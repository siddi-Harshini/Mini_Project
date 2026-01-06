const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  // Student Profile Fields for Eligibility Filtering
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other', '']
    },
    year: {
      type: Number, // 1, 2, 3, 4
      min: 1,
      max: 4
    },
    department: {
      type: String // CS, IT, ECE, etc.
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    skills: [String], // Programming languages, technologies
    interests: [String], // AI, Web Dev, Mobile Dev, etc.
    graduationYear: Number,
    location: String,
    dateOfBirth: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
