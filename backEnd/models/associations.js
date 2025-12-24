import User from './User.js';
import Student from './Student.js';
import Teacher from './Teacher.js';
import Lesson from './Lesson.js';
import Exercise from './Exercise.js';
import Test from './Test.js';
import TestResult from './TestResult.js';
import ProgressTracking from './ProgressTracking.js';
import CompletedLevel from './CompletedLevel.js';
import Reward from './Reward.js';
import GameLevel from './GameLevel.js';
import GameResult from './GameResult.js';
import StudentGameProgress from './StudentGameProgress.js';
import GameAchievement from './GameAchievement.js';

export const setupAssociations = () => {
  // User associations
  User.hasOne(Student, { foreignKey: 'user_id' });
  User.hasOne(Teacher, { foreignKey: 'user_id' });

  // Student associations
  Student.belongsTo(User, { foreignKey: 'user_id' });
  Student.hasMany(GameResult, { foreignKey: 'student_id' });
  Student.hasMany(StudentGameProgress, { foreignKey: 'student_id' });
  Student.hasMany(GameAchievement, { foreignKey: 'student_id' });
  Student.hasMany(ProgressTracking, { foreignKey: 'student_id' });

  // Teacher associations
  Teacher.belongsTo(User, { foreignKey: 'user_id' });

  // GameLevel associations
  GameLevel.hasMany(GameResult, { foreignKey: 'level_id' });

  // GameResult associations
  GameResult.belongsTo(Student, { foreignKey: 'student_id' });
  GameResult.belongsTo(GameLevel, { foreignKey: 'level_id' });

  // StudentGameProgress associations
  StudentGameProgress.belongsTo(Student, { foreignKey: 'student_id' });

  // GameAchievement associations
  GameAchievement.belongsTo(Student, { foreignKey: 'student_id' });

  // Lesson associations
  Lesson.hasMany(Exercise, { foreignKey: 'lesson_id' });
  Lesson.hasMany(ProgressTracking, { foreignKey: 'lesson_id' });

  // Exercise associations
  Exercise.belongsTo(Lesson, { foreignKey: 'lesson_id' });

  // Test associations
  Test.hasMany(TestResult, { foreignKey: 'test_id' });

  // TestResult associations
  TestResult.belongsTo(Test, { foreignKey: 'test_id' });

  // ProgressTracking associations
  ProgressTracking.belongsTo(Student, { foreignKey: 'student_id' });
  ProgressTracking.belongsTo(Lesson, { foreignKey: 'lesson_id' });

  // CompletedLevel associations
  CompletedLevel.belongsTo(Student, { foreignKey: 'student_id' });

  // Reward associations
  Reward.belongsTo(Student, { foreignKey: 'student_id' });
};
