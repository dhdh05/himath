import { sequelize, User, Student, Teacher, Lesson, Exercise, Test, GameLevel } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    // Create sample users
    const users = await User.bulkCreate([
      {
        username: 'hocsinh',
        password: '123456',
        full_name: 'Bé Bi (5 tuổi)',
        role: 'student',
        email: 'hocsinh@example.com'
      },
      {
        username: 'giaovien',
        password: '123456',
        full_name: 'Cô Giáo Hạnh',
        role: 'teacher',
        email: 'giaovien@example.com'
      },
      {
        username: 'admin',
        password: '123456',
        full_name: 'Quản Trị Viên',
        role: 'admin',
        email: 'admin@example.com'
      }
    ], { individualHooks: true });

    console.log('✅ Users created');

    // Create students
    await Student.bulkCreate([
      {
        user_id: users[0].user_id,
        class_name: 'Lá Mầm',
        total_stars: 10,
        current_level: 1
      }
    ]);

    console.log('✅ Students created');

    // Create teacher
    await Teacher.bulkCreate([
      {
        user_id: users[1].user_id,
        subject: 'Toán Tư Duy',
        bio: 'Giáo viên 10 năm kinh nghiệm dạy trẻ'
      }
    ]);

    console.log('✅ Teachers created');

    // Create lessons
    const lessons = await Lesson.bulkCreate([
      {
        title: 'Bài 1: Nhận biết số lượng',
        topic: 'Toán Cơ Bản',
        description: 'Học nhận biết số lượng từ 1 đến 10',
        content: 'Bài học về nhận biết số lượng...',
        teacher_id: users[1].user_id,
        created_by: users[1].user_id
      },
      {
        title: 'Bài 2: Cộng trừ đơn giản',
        topic: 'Toán Cơ Bản',
        description: 'Học phép cộng và phép trừ từ 0 đến 10',
        content: 'Bài học về phép cộng và phép trừ...',
        teacher_id: users[1].user_id,
        created_by: users[1].user_id
      }
    ]);

    console.log('✅ Lessons created');

    // Create exercises
    await Exercise.bulkCreate([
      {
        lesson_id: lessons[0].lesson_id,
        question_text: 'Có bao nhiêu quả táo?',
        options: ['1', '2', '3', '4'],
        correct_answer: '3',
        level: 'easy',
        type: 'multiple_choice'
      },
      {
        lesson_id: lessons[1].lesson_id,
        question_text: '2 + 3 = ?',
        options: ['4', '5', '6', '7'],
        correct_answer: '5',
        level: 'easy',
        type: 'multiple_choice'
      }
    ]);

    console.log('✅ Exercises created');

    // Create test
    const test = await Test.create({
      title: 'Luyện tập tự do',
      created_by: users[1].user_id
    });

    console.log('✅ Test created');

    // Create game levels for all game types
    const gameLevels = [
      // hoc-so (Học số - Learn Numbers)
      {
        game_type: 'hoc-so',
        level_number: 1,
        title: 'Học từ 0 đến 3',
        description: 'Nhận biết và học các số từ 0 đến 3 với hình ảnh và âm thanh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 60,
        config: { numbers: [0, 1, 2, 3], hasAudio: true }
      },
      {
        game_type: 'hoc-so',
        level_number: 2,
        title: 'Học từ 4 đến 6',
        description: 'Nhận biết và học các số từ 4 đến 6 với hình ảnh và âm thanh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 60,
        config: { numbers: [4, 5, 6], hasAudio: true }
      },
      {
        game_type: 'hoc-so',
        level_number: 3,
        title: 'Học từ 7 đến 9',
        description: 'Nhận biết và học các số từ 7 đến 9 với hình ảnh và âm thanh',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [7, 8, 9], hasAudio: true }
      },
      {
        game_type: 'hoc-so',
        level_number: 4,
        title: 'Ôn tập 0 đến 9',
        description: 'Ôn tập tất cả các số từ 0 đến 9',
        difficulty: 'medium',
        time_limit: 150,
        required_score: 75,
        config: { numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hasAudio: true }
      },

      // ghep-so (Ghép Số - Drag and Drop Game)
      {
        game_type: 'ghep-so',
        level_number: 1,
        title: 'Ghép số 1-3',
        description: 'Kéo thả các số để ghép với đúng số lượng hình ảnh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [1, 2, 3], hasIcons: true, levels: 3 }
      },
      {
        game_type: 'ghep-so',
        level_number: 2,
        title: 'Ghép số 4-6',
        description: 'Kéo thả các số để ghép với số lượng hình ảnh từ 4 đến 6',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [4, 5, 6], hasIcons: true, levels: 3 }
      },
      {
        game_type: 'ghep-so',
        level_number: 3,
        title: 'Ghép số 7-9',
        description: 'Kéo thả các số để ghép với số lượng hình ảnh từ 7 đến 9',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: { numbers: [7, 8, 9], hasIcons: true, levels: 3 }
      },
      {
        game_type: 'ghep-so',
        level_number: 4,
        title: 'Ghép hỗn hợp',
        description: 'Kéo thả các số để ghép với số lượng hình ảnh hỗn hợp',
        difficulty: 'medium',
        time_limit: 150,
        required_score: 75,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], hasIcons: true, levels: 4 }
      },
      {
        game_type: 'ghep-so',
        level_number: 5,
        title: 'Ghép thách thức',
        description: 'Thách thức: Ghép các số ngẫu nhiên nhanh chóng',
        difficulty: 'hard',
        time_limit: 90,
        required_score: 80,
        config: { numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hasIcons: true, levels: 5, speedMode: true }
      },
      {
        game_type: 'ghep-so',
        level_number: 6,
        title: 'Vua ghép số',
        description: 'Cấp độ cao nhất: Tốc độ và độ chính xác',
        difficulty: 'hard',
        time_limit: 60,
        required_score: 85,
        config: { numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hasIcons: true, levels: 6, speedMode: true, zen: false }
      },

      // chan-le (Chẵn Lẻ - Even/Odd Classification)
      {
        game_type: 'chan-le',
        level_number: 1,
        title: 'Nhận biết chẵn lẻ 1-5',
        description: 'Phân loại các số từ 1 đến 5 là chẵn hay lẻ',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [1, 2, 3, 4, 5], range: '1-5' }
      },
      {
        game_type: 'chan-le',
        level_number: 2,
        title: 'Nhận biết chẵn lẻ 1-9',
        description: 'Phân loại các số từ 1 đến 9 là chẵn hay lẻ',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], range: '1-9' }
      },
      {
        game_type: 'chan-le',
        level_number: 3,
        title: 'Tốc độ chẵn lẻ',
        description: 'Phân loại chẵn lẻ với thời gian giới hạn',
        difficulty: 'hard',
        time_limit: 90,
        required_score: 80,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], range: '1-9', speedMode: true }
      },

      // so-sanh (So Sánh - Number Comparison)
      {
        game_type: 'so-sanh',
        level_number: 1,
        title: 'So sánh 1-3',
        description: 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 3',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [1, 2, 3], comparisons: ['>', '<', '='] }
      },
      {
        game_type: 'so-sanh',
        level_number: 2,
        title: 'So sánh 1-6',
        description: 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 6',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: { numbers: [1, 2, 3, 4, 5, 6], comparisons: ['>', '<', '='] }
      },
      {
        game_type: 'so-sanh',
        level_number: 3,
        title: 'So sánh 1-9',
        description: 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 9',
        difficulty: 'hard',
        time_limit: 120,
        required_score: 80,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], comparisons: ['>', '<', '='] }
      },

      // xep-so (Xếp Số - Sort Numbers)
      {
        game_type: 'xep-so',
        level_number: 1,
        title: 'Xếp số từ bé đến lớn 1-3',
        description: 'Sắp xếp các số từ 1 đến 3 theo thứ tự từ bé đến lớn',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: { numbers: [1, 2, 3], sortOrder: 'ascending' }
      },
      {
        game_type: 'xep-so',
        level_number: 2,
        title: 'Xếp số từ bé đến lớn 1-6',
        description: 'Sắp xếp các số từ 1 đến 6 theo thứ tự từ bé đến lớn',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: { numbers: [1, 2, 3, 4, 5, 6], sortOrder: 'ascending' }
      },
      {
        game_type: 'xep-so',
        level_number: 3,
        title: 'Xếp số từ bé đến lớn 1-9',
        description: 'Sắp xếp các số từ 1 đến 9 theo thứ tự từ bé đến lớn',
        difficulty: 'hard',
        time_limit: 120,
        required_score: 80,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], sortOrder: 'ascending' }
      },
      {
        game_type: 'xep-so',
        level_number: 4,
        title: 'Xếp số từ lớn đến bé 1-9',
        description: 'Sắp xếp các số từ 1 đến 9 theo thứ tự từ lớn đến bé',
        difficulty: 'hard',
        time_limit: 120,
        required_score: 80,
        config: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], sortOrder: 'descending' }
      }
    ];

    await GameLevel.bulkCreate(gameLevels);
    console.log('✅ Game levels created');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
