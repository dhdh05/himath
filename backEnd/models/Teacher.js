import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Teacher = sequelize.define('teacher', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  subject: {
    type: DataTypes.STRING(50),
    defaultValue: 'Toán'
  },
  hire_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'teachers',
  timestamps: false,
  underscored: true
});

Teacher.belongsTo(User, { foreignKey: 'user_id' });

export default Teacher;
