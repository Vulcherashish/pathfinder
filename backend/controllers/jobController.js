const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getJobs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job (admin)
// @route   POST /api/jobs
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, message: 'Job created!', data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job (admin)
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, message: 'Job updated!', data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job (admin)
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, message: 'Job deleted!' });
  } catch (error) {
    next(error);
  }
};
