import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';

const GameLevel = sequelize.define('gameLevel', {
  level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_type: {
    type: DataTypes.ENUM('hoc-so', 'ghep-so', 'chan-le', 'so-sanh', 'xep-so'),
    allowNull: false
  },
  level_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'easy'
  },
  time_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Giới hạn thời gian (giây)'
  },
  required_score: {
    type: DataTypes.INTEGER,
    defaultValue: 80,
    comment: 'Điểm tối thiểu để qua level'
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Configuration cho từng game'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'game_levels',
  timestamps: false,
  underscored: true
});

export default GameLevel;
