const College = require('../models/College');

// @desc    Get all colleges
// @route   GET /api/colleges
exports.getColleges = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const colleges = await College.find(query).sort({ rating: -1 });
    res.json({ success: true, count: colleges.length, data: colleges });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college
// @route   GET /api/colleges/:id
exports.getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }
    res.json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Create college (admin)
// @route   POST /api/colleges
exports.createCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, message: 'College added!', data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college (admin)
// @route   PUT /api/colleges/:id
exports.updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }
    res.json({ success: true, message: 'College updated!', data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college (admin)
// @route   DELETE /api/colleges/:id
exports.deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }
    res.json({ success: true, message: 'College deleted!' });
  } catch (error) {
    next(error);
  }
};
