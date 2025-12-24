import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Lesson from './Lesson.js';
import User from './User.js';

const Test = sequelize.define('test', {
  test_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Lesson,
      key: 'lesson_id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Thời gian làm bài (phút)'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tests',
  timestamps: false,
  underscored: true
});

Test.belongsTo(Lesson, { foreignKey: 'lesson_id' });
Test.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default Test;
