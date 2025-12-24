import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Test from './Test.js';
import Student from './Student.js';

const TestResult = sequelize.define('testResult', {
  result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  test_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Test,
      key: 'test_id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'user_id'
    }
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  correct_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  time_spent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Thời gian hoàn thành (giây)'
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  teacher_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'test_results',
  timestamps: false,
  underscored: true
});

TestResult.belongsTo(Test, { foreignKey: 'test_id' });
TestResult.belongsTo(Student, { foreignKey: 'student_id' });

export default TestResult;
