import { Lesson, Exercise } from '../models/index.js';

export const getLessons = async (req, res) => {
  try {
    const { topic } = req.query;
    const where = topic ? { topic } : {};

    const lessons = await Lesson.findAll({ 
      where,
      include: [{ model: Exercise, as: 'exercises' }]
    });

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id, {
      include: [{ model: Exercise, as: 'exercises' }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { title, topic, description, content, video_url, thumbnail_url, teacher_id } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const lesson = await Lesson.create({
      title,
      topic,
      description,
      content,
      video_url,
      thumbnail_url,
      teacher_id,
      created_by: req.user?.user_id
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, topic, description, content, video_url, thumbnail_url } = req.body;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    await lesson.update({
      title: title || lesson.title,
      topic: topic || lesson.topic,
      description: description || lesson.description,
      content: content || lesson.content,
      video_url: video_url || lesson.video_url,
      thumbnail_url: thumbnail_url || lesson.thumbnail_url
    });

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    await lesson.destroy();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
