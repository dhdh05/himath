import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';
import Lesson from './Lesson.js';

const ProgressTracking = sequelize.define('progressTracking', {
  track_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'user_id'
    }
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lesson,
      key: 'lesson_id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  last_accessed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  streak_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Tổng thời gian học (phút)'
  }
}, {
  tableName: 'progress_tracking',
  timestamps: false,
  underscored: true
});

ProgressTracking.belongsTo(Student, { foreignKey: 'student_id' });
ProgressTracking.belongsTo(Lesson, { foreignKey: 'lesson_id' });

export default ProgressTracking;
