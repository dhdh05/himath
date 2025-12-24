import { sequelize } from '../config/database.js';
import GameLevel from '../models/GameLevel.js';

const gameLevels = [
    // Học số (hoc-so)
    {
        game_type: 'hoc-so',
        level_number: 1,
        title: 'Học từ 0 đến 3',
        description: 'Nhận biết và học các số từ 0 đến 3 với hình ảnh và âm thanh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 60,
        config: JSON.stringify({ numbers: [0, 1, 2, 3], hasAudio: true })
    },
    {
        game_type: 'hoc-so',
        level_number: 2,
        title: 'Học từ 4 đến 6',
        description: 'Nhận biết và học các số từ 4 đến 6 với hình ảnh và âm thanh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 60,
        config: JSON.stringify({ numbers: [4, 5, 6], hasAudio: true })
    },
    {
        game_type: 'hoc-so',
        level_number: 3,
        title: 'Học từ 7 đến 9',
        description: 'Nhận biết và học các số từ 7 đến 9 với hình ảnh và âm thanh',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [7, 8, 9], hasAudio: true })
    },
    {
        game_type: 'hoc-so',
        level_number: 4,
        title: 'Ôn tập 0 đến 9',
        description: 'Ôn tập tất cả các số từ 0 đến 9',
        difficulty: 'medium',
        time_limit: 150,
        required_score: 75,
        config: JSON.stringify({ numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hasAudio: true })
    },

    // Ghép số (ghep-so)
    {
        game_type: 'ghep-so',
        level_number: 1,
        title: 'Ghép số 1-3',
        description: 'Kéo thả các số để ghép với đúng số lượng hình ảnh',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [1, 2, 3], hasIcons: true, levels: 3 })
    },
    {
        game_type: 'ghep-so',
        level_number: 2,
        title: 'Ghép số 4-6',
        description: 'Kéo thả các số để ghép với số lượng hình ảnh từ 4 đến 6',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [4, 5, 6], hasIcons: true, levels: 3 })
    },
    {
        game_type: 'ghep-so',
        level_number: 3,
        title: 'Ghép số 7-9',
        description: 'Kéo thả các số để ghép với số lượng hình ảnh từ 7 đến 9',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: JSON.stringify({ numbers: [7, 8, 9], hasIcons: true, levels: 3 })
    },

    // Chẵn lẻ (chan-le)
    {
        game_type: 'chan-le',
        level_number: 1,
        title: 'Nhận biết chẵn lẻ 1-5',
        description: 'Phân loại các số từ 1 đến 5 là chẵn hay lẻ',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [1, 2, 3, 4, 5], range: '1-5' })
    },
    {
        game_type: 'chan-le',
        level_number: 2,
        title: 'Nhận biết chẵn lẻ 1-9',
        description: 'Phân loại các số từ 1 đến 9 là chẵn hay lẻ',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: JSON.stringify({ numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], range: '1-9' })
    },

    // So sánh (so-sanh)
    {
        game_type: 'so-sanh',
        level_number: 1,
        title: 'So sánh 1-3',
        description: 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 3',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [1, 2, 3], comparisons: ['>', '<', '='] })
    },
    {
        game_type: 'so-sanh',
        level_number: 2,
        title: 'So sánh 1-6',
        description: 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 6',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: JSON.stringify({ numbers: [1, 2, 3, 4, 5, 6], comparisons: ['>', '<', '='] })
    },

    // Xếp số (xep-so)
    {
        game_type: 'xep-so',
        level_number: 1,
        title: 'Xếp số từ bé đến lớn 1-3',
        description: 'Sắp xếp các số từ 1 đến 3 theo thứ tự từ bé đến lớn',
        difficulty: 'easy',
        time_limit: 120,
        required_score: 70,
        config: JSON.stringify({ numbers: [1, 2, 3], sortOrder: 'ascending' })
    },
    {
        game_type: 'xep-so',
        level_number: 2,
        title: 'Xếp số từ bé đến lớn 1-6',
        description: 'Sắp xếp các số từ 1 đến 6 theo thứ tự từ bé đến lớn',
        difficulty: 'medium',
        time_limit: 120,
        required_score: 75,
        config: JSON.stringify({ numbers: [1, 2, 3, 4, 5, 6], sortOrder: 'ascending' })
    }
];

async function seedGameLevels() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Clear existing game levels
        await GameLevel.destroy({ where: {} });
        console.log('🗑️  Cleared existing game levels');

        // Insert new game levels
        await GameLevel.bulkCreate(gameLevels);
        console.log(`✅ Seeded ${gameLevels.length} game levels`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding game levels:', error);
        process.exit(1);
    }
}

seedGameLevels();
