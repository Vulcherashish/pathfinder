const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getJobs);
router.get('/:id', protect, getJob);
router.get('/jobs', async (req, res) => {
  try {
    const { search, category, skills } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;

    if (search || skills) {
      const orConditions = [];

      if (search) {
        const regex = new RegExp(search, 'i');
        orConditions.push({ title: regex });       // search by job title
        orConditions.push({ skills: regex });       // search by skill name
      }

      if (skills) {
        // dedicated skills param: comma-separated e.g. ?skills=React,Node
        const skillList = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
        skillList.forEach(r => orConditions.push({ skills: r }));
      }

      query.$or = orConditions;
    }

    const jobs = await Job.find(query);
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;
