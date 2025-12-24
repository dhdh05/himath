import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';
import GameLevel from './GameLevel.js';

const GameResult = sequelize.define('gameResult', {
  result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'user_id'
    }
  },
  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'game_levels',
      key: 'level_id'
    }
  },
  game_type: {
    type: DataTypes.ENUM('hoc-so', 'ghep-so', 'chan-le', 'so-sanh', 'xep-so'),
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_score: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Số sao (0-3)'
  },
  time_spent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Thời gian chơi (giây)'
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Số lần thử'
  },
  is_passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Chi tiết câu trả lời'
  },
  completed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'game_results',
  timestamps: false,
  underscored: true
});

GameResult.belongsTo(Student, { foreignKey: 'student_id' });
GameResult.belongsTo(GameLevel, { foreignKey: 'level_id' });

export default GameResult;
