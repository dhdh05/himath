import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Student = sequelize.define('student', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  class_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  quick_login_code: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  total_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  current_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'students',
  timestamps: false,
  underscored: true
});

Student.belongsTo(User, { foreignKey: 'user_id' });

export default Student;
