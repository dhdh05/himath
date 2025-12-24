import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';

const Reward = sequelize.define('reward', {
  reward_id: {
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
  reward_title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  date_awarded: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'rewards',
  timestamps: false,
  underscored: true
});

Reward.belongsTo(Student, { foreignKey: 'student_id' });

export default Reward;
