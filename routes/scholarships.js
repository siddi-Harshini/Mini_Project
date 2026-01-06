const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const { authMiddleware } = require('../middleware/auth');

// Get all active scholarships (public/student view)
// Sorted by: newest first, then by approaching deadline
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Get active scholarships with deadline in the future
    const scholarships = await Scholarship.find({
      isActive: true,
      deadline: { $gte: currentDate }
    }).sort({ createdAt: -1, deadline: 1 });

    res.json({ 
      count: scholarships.length,
      scholarships 
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get scholarships sorted by deadline (most urgent first)
router.get('/by-deadline', async (req, res) => {
  try {
    const currentDate = new Date();
    
    const scholarships = await Scholarship.find({
      isActive: true,
      deadline: { $gte: currentDate }
    }).sort({ deadline: 1 }); // Ascending - earliest deadline first

    res.json({ 
      count: scholarships.length,
      scholarships 
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eligible scholarships for logged-in student
router.get('/eligible', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'This endpoint is for students only' });
    }

    const currentDate = new Date();
    const profile = req.user.profile || {};

    // Find all active scholarships
    const allScholarships = await Scholarship.find({
      isActive: true,
      deadline: { $gte: currentDate }
    });

    // Filter based on student's profile
    const eligibleScholarships = allScholarships.filter(scholarship => {
      const eligibility = scholarship.eligibility;

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

      // Check skills (student should have at least one required skill)
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

      // Check location
      if (eligibility.location && eligibility.location.length > 0) {
        if (!profile.location || !eligibility.location.includes(profile.location)) {
          return false;
        }
      }

      return true;
    });

    // Sort by deadline (most urgent first)
    eligibleScholarships.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({
      count: eligibleScholarships.length,
      scholarships: eligibleScholarships
    });
  } catch (error) {
    console.error('Error fetching eligible scholarships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single scholarship details
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.json({ scholarship });
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
