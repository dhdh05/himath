const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/:student_id', goalController.getGoals); // Cho phụ huynh

module.exports = router;
