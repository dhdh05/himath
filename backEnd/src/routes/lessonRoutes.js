const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// GET /api/lessons
router.get('/', lessonController.getLessons);

// GET /api/lessons/:lesson_id/exercises
router.get('/:lesson_id/exercises', lessonController.getExercisesByLesson);

module.exports = router;
