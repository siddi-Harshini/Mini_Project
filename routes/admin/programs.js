const express = require('express');
const router = express.Router();
const Program = require('../../models/Program');
const User = require('../../models/User');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all programs (admin view)
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new program
router.post('/', async (req, res) => {
  try {
    const program = new Program({
      ...req.body,
      createdBy: req.user._id
    });

    await program.save();

    res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update program
router.put('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({
      message: 'Program updated successfully',
      program
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete program
router.delete('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eligible students for a specific program
router.get('/:id/eligible-students', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Build eligibility query
    const query = { role: 'student' };

    // Gender filter
    if (program.eligibility.gender && !program.eligibility.gender.includes('all')) {
      query['profile.gender'] = { $in: program.eligibility.gender };
    }

    // CGPA filter
    if (program.eligibility.minCGPA > 0) {
      query['profile.cgpa'] = { $gte: program.eligibility.minCGPA };
    }

    // Year filter
    if (program.eligibility.year && program.eligibility.year.length > 0) {
      query['profile.year'] = { $in: program.eligibility.year };
    }

    // Department filter
    if (program.eligibility.departments && program.eligibility.departments.length > 0) {
      query['profile.department'] = { $in: program.eligibility.departments };
    }

    // Skills filter
    if (program.eligibility.requiredSkills && program.eligibility.requiredSkills.length > 0) {
      query['profile.skills'] = { $in: program.eligibility.requiredSkills };
    }

    const eligibleStudents = await User.find(query).select('-password');

    res.json({
      program: {
        id: program._id,
        title: program.title
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
