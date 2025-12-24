import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Lesson from './Lesson.js';

const Exercise = sequelize.define('exercise', {
  exercise_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lesson,
      key: 'lesson_id'
    }
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  audio_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true
  },
  correct_answer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'easy'
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'drag_drop', 'matching'),
    defaultValue: 'multiple_choice'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'exercises',
  timestamps: false,
  underscored: true
});

Exercise.belongsTo(Lesson, { foreignKey: 'lesson_id' });

export default Exercise;
