const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { authMiddleware } = require('../middleware/auth');

// Get all active programs (public/student view)
// Sorted by: newest first, then by approaching deadline
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const { type } = req.query; // Optional filter by type
    
    const query = {
      isActive: true,
      deadline: { $gte: currentDate }
    };

    if (type) {
      query.type = type;
    }

    const programs = await Program.find(query)
      .sort({ createdAt: -1, deadline: 1 });

    res.json({ 
      count: programs.length,
      programs 
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get programs sorted by deadline (most urgent first)
router.get('/by-deadline', async (req, res) => {
  try {
    const currentDate = new Date();
    
    const programs = await Program.find({
      isActive: true,
      deadline: { $gte: currentDate }
    }).sort({ deadline: 1 });

    res.json({ 
      count: programs.length,
      programs 
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eligible programs for logged-in student
router.get('/eligible', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'This endpoint is for students only' });
    }

    const currentDate = new Date();
    const profile = req.user.profile || {};

    // Find all active programs
    const allPrograms = await Program.find({
      isActive: true,
      deadline: { $gte: currentDate }
    });

    // Filter based on student's profile
    const eligiblePrograms = allPrograms.filter(program => {
      const eligibility = program.eligibility;

      // Check gender
      if (eligibility.gender && eligibility.gender.length > 0 && !eligibility.gender.includes('all')) {
        if (!profile.gender || !eligibility.gender.includes(profile.gender)) {
          return false;
        }
      }

      // Check CGPA
      if (eligibility.minCGPA > 0) {
        if (!profile.cgpa || profile.cgpa < eligibility.minCGPA) {
          return false;
        }
      }

      // Check year
      if (eligibility.year && eligibility.year.length > 0) {
        if (!profile.year || !eligibility.year.includes(profile.year)) {
          return false;
        }
      }

      // Check department
      if (eligibility.departments && eligibility.departments.length > 0) {
        if (!profile.department || !eligibility.departments.includes(profile.department)) {
          return false;
        }
      }

      // Check skills
      if (eligibility.requiredSkills && eligibility.requiredSkills.length > 0) {
        if (!profile.skills || profile.skills.length === 0) {
          return false;
        }
        const hasRequiredSkill = eligibility.requiredSkills.some(skill => 
          profile.skills.includes(skill)
        );
        if (!hasRequiredSkill) {
          return false;
        }
      }

      // Check interests
      if (eligibility.interests && eligibility.interests.length > 0) {
        if (!profile.interests || profile.interests.length === 0) {
          return false;
        }
        const hasMatchingInterest = eligibility.interests.some(interest => 
          profile.interests.includes(interest)
        );
        if (!hasMatchingInterest) {
          return false;
        }
      }

      return true;
    });

    // Sort by deadline (most urgent first)
    eligiblePrograms.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({
      count: eligiblePrograms.length,
      programs: eligiblePrograms
    });
  } catch (error) {
    console.error('Error fetching eligible programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get programs by type
router.get('/type/:type', async (req, res) => {
  try {
    const currentDate = new Date();
    
    const programs = await Program.find({
      isActive: true,
      deadline: { $gte: currentDate },
      type: req.params.type
    }).sort({ createdAt: -1, deadline: 1 });

    res.json({ 
      count: programs.length,
      programs 
    });
  } catch (error) {
    console.error('Error fetching programs by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single program details
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ program });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
