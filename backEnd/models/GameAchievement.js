import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';

const GameAchievement = sequelize.define('gameAchievement', {
  achievement_id: {
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
  achievement_type: {
    type: DataTypes.ENUM(
      'first_play',           // Chơi lần đầu
      'perfect_score',        // Điểm tuyệt đối
      'level_master',         // Vượt qua level khó
      'streak_5',             // 5 trận thắng liên tiếp
      'streak_10',            // 10 trận thắng liên tiếp
      'speedrun',             // Chơi nhanh
      'game_guru',            // Hoàn thành tất cả game
      'star_collector'        // Thu thập 50+ sao
    ),
    allowNull: false
  },
  game_type: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'game_achievements',
  timestamps: false,
  underscored: true
});

GameAchievement.belongsTo(Student, { foreignKey: 'student_id' });

export default GameAchievement;
