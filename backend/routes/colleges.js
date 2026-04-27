const express = require('express');
const router = express.Router();
const { getColleges, getCollege, createCollege, updateCollege, deleteCollege } = require('../controllers/collegeController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getColleges);
router.get('/:id', protect, getCollege);
router.get('/colleges', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },      // search by college name
        { course: regex },    // optionally search by course too
        { location: regex },
      ];
    }

    const colleges = await College.find(query);
    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post('/', protect, adminOnly, createCollege);
router.put('/:id', protect, adminOnly, updateCollege);
router.delete('/:id', protect, adminOnly, deleteCollege);

module.exports = router;
