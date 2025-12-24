import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    defaultValue: 'default_avatar.png'
  },
  role: {
    type: DataTypes.ENUM('admin', 'teacher', 'student', 'parent'),
    defaultValue: 'student'
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
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
  tableName: 'users',
  timestamps: false,
  underscored: true
});

// Hash password before creating/updating
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function(enteredPassword) {
  // Support both bcrypt hashed and plain text passwords (for legacy data)
  if (this.password && this.password.startsWith('$2')) {
    // It's a bcrypt hash
    return await bcrypt.compare(enteredPassword, this.password);
  } else {
    // Fallback to plain text comparison (for test/legacy users)
    return enteredPassword === this.password;
  }
};

export default User;
