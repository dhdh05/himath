import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';

const CompletedLevel = sequelize.define('completedLevel', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Student,
      key: 'user_id'
    }
  },
  level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'completed_levels',
  timestamps: false,
  underscored: true
});

CompletedLevel.belongsTo(Student, { foreignKey: 'user_id' });

export default CompletedLevel;
