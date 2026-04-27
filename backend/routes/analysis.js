const express = require('express');
const router = express.Router();
const { submitQuiz, getHistory, getResult } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getResult);

module.exports = router;
