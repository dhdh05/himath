import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Lesson = sequelize.define('lesson', {
  lesson_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  thumbnail_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'lessons',
  timestamps: false,
  underscored: true
});

Lesson.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Lesson.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default Lesson;
