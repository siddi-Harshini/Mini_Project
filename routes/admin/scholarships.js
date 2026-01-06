const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all scholarships (admin view)
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json({ scholarships });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new scholarship
router.post('/', async (req, res) => {
  try {
    const scholarship = new Scholarship({
      ...req.body,
      createdBy: req.user._id
    });

    await scholarship.save();

    res.status(201).json({
      message: 'Scholarship created successfully',
      scholarship
    });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update scholarship
router.put('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.json({
      message: 'Scholarship updated successfully',
      scholarship
    });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete scholarship
router.delete('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eligible students for a specific scholarship
router.get('/:id/eligible-students', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    // Build eligibility query
    const query = { role: 'student' };

    // Gender filter
    if (scholarship.eligibility.gender && !scholarship.eligibility.gender.includes('all')) {
      query['profile.gender'] = { $in: scholarship.eligibility.gender };
    }

    // CGPA filter
    if (scholarship.eligibility.minCGPA > 0) {
      query['profile.cgpa'] = { $gte: scholarship.eligibility.minCGPA };
    }

    // Year filter
    if (scholarship.eligibility.year && scholarship.eligibility.year.length > 0) {
      query['profile.year'] = { $in: scholarship.eligibility.year };
    }

    // Department filter
    if (scholarship.eligibility.departments && scholarship.eligibility.departments.length > 0) {
      query['profile.department'] = { $in: scholarship.eligibility.departments };
    }

    // Skills filter (at least one matching skill)
    if (scholarship.eligibility.requiredSkills && scholarship.eligibility.requiredSkills.length > 0) {
      query['profile.skills'] = { $in: scholarship.eligibility.requiredSkills };
    }

    const eligibleStudents = await User.find(query).select('-password');

    res.json({
      scholarship: {
        id: scholarship._id,
        title: scholarship.title
      },
      eligibleCount: eligibleStudents.length,
      students: eligibleStudents
    });
  } catch (error) {
    console.error('Error fetching eligible students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
