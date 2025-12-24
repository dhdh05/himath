import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';
import GameLevel from './GameLevel.js';

const StudentGameProgress = sequelize.define('studentGameProgress', {
  progress_id: {
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
  game_type: {
    type: DataTypes.ENUM('hoc-so', 'ghep-so', 'chan-le', 'so-sanh', 'xep-so'),
    allowNull: false
  },
  current_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  highest_level_passed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_played_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'student_game_progress',
  timestamps: false,
  underscored: true
});

StudentGameProgress.belongsTo(Student, { foreignKey: 'student_id' });

export default StudentGameProgress;
