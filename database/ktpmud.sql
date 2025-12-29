SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Users & Roles
-- --------------------------------------------------------

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `avatar_url` varchar(255) DEFAULT 'default_avatar.png',
  `role` enum('admin','teacher','student','parent') DEFAULT 'student',
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `parent_pin` varchar(4) DEFAULT '1234',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `parents` (
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `teachers` (
  `user_id` int(11) NOT NULL,
  `subject` varchar(50) DEFAULT 'Toán',
  `hire_date` datetime DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `students` (
  `user_id` int(11) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `quick_login_code` varchar(6) DEFAULT NULL,
  `total_stars` int(11) DEFAULT 0,
  `current_level` int(11) DEFAULT 1,
  PRIMARY KEY (`user_id`),
  KEY `parent_id` (`parent_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Learning Content
-- --------------------------------------------------------

CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `topic` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lessons_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exercises` (
  `exercise_id` int(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `level` enum('easy','medium','hard') DEFAULT 'easy',
  `type` enum('multiple_choice','drag_drop','matching') DEFAULT 'multiple_choice',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`exercise_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Games & Progress
-- --------------------------------------------------------

CREATE TABLE `game_levels` (
  `level_id` int(11) NOT NULL AUTO_INCREMENT,
  `game_type` varchar(50) NOT NULL,
  `level_number` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `instruction_audio` varchar(255) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'easy',
  `time_limit` int(11) DEFAULT 60,
  `required_score` int(11) DEFAULT 80,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`level_id`),
  KEY `idx_game_type` (`game_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `game_results` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `game_type` varchar(50) NOT NULL,
  `score` int(11) DEFAULT 0,
  `max_score` int(11) DEFAULT 100,
  `stars` int(11) DEFAULT 0,
  `time_spent` int(11) DEFAULT 0,
  `attempts` int(11) DEFAULT 1,
  `is_passed` tinyint(1) DEFAULT 0,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `completed_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`result_id`),
  KEY `idx_student_game` (`student_id`,`game_type`),
  KEY `idx_level` (`level_id`),
  CONSTRAINT `game_results_ibfk_15` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `game_results_ibfk_16` FOREIGN KEY (`level_id`) REFERENCES `game_levels` (`level_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `student_game_progress` (
  `progress_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `current_level` int(11) DEFAULT 1,
  `highest_level_passed` int(11) DEFAULT 0,
  `total_stars` int(11) DEFAULT 0,
  `total_attempts` int(11) DEFAULT 0,
  `last_played_at` datetime DEFAULT NULL,
  `last_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `unique_student_game` (`student_id`,`game_type`),
  KEY `idx_game_type` (`game_type`),
  CONSTRAINT `student_game_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `game_achievements` (
  `achievement_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `game_type` varchar(20) DEFAULT NULL,
  `achievement_type` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `earned_at` datetime DEFAULT NULL,
  PRIMARY KEY (`achievement_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_achievement_type` (`achievement_type`),
  CONSTRAINT `game_achievements_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rewards` (
  `reward_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `reward_title` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `date_awarded` datetime DEFAULT NULL,
  PRIMARY KEY (`reward_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Analytics
-- --------------------------------------------------------

CREATE TABLE `study_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `page_name` varchar(100) NOT NULL,
  `start_time` datetime DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_user_session` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `analytics_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `event_type` varchar(50) NOT NULL,
  `game_name` varchar(100) DEFAULT NULL,
  `event_data` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_event` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Initial Data
-- --------------------------------------------------------

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `avatar_url`, `role`, `email`, `phone`, `created_at`, `updated_at`, `parent_pin`) VALUES
(1, 'hocsinh', '123', 'Bé Bi (5 tuổi)', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(3, 'phuhuynh', '123', 'Mẹ Bé Bi', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(4, 'admin', '123', 'Quản Trị Viên', 'default_avatar.png', 'admin', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(5, 'st_Nam', '123', 'Be Nam', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:00:42', '2025-12-21 14:00:42', '1234'),
(6, 'st_Trung', '123', 'Be Phan Cong Trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:23:25', '2025-12-21 14:23:25', '1234'),
(7, 'st_Huy', '123', 'Be Nguyen Quang Huy', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:27:52', '2025-12-21 14:27:52', '1234'),
(8, 'hocsinhmoi-trung', '123', 'trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:32:24', '2025-12-21 14:32:24', '1234'),
(9, 'phuhuynhmoi-Hieu', '123', 'Hieu', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 14:57:28', '2025-12-21 14:57:28', '1234'),
(10, '123', '123', 'hocsinhmoi-Linh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:13:55', '2025-12-22 21:13:55', '1234'),
(11, 'st_Lunh', '123', 'Lunh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:15:31', '2025-12-22 21:15:31', '1234'),
(12, 'giaovien', '123', 'behui 20tui', 'default_avatar.png', 'student', NULL, NULL, '2025-12-27 16:29:06', NULL, '1234'),
(13, 'trungngu', '123', 'trung ngu', 'default_avatar.png', 'student', NULL, NULL, '2025-12-27 21:38:41', NULL, '1234'),
(14, 'betrungnghean', '$2b$10$Y9DWHpRJRC04sJixBYffn.2TwpP90sBoJcynmMAUd1stsQ7bGy.7y', 'Bé Trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-28 20:11:46', NULL, '0000'),
(15, 'behuythaibinh', '$2b$10$m94yA.2TYDIOkTu.RIvX2.UACQbc.ZJVYeN7iApV4qo9d6R.1IZg6', 'Bé Huy 20 tuổi', 'default_avatar.png', 'student', NULL, NULL, '2025-12-28 21:28:53', NULL, '2101');

INSERT INTO `parents` (`user_id`) VALUES (3), (9);

INSERT INTO `students` (`user_id`, `date_of_birth`, `class_name`, `parent_id`, `teacher_id`, `quick_login_code`, `total_stars`, `current_level`) VALUES
(1, '2020-01-01 00:00:00', 'Lớp Mầm', 9, NULL, NULL, 10, 1),
(5, NULL, NULL, 9, NULL, NULL, 0, 1),
(6, NULL, NULL, 9, NULL, NULL, 0, 1),
(7, NULL, NULL, NULL, NULL, NULL, 0, 1),
(8, NULL, NULL, NULL, NULL, NULL, 0, 1),
(10, NULL, NULL, NULL, NULL, NULL, 0, 1),
(11, NULL, NULL, NULL, NULL, NULL, 0, 1),
(12, NULL, NULL, NULL, NULL, NULL, 0, 1),
(13, NULL, NULL, NULL, NULL, NULL, 0, 1),
(14, NULL, NULL, NULL, NULL, NULL, 0, 1),
(15, NULL, NULL, NULL, NULL, NULL, 0, 1);

INSERT INTO `lessons` (`title`, `topic`, `description`, `video_url`, `thumbnail_url`, `created_at`) VALUES
('Học đếm số tiếng Anh (1-10)', 'Ngoại ngữ', 'Bé học đếm số tiếng Anh vui nhộn.', 'https://drive.google.com/file/d/1FV7ZNywSaBBqP1ShVJXOBoB7mB3TPzkx/view?usp=drive_link', 'https://img.freepik.com/free-vector/numbers-cartoons-set_1284-11652.jpg', NOW()),
('Học đếm số tiếng Hàn (1-10)', 'Ngoại ngữ', 'Cùng Pinkfong đếm số tiếng Hàn thật dễ dàng.', 'https://drive.google.com/file/d/1PvVUcItfaHe_WosHsELAu6wB0hRBCWPr/view?usp=drive_link', './assets/images/thumbnails/kr-numbers-1.png', NOW()),
('Cùng đếm từ 1 tới 10 bằng tiếng Trung nhé', 'Ngoại ngữ', 'Học đếm số tiếng Trung qua bài hát vui nhộn.', 'https://drive.google.com/file/d/1HPvHALcAmGGY2VmBEXbe9XiS6sF9NyO4/view?usp=sharing', './assets/images/thumbnails/chinese_numbers.jpg', NOW()),
('TEST KỸ THUẬT: Sintel (W3C)', 'Test', 'Video này để kiểm tra trình phát MP4.', 'https://media.w3.org/2010/05/sintel/trailer.mp4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/640px-Sintel_poster.jpg', NOW());

INSERT INTO `game_levels` (`level_id`, `game_type`, `level_number`, `title`, `description`, `thumbnail_url`, `instruction_audio`, `difficulty`, `time_limit`, `required_score`, `config`, `created_at`) VALUES
(37, 'hoc-so', 1, 'Học từ 0 đến 3', 'Nhận biết và học các số từ 0 đến 3 với hình ảnh và âm thanh', NULL, NULL, 'easy', 120, 60, '\"{\\\"numbers\\\":[0,1,2,3],\\\"hasAudio\\\":true}\"', '2025-12-24 14:50:20'),
(38, 'hoc-so', 2, 'Học từ 4 đến 6', 'Nhận biết và học các số từ 4 đến 6 với hình ảnh và âm thanh', NULL, NULL, 'easy', 120, 60, '\"{\\\"numbers\\\":[4,5,6],\\\"hasAudio\\\":true}\"', '2025-12-24 14:50:20'),
(39, 'hoc-so', 3, 'Học từ 7 đến 9', 'Nhận biết và học các số từ 7 đến 9 với hình ảnh và âm thanh', NULL, NULL, 'medium', 120, 70, '\"{\\\"numbers\\\":[7,8,9],\\\"hasAudio\\\":true}\"', '2025-12-24 14:50:20'),
(40, 'hoc-so', 4, 'Ôn tập 0 đến 9', 'Ôn tập tất cả các số từ 0 đến 9', NULL, NULL, 'medium', 150, 75, '\"{\\\"numbers\\\":[0,1,2,3,4,5,6,7,8,9],\\\"hasAudio\\\":true}\"', '2025-12-24 14:50:20'),
(41, 'ghep-so', 1, 'Ghép số 1-3', 'Kéo thả các số để ghép với đúng số lượng hình ảnh', NULL, NULL, 'easy', 120, 70, '\"{\\\"numbers\\\":[1,2,3],\\\"hasIcons\\\":true,\\\"levels\\\":3}\"', '2025-12-24 14:50:20'),
(42, 'ghep-so', 2, 'Ghép số 4-6', 'Kéo thả các số để ghép với số lượng hình ảnh từ 4 đến 6', NULL, NULL, 'easy', 120, 70, '\"{\\\"numbers\\\":[4,5,6],\\\"hasIcons\\\":true,\\\"levels\\\":3}\"', '2025-12-24 14:50:20'),
(43, 'ghep-so', 3, 'Ghép số 7-9', 'Kéo thả các số để ghép với số lượng hình ảnh từ 7 đến 9', NULL, NULL, 'medium', 120, 75, '\"{\\\"numbers\\\":[7,8,9],\\\"hasIcons\\\":true,\\\"levels\\\":3}\"', '2025-12-24 14:50:20'),
(44, 'chan-le', 1, 'Nhận biết chẵn lẻ 1-5', 'Phân loại các số từ 1 đến 5 là chẵn hay lẻ', NULL, NULL, 'easy', 120, 70, '\"{\\\"numbers\\\":[1,2,3,4,5],\\\"range\\\":\\\"1-5\\\"}\"', '2025-12-24 14:50:20'),
(45, 'chan-le', 2, 'Nhận biết chẵn lẻ 1-9', 'Phân loại các số từ 1 đến 9 là chẵn hay lẻ', NULL, NULL, 'medium', 120, 75, '\"{\\\"numbers\\\":[1,2,3,4,5,6,7,8,9],\\\"range\\\":\\\"1-9\\\"}\"', '2025-12-24 14:50:20'),
(46, 'so-sanh', 1, 'So sánh 1-3', 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 3', NULL, NULL, 'easy', 120, 70, '\"{\\\"numbers\\\":[1,2,3],\\\"comparisons\\\":[\\\">\\\",\\\"<\\\",\\\"=\\\"]}\"', '2025-12-24 14:50:20'),
(47, 'so-sanh', 2, 'So sánh 1-6', 'So sánh số lớn hơn, nhỏ hơn hoặc bằng với các số từ 1 đến 6', NULL, NULL, 'medium', 120, 75, '\"{\\\"numbers\\\":[1,2,3,4,5,6],\\\"comparisons\\\":[\\\">\\\",\\\"<\\\",\\\"=\\\"]}\"', '2025-12-24 14:50:20'),
(48, 'xep-so', 1, 'Xếp số từ bé đến lớn 1-3', 'Sắp xếp các số từ 1 đến 3 theo thứ tự từ bé đến lớn', NULL, NULL, 'easy', 120, 70, '\"{\\\"numbers\\\":[1,2,3],\\\"sortOrder\\\":\\\"ascending\\\"}\"', '2025-12-24 14:50:20'),
(49, 'xep-so', 2, 'Xếp số từ bé đến lớn 1-6', 'Sắp xếp các số từ 1 đến 6 theo thứ tự từ bé đến lớn', NULL, NULL, 'medium', 120, 75, '\"{\\\"numbers\\\":[1,2,3,4,5,6],\\\"sortOrder\\\":\\\"ascending\\\"}\"', '2025-12-24 14:50:20'),
(50, 'chan-le', 1, 'Nhập môn Chẵn Lẻ', 'Phân biệt số trong phạm vi 20', NULL, NULL, 'easy', 60, 80, '{\"range\": 20, \"time\": 60}', NULL),
(51, 'chan-le', 2, 'Thử thách nhanh tay', 'Phạm vi 50 - Thời gian 45 giây', NULL, NULL, 'easy', 60, 80, '{\"range\": 50, \"time\": 45}', NULL),
(52, 'chan-le', 3, 'Siêu trí tuệ', 'Phạm vi 100 - Thời gian 30 giây', NULL, NULL, 'easy', 60, 80, '{\"range\": 100, \"time\": 30}', NULL),
(56, 'dem-so', 1, 'Tập đếm 1 đến 5', 'Bé làm quen với các số nhỏ', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 5}', NULL),
(57, 'dem-so', 2, 'Tập đếm 6 đến 10', 'Thử thách đếm nhiều hình hơn', NULL, NULL, 'easy', 60, 80, '{\"min\": 6, \"max\": 10}', NULL),
(58, 'dem-so', 3, 'Tập đếm nâng cao', 'Đếm số lượng lớn đến 20', NULL, NULL, 'easy', 60, 80, '{\"min\": 10, \"max\": 20}', NULL),
(59, 'chan-le', 1, 'Nhập môn Chẵn Lẻ', 'Phân biệt số trong phạm vi 20', NULL, NULL, 'easy', 60, 80, '{\"range\": 20, \"time\": 60}', NULL),
(60, 'chan-le', 2, 'Thử thách nhanh tay', 'Phạm vi 50 - Thời gian 45 giây', NULL, NULL, 'easy', 60, 80, '{\"range\": 50, \"time\": 45}', NULL),
(61, 'chan-le', 3, 'Siêu trí tuệ', 'Phạm vi 100 - Thời gian 30 giây', NULL, NULL, 'easy', 60, 80, '{\"range\": 100, \"time\": 30}', NULL),
(62, 'dino', 1, 'Khủng long tập đi', 'Tốc độ chậm, phép cộng trừ cơ bản', NULL, NULL, 'easy', 60, 80, '{\"speed\": 5, \"ops\": [\"+\", \"-\"]}', NULL),
(63, 'dino', 2, 'Khủng long tốc độ', 'Tốc độ nhanh, thử thách nhân chia', NULL, NULL, 'easy', 60, 80, '{\"speed\": 9, \"ops\": [\"*\", \"/\"]}', NULL),
(64, 'ghep-so', 1, 'Ghép cặp đơn giản', 'Nối số với hình (Phạm vi 1-5)', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 5, \"pairs\": 3, \"time\": 60}', NULL),
(65, 'ghep-so', 2, 'Thử thách tinh mắt', 'Nối số với hình (Phạm vi 1-10)', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 10, \"pairs\": 4, \"time\": 90}', NULL),
(66, 'ghep-so', 3, 'Siêu trí nhớ', 'Nhiều hình hơn (Phạm vi 1-20)', NULL, NULL, 'easy', 60, 80, '{\"min\": 5, \"max\": 20, \"pairs\": 5, \"time\": 120}', NULL),
(67, 'hoc-chu-so', 1, 'Làm quen chữ số 0-9', 'Bé học mặt số, cách đọc và tập đếm', NULL, NULL, 'easy', 60, 80, '{\r\n    \"numbers\": [\r\n        {\"val\": 0, \"name\": \"Số Không\", \"icon\": \"circle\"},\r\n        {\"val\": 1, \"name\": \"Số Một\", \"icon\": \"apple-alt\"},\r\n        {\"val\": 2, \"name\": \"Số Hai\", \"icon\": \"car\"},\r\n        {\"val\": 3, \"name\": \"Số Ba\", \"icon\": \"cat\"},\r\n        {\"val\": 4, \"name\": \"Số Bốn\", \"icon\": \"dog\"},\r\n        {\"val\": 5, \"name\": \"Số Năm\", \"icon\": \"fish\"},\r\n        {\"val\": 6, \"name\": \"Số Sáu\", \"icon\": \"ice-cream\"},\r\n        {\"val\": 7, \"name\": \"Số Bảy\", \"icon\": \"star\"},\r\n        {\"val\": 8, \"name\": \"Số Tám\", \"icon\": \"heart\"},\r\n        {\"val\": 9, \"name\": \"Số Chín\", \"icon\": \"leaf\"}\r\n    ]\r\n}', NULL),
(68, 'hung-tao', 1, 'Hứng Táo Cơ Bản', 'Phép cộng trừ phạm vi 10, tốc độ chậm', NULL, NULL, 'easy', 60, 80, '{\"speed\": 2.5, \"range\": 10, \"ops\": [\"+\", \"-\"]}', NULL),
(69, 'hung-tao', 2, 'Hứng Táo Nâng Cao', 'Phép nhân chia phạm vi 20, tốc độ nhanh', NULL, NULL, 'easy', 60, 80, '{\"speed\": 4.5, \"range\": 20, \"ops\": [\"*\", \"/\"]}', NULL),
(70, 'nhan-ngon', 1, 'Tập đếm 1 bàn tay', 'Giơ ngón tay để trả lời phép tính trong phạm vi 5', NULL, NULL, 'easy', 60, 80, '{\"max\": 5, \"questions\": 5}', NULL),
(71, 'nhan-ngon', 2, 'Thử thách 2 bàn tay', 'Sử dụng cả 2 tay để tính toán trong phạm vi 10', NULL, NULL, 'easy', 60, 80, '{\"max\": 10, \"questions\": 10}', NULL),
(72, 'tinh-toan', 1, 'Luyện tập Phép Cộng', 'Tính tổng các số ngẫu nhiên', NULL, NULL, 'easy', 60, 80, '{\"mode\": \"addition\"}', NULL),
(73, 'tinh-toan', 2, 'Luyện tập Phép Trừ', 'Tính hiệu các số ngẫu nhiên', NULL, NULL, 'easy', 60, 80, '{\"mode\": \"subtraction\"}', NULL),
(74, 'tinh-toan', 3, 'Thử thách Hỗn hợp', 'Kết hợp cả cộng và trừ', NULL, NULL, 'easy', 60, 80, '{\"mode\": \"both\"}', NULL),
(75, 'so-sanh', 1, 'So sánh cơ bản', 'Phạm vi các số từ 0 đến 10', NULL, NULL, 'easy', 60, 80, '{\"max\": 10}', NULL),
(76, 'so-sanh', 2, 'So sánh nâng cao', 'Phạm vi các số từ 0 đến 20', NULL, NULL, 'easy', 60, 80, '{\"max\": 20}', NULL),
(77, 'so-sanh', 3, 'Thử thách trí tuệ', 'Phạm vi các số từ 0 đến 50', NULL, NULL, 'easy', 60, 80, '{\"max\": 50}', NULL),
(78, 'xep-so', 1, 'Sắp xếp cơ bản', 'Phạm vi các số từ 1 đến 10', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 10, \"count\": 5}', NULL),
(79, 'xep-so', 2, 'Sắp xếp mở rộng', 'Phạm vi các số từ 1 đến 20', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 20, \"count\": 5}', NULL),
(80, 'xep-so', 3, 'Thử thách lớn', 'Phạm vi các số từ 1 đến 50', NULL, NULL, 'easy', 60, 80, '{\"min\": 1, \"max\": 50, \"count\": 5}', NULL);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
