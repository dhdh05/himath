-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2025 at 10:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ktpmud`
--

-- --------------------------------------------------------

--
-- Table structure for table `analytics_events`
--

CREATE TABLE `analytics_events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_type` varchar(50) NOT NULL COMMENT 'LEVEL_UP, ATTEMPT, CLICK...',
  `game_name` varchar(100) DEFAULT NULL,
  `event_data` longtext DEFAULT NULL COMMENT 'Chứa JSON chi tiết (level, điểm, đúng/sai)',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `analytics_events`
--

INSERT INTO `analytics_events` (`id`, `user_id`, `event_type`, `game_name`, `event_data`, `created_at`) VALUES
(1, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":12,\"userAnswer\":\"odd\",\"correct\":false,\"isTimeout\":false}', '2025-12-27 14:36:13'),
(2, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":9,\"userAnswer\":\"odd\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:18'),
(3, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":2,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:27'),
(4, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":14,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:47'),
(5, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":2,\"userAnswer\":\"odd\",\"correct\":false,\"isTimeout\":false}', '2025-12-27 14:36:52'),
(6, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":2,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:55'),
(7, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":14,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:57'),
(8, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":16,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:36:59'),
(9, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":2,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:37:01'),
(10, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":16,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:37:03'),
(11, 1, 'ATTEMPT', 'digits-chan-le', '{\"question\":0,\"userAnswer\":\"even\",\"correct\":true,\"isTimeout\":false}', '2025-12-27 14:37:04'),
(12, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"5 - 1 = ?\",\"userAnswer\":4,\"correctAnswer\":4,\"correct\":true,\"currentScore\":1}', '2025-12-27 15:01:55'),
(13, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"6 + 4 = ?\",\"userAnswer\":10,\"correctAnswer\":10,\"correct\":true,\"currentScore\":12}', '2025-12-27 15:02:19'),
(14, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"11 + 8 = ?\",\"userAnswer\":19,\"correctAnswer\":19,\"correct\":true,\"currentScore\":31}', '2025-12-27 15:02:54'),
(15, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"9 + 10 = ?\",\"userAnswer\":14,\"correctAnswer\":19,\"correct\":false,\"currentScore\":31}', '2025-12-27 15:02:57'),
(16, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"2 + 13 = ?\",\"userAnswer\":1,\"correctAnswer\":15,\"correct\":false,\"currentScore\":31}', '2025-12-27 15:03:00'),
(17, 1, 'ATTEMPT', 'games-dino', '{\"question\":\"14 + 0 = ?\",\"userAnswer\":14,\"correctAnswer\":14,\"correct\":true,\"currentScore\":31}', '2025-12-27 15:03:03'),
(18, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-27 15:38:39'),
(19, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-27 15:39:37'),
(20, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 15:42:38'),
(21, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 15:42:40'),
(22, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 15:42:42'),
(23, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 15:42:45'),
(24, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 15:42:46'),
(25, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 15:42:47'),
(26, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2}]}}', '2025-12-27 15:42:50'),
(27, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 15:42:59'),
(28, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 15:43:01'),
(29, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 15:43:02'),
(30, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 15:43:04'),
(31, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 15:43:07'),
(32, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 15:43:10'),
(33, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:13'),
(34, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(35, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(36, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(37, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(38, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(39, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(40, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(41, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(42, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `completed_levels`
--

CREATE TABLE `completed_levels` (
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `completed_levels`
--

INSERT INTO `completed_levels` (`user_id`, `level_id`, `student_id`) VALUES
(1, 1001, NULL),
(1, 1002, NULL),
(6, 1, NULL),
(6, 2001, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `exercise_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` varchar(255) DEFAULT NULL,
  `level` enum('easy','medium','hard') DEFAULT 'easy',
  `type` enum('multiple_choice','drag_drop','matching') DEFAULT 'multiple_choice',
  `created_at` datetime DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `game_achievements`
--

CREATE TABLE `game_achievements` (
  `achievement_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `game_type` varchar(20) DEFAULT NULL,
  `achievement_type` enum('first_play','perfect_score','level_master','streak_5','streak_10','speedrun','game_guru','star_collector') NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `earned_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_levels`
--

CREATE TABLE `game_levels` (
  `level_id` int(11) NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `level_number` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `instruction_audio` varchar(255) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'easy',
  `time_limit` int(11) DEFAULT 60 COMMENT 'Giới hạn thời gian (giây)',
  `required_score` int(11) DEFAULT 80 COMMENT 'Điểm tối thiểu để qua level',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Configuration cho từng game' CHECK (json_valid(`config`)),
  `created_at` datetime DEFAULT NULL
) ;

--
-- Dumping data for table `game_levels`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `game_progress`
--

CREATE TABLE `game_progress` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `current_level` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_results`
--

CREATE TABLE `game_results` (
  `result_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `score` int(11) DEFAULT 0,
  `max_score` int(11) DEFAULT 100,
  `stars` int(11) DEFAULT 0 COMMENT 'Số sao (0-3)',
  `time_spent` int(11) DEFAULT 0,
  `attempts` int(11) DEFAULT 1 COMMENT 'Số lần thử',
  `is_passed` tinyint(1) DEFAULT 0,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Chi tiết câu trả lời' CHECK (json_valid(`answers`)),
  `completed_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `game_results`
--

INSERT INTO `game_results` (`result_id`, `student_id`, `level_id`, `game_type`, `score`, `max_score`, `stars`, `time_spent`, `attempts`, `is_passed`, `answers`, `completed_at`) VALUES
(3, 1, 67, 'hoc-chu-so', 100, 100, 3, 60, 1, 1, '[]', NULL),
(4, 1, 41, 'ghep-so', 0, 100, 0, 60, 1, 0, '[]', NULL),
(5, 1, 68, 'hung-tao', 20, 100, 1, 60, 1, 0, '[]', NULL),
(6, 1, 69, 'hung-tao', 20, 100, 1, 60, 1, 0, '[]', NULL),
(7, 1, 68, 'hung-tao', 10, 100, 1, 6, 1, 0, '[]', NULL),
(8, 1, 69, 'hung-tao', 0, 100, 1, 3, 1, 0, NULL, '2025-12-26 17:46:42'),
(9, 1, 69, 'hung-tao', 10, 100, 1, 3, 1, 0, NULL, '2025-12-26 17:46:48'),
(10, 1, 56, 'dem-so', 100, 100, 3, 44, 1, 1, NULL, '2025-12-27 15:29:28'),
(11, 1, 41, 'ghep-so', 60, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:42:50'),
(12, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:13'),
(13, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(14, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(15, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(16, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(17, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(18, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(19, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(20, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(21, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 15:43:16'),
(22, 1, 70, 'practice-nhan-ngon', 100, 100, 3, 79, 1, 1, NULL, '2025-12-27 15:57:34'),
(23, 1, 75, 'so-sanh', 100, 100, 3, 30, 1, 1, NULL, '2025-12-27 16:02:45');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `topic` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parents`
--

CREATE TABLE `parents` (
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parents`
--

INSERT INTO `parents` (`user_id`) VALUES
(3),
(9);

-- --------------------------------------------------------

--
-- Table structure for table `parent_notifications`
--

CREATE TABLE `parent_notifications` (
  `notification_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` enum('progress','test_result','reminder','system') DEFAULT 'progress',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `progress_tracking`
--

CREATE TABLE `progress_tracking` (
  `track_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `status` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  `last_accessed` datetime DEFAULT NULL,
  `streak_days` int(11) DEFAULT 0,
  `total_time_spent` int(11) DEFAULT 0 COMMENT 'Tổng thời gian học (phút)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `reward_title` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `date_awarded` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `user_id` int(11) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `quick_login_code` varchar(6) DEFAULT NULL,
  `total_stars` int(11) DEFAULT 0,
  `current_level` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`user_id`, `date_of_birth`, `class_name`, `parent_id`, `teacher_id`, `quick_login_code`, `total_stars`, `current_level`) VALUES
(1, '2020-01-01 00:00:00', 'L?? M???m', 9, NULL, NULL, 10, 1),
(5, NULL, NULL, 9, NULL, NULL, 0, 1),
(6, NULL, NULL, 9, NULL, NULL, 0, 1),
(7, NULL, NULL, NULL, NULL, NULL, 0, 1),
(8, NULL, NULL, NULL, NULL, NULL, 0, 1),
(10, NULL, NULL, NULL, NULL, NULL, 0, 1),
(11, NULL, NULL, NULL, NULL, NULL, 0, 1),
(12, NULL, NULL, NULL, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_game_progress`
--

CREATE TABLE `student_game_progress` (
  `progress_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `game_type` enum('hoc-so','ghep-so','chan-le','so-sanh','xep-so') NOT NULL,
  `current_level` int(11) DEFAULT 1,
  `highest_level_passed` int(11) DEFAULT 0,
  `total_stars` int(11) DEFAULT 0,
  `total_attempts` int(11) DEFAULT 0,
  `last_played_at` datetime DEFAULT NULL,
  `last_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_game_progress`
--

INSERT INTO `student_game_progress` (`progress_id`, `student_id`, `game_type`, `current_level`, `highest_level_passed`, `total_stars`, `total_attempts`, `last_played_at`, `last_updated_at`) VALUES
(1, 1, '', 2, 1, 3, 0, '2025-12-26 16:49:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `study_sessions`
--

CREATE TABLE `study_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `page_name` varchar(100) NOT NULL,
  `start_time` datetime DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT 0 COMMENT 'Số giây học'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `study_sessions`
--

INSERT INTO `study_sessions` (`id`, `user_id`, `page_name`, `start_time`, `end_time`, `duration`) VALUES
(1, 1, 'digits-chan-le', '2025-12-27 07:36:12', '2025-12-27 07:37:11', 59),
(2, 1, 'digits-chan-le', '2025-12-27 07:36:12', '2025-12-27 07:37:11', 59),
(3, 1, 'home', '2025-12-27 07:37:11', NULL, 0),
(4, 1, 'home', '2025-12-27 07:38:13', NULL, 0),
(5, 1, 'home', '2025-12-27 07:41:29', NULL, 0),
(6, 1, 'home', '2025-12-27 07:49:07', NULL, 0),
(7, 1, 'home', '2025-12-27 08:01:43', '2025-12-27 08:01:49', 6),
(8, 1, 'games-dino', '2025-12-27 08:01:49', '2025-12-27 08:03:06', 77),
(9, 1, 'games-dino', '2025-12-27 08:01:49', '2025-12-27 08:03:06', 77),
(10, 1, 'home', '2025-12-27 08:03:06', '2025-12-27 08:13:33', 627),
(11, 1, 'practice-tinh-toan', '2025-12-27 08:13:33', '2025-12-27 08:16:10', 157),
(12, 1, 'digits-ghep-so', '2025-12-27 08:16:10', '2025-12-27 08:17:02', 52),
(13, 1, 'home', '2025-12-27 08:17:02', NULL, 0),
(14, 1, 'home', '2025-12-27 08:28:19', '2025-12-27 08:28:44', 25),
(15, 1, 'digits-dem-so', '2025-12-27 08:28:44', NULL, 0),
(16, 1, 'digits-dem-so', '2025-12-27 08:28:45', NULL, 0),
(17, 1, 'home', '2025-12-27 08:31:46', NULL, 0),
(18, 1, 'home', '2025-12-27 08:38:21', '2025-12-27 08:38:24', 3),
(19, 1, 'games-dino', '2025-12-27 08:38:24', '2025-12-27 08:39:41', 77),
(20, 1, 'games-dino', '2025-12-27 08:38:24', '2025-12-27 08:39:41', 77),
(21, 1, 'home', '2025-12-27 08:39:41', NULL, 0),
(22, 1, 'home', '2025-12-27 08:42:30', '2025-12-27 08:42:34', 4),
(23, 1, 'digits-ghep-so', '2025-12-27 08:42:34', '2025-12-27 08:43:16', 42),
(24, 1, 'digits-ghep-so', '2025-12-27 08:42:34', '2025-12-27 08:43:16', 42),
(25, 1, 'home', '2025-12-27 08:43:16', NULL, 0),
(26, 1, 'home', '2025-12-27 08:46:39', '2025-12-27 08:46:41', 2),
(27, 1, 'digits-hoc-so', '2025-12-27 08:46:41', '2025-12-27 08:46:56', 15),
(28, 1, 'digits-hoc-so', '2025-12-27 08:46:41', '2025-12-27 08:46:56', 15),
(29, 1, 'home', '2025-12-27 08:46:56', NULL, 0),
(30, 1, 'home', '2025-12-27 08:47:46', '2025-12-27 08:47:51', 5),
(31, 1, 'digits-hoc-so', '2025-12-27 08:47:51', NULL, 0),
(32, 1, 'digits-hoc-so', '2025-12-27 08:47:51', NULL, 0),
(33, 1, 'home', '2025-12-27 08:49:34', '2025-12-27 08:49:36', 2),
(34, 1, 'digits-hoc-so', '2025-12-27 08:49:36', NULL, 0),
(35, 1, 'digits-hoc-so', '2025-12-27 08:49:36', NULL, 0),
(36, 1, 'home', '2025-12-27 08:51:39', '2025-12-27 08:51:42', 3),
(37, 1, 'games', '2025-12-27 08:51:42', '2025-12-27 08:52:47', 65),
(38, 1, 'games', '2025-12-27 08:51:42', '2025-12-27 08:52:47', 65),
(39, 1, 'home', '2025-12-27 08:52:47', NULL, 0),
(40, 1, 'home', '2025-12-27 08:55:09', '2025-12-27 08:56:09', 60),
(41, 1, 'games-dino', '2025-12-27 08:56:09', '2025-12-27 08:56:12', 3),
(42, 1, 'games-dino', '2025-12-27 08:56:09', '2025-12-27 08:56:12', 3),
(43, 1, 'practice-nhan-ngon', '2025-12-27 08:56:12', NULL, 0),
(44, 1, 'practice-nhan-ngon', '2025-12-27 08:56:12', NULL, 0),
(45, 1, 'home', '2025-12-27 08:59:38', '2025-12-27 09:01:20', 102),
(46, 1, 'compare-so-sanh', '2025-12-27 09:01:20', NULL, 0),
(47, 1, 'home', '2025-12-27 09:02:13', '2025-12-27 09:02:15', 2),
(48, 1, 'compare-so-sanh', '2025-12-27 09:02:15', NULL, 0),
(49, 1, 'compare-so-sanh', '2025-12-27 09:02:15', NULL, 0),
(50, 1, 'home', '2025-12-27 09:04:31', '2025-12-27 09:04:34', 3),
(51, 1, 'compare-xep-so', '2025-12-27 09:04:34', '2025-12-27 09:04:54', 20),
(52, 1, 'compare-xep-so', '2025-12-27 09:04:35', '2025-12-27 09:04:54', 19),
(53, 1, 'home', '2025-12-27 09:04:54', '2025-12-27 09:08:30', 216),
(54, 1, 'home', '2025-12-27 09:08:30', '2025-12-27 09:08:37', 7),
(55, 1, 'home', '2025-12-27 09:08:37', '2025-12-27 09:08:38', 1),
(56, 1, 'users', '2025-12-27 09:08:38', NULL, 0),
(57, 1, 'home', '2025-12-27 09:09:29', '2025-12-27 09:09:30', 1),
(58, 1, 'users', '2025-12-27 09:09:30', '2025-12-27 09:09:52', 22),
(59, 1, 'home', '2025-12-27 09:09:52', '2025-12-27 09:10:28', 36),
(60, 1, 'users', '2025-12-27 09:10:28', NULL, 0),
(61, 1, 'home', '2025-12-27 09:11:43', NULL, 0),
(62, 1, 'home', '2025-12-27 09:11:47', NULL, 0),
(63, 1, 'home', '2025-12-27 09:14:40', NULL, 0),
(64, 1, 'home', '2025-12-27 09:14:43', NULL, 0),
(65, 1, 'home', '2025-12-27 09:15:51', NULL, 0),
(66, 1, 'home', '2025-12-27 09:15:55', NULL, 0),
(67, 1, 'home', '2025-12-27 09:17:13', NULL, 0),
(68, 1, 'home', '2025-12-27 09:17:20', NULL, 0),
(69, 1, 'home', '2025-12-27 09:17:25', NULL, 0),
(70, 1, 'home', '2025-12-27 09:17:58', NULL, 0),
(71, 1, 'home', '2025-12-27 09:18:02', NULL, 0),
(72, 1, 'home', '2025-12-27 09:18:06', NULL, 0),
(73, 1, 'home', '2025-12-27 09:18:40', NULL, 0),
(74, 1, 'home', '2025-12-27 09:19:52', NULL, 0),
(75, 1, 'home', '2025-12-27 09:20:01', NULL, 0),
(76, 1, 'home', '2025-12-27 09:20:04', NULL, 0),
(77, 1, 'home', '2025-12-27 09:24:52', NULL, 0),
(78, 1, 'home', '2025-12-27 09:28:53', NULL, 0),
(79, 1, 'home', '2025-12-27 09:29:12', '2025-12-27 09:29:15', 3),
(80, 1, 'practice-nhan-ngon', '2025-12-27 09:29:15', '2025-12-27 09:29:17', 2),
(81, 1, 'practice-nhan-ngon', '2025-12-27 09:29:15', '2025-12-27 09:29:17', 2),
(82, 1, 'users', '2025-12-27 09:29:17', NULL, 0),
(83, 1, 'home', '2025-12-27 09:30:29', '2025-12-27 09:30:39', 10),
(84, 1, 'users', '2025-12-27 09:30:39', NULL, 0),
(85, 1, 'home', '2025-12-27 09:35:05', '2025-12-27 09:35:08', 3),
(86, 1, 'users', '2025-12-27 09:35:08', '2025-12-27 09:35:24', 16),
(87, 1, 'users', '2025-12-27 09:35:24', '2025-12-27 09:35:32', 8),
(88, 1, 'home', '2025-12-27 09:35:32', NULL, 0),
(89, 1, 'home', '2025-12-27 09:35:40', NULL, 0),
(90, 1, 'home', '2025-12-27 09:35:42', NULL, 0),
(91, 1, 'home', '2025-12-27 09:35:47', '2025-12-27 09:35:49', 2),
(92, 1, 'users', '2025-12-27 09:35:49', NULL, 0),
(93, 1, 'home', '2025-12-27 09:37:14', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `user_id` int(11) NOT NULL,
  `subject` varchar(50) DEFAULT 'Toán',
  `hire_date` datetime DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `test_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `lesson_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'Thời gian làm bài (phút)',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`test_id`, `title`, `lesson_id`, `duration`, `created_by`, `created_at`) VALUES
(1, 'Luy???n t???p t??? do', NULL, NULL, NULL, '2025-12-21 14:03:57');

-- --------------------------------------------------------

--
-- Table structure for table `test_exercises`
--

CREATE TABLE `test_exercises` (
  `test_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `seq` int(11) DEFAULT 1 COMMENT 'Th??? t??? c??u h???i'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_results`
--

CREATE TABLE `test_results` (
  `result_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` float DEFAULT 0,
  `total_questions` int(11) DEFAULT NULL,
  `correct_count` int(11) DEFAULT NULL,
  `time_spent` int(11) DEFAULT NULL COMMENT 'Thời gian hoàn thành (giây)',
  `submitted_at` datetime DEFAULT NULL,
  `teacher_feedback` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `test_results`
--

INSERT INTO `test_results` (`result_id`, `test_id`, `student_id`, `score`, `total_questions`, `correct_count`, `time_spent`, `submitted_at`, `teacher_feedback`) VALUES
(1, 1, 5, 10, 3, 3, NULL, '2025-12-21 14:17:58', NULL),
(2, 1, 5, 10, 4, 4, NULL, '2025-12-21 14:18:22', NULL),
(3, 1, 5, 10, 3, 3, NULL, '2025-12-21 14:18:34', NULL),
(4, 1, 5, 2.72727, 11, 3, NULL, '2025-12-21 14:19:08', NULL),
(5, 1, 7, 5, 6, 3, NULL, '2025-12-21 14:28:49', NULL),
(6, 1, 8, 4.28571, 7, 3, NULL, '2025-12-21 14:33:24', NULL),
(7, 1, 5, 7.5, 4, 3, NULL, '2025-12-21 15:54:18', NULL),
(8, 1, 5, 5, 6, 3, NULL, '2025-12-21 15:54:33', NULL),
(9, 1, 1, 5, 6, 3, NULL, '2025-12-21 16:13:53', NULL),
(10, 1, 1, 6, 5, 3, NULL, '2025-12-21 16:17:18', NULL),
(11, 1, 1, 7.5, 4, 3, NULL, '2025-12-21 16:19:13', NULL),
(12, 1, 1, 10, 3, 3, NULL, '2025-12-21 16:28:51', NULL),
(13, 1, 1, 10, 3, 3, NULL, '2025-12-21 16:28:58', NULL),
(14, 1, 1, 5, 6, 3, NULL, '2025-12-21 16:29:36', NULL),
(15, 1, 5, 10, 3, 3, NULL, '2025-12-22 19:36:38', NULL),
(16, 1, 1, 6, 5, 3, NULL, '2025-12-22 20:45:27', NULL),
(17, 1, 1, 7.5, 4, 3, NULL, '2025-12-22 20:45:36', NULL),
(18, 1, 1, 7.5, 4, 3, NULL, '2025-12-22 20:46:40', NULL),
(19, 1, 1, 10, 3, 3, NULL, '2025-12-22 20:53:23', NULL),
(20, 1, 11, 10, 3, 3, NULL, '2025-12-22 21:16:17', NULL),
(21, 1, 11, 5, 6, 3, NULL, '2025-12-22 21:16:30', NULL),
(22, 1, 11, 10, 3, 3, NULL, '2025-12-22 21:16:47', NULL),
(23, 1, 11, 10, 3, 3, NULL, '2025-12-22 21:17:11', NULL),
(24, 1, 1, 10, 3, 3, NULL, '2025-12-23 11:07:22', NULL),
(25, 1, 1, 10, 3, 3, NULL, '2025-12-23 11:11:50', NULL),
(26, 1, 6, 7.5, 4, 3, NULL, '2025-12-23 11:12:52', NULL),
(27, 1, 6, 10, 3, 3, NULL, '2025-12-23 11:13:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `avatar_url` varchar(255) DEFAULT 'default_avatar.png',
  `role` enum('admin','teacher','student','parent') DEFAULT 'student',
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `parent_pin` varchar(4) DEFAULT '1234'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `avatar_url`, `role`, `email`, `phone`, `created_at`, `updated_at`, `parent_pin`) VALUES
(1, 'hocsinh', '123', 'Bé Bi (5 tuổi)', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(3, 'phuhuynh', '123', 'M??? B?? Bi', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(4, 'admin', '123', 'Qu???n Tr??? Vi??n', 'default_avatar.png', 'admin', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234'),
(5, 'st_Nam', '123', 'Be Nam', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:00:42', '2025-12-21 14:00:42', '1234'),
(6, 'st_Trung', '123', 'Be Phan Cong Trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:23:25', '2025-12-21 14:23:25', '1234'),
(7, 'st_Huy', '123', 'Be Nguyen Quang Huy', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:27:52', '2025-12-21 14:27:52', '1234'),
(8, 'hocsinhmoi-trung', '123', 'trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:32:24', '2025-12-21 14:32:24', '1234'),
(9, 'phuhuynhmoi-Hieu', '123', 'Hieu', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 14:57:28', '2025-12-21 14:57:28', '1234'),
(10, '123', '123', 'hocsinhmoi-Linh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:13:55', '2025-12-22 21:13:55', '1234'),
(11, 'st_Lunh', '123', 'Lunh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:15:31', '2025-12-22 21:15:31', '1234'),
(12, 'giaovien', '123', 'behui 20tui', 'default_avatar.png', 'student', NULL, NULL, '2025-12-27 16:29:06', NULL, '1234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics_events`
--
ALTER TABLE `analytics_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_event` (`user_id`);

--
-- Indexes for table `completed_levels`
--
ALTER TABLE `completed_levels`
  ADD PRIMARY KEY (`user_id`,`level_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`exercise_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `game_achievements`
--
ALTER TABLE `game_achievements`
  ADD PRIMARY KEY (`achievement_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_achievement_type` (`achievement_type`);

--
-- Indexes for table `game_levels`
--
ALTER TABLE `game_levels`
  ADD PRIMARY KEY (`level_id`),
  ADD KEY `idx_game_type` (`game_type`);

--
-- Indexes for table `game_progress`
--
ALTER TABLE `game_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `game_results`
--
ALTER TABLE `game_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `idx_student_game` (`student_id`,`game_type`),
  ADD KEY `idx_level` (`level_id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `parent_notifications`
--
ALTER TABLE `parent_notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  ADD PRIMARY KEY (`track_id`),
  ADD UNIQUE KEY `unique_progress` (`student_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `student_game_progress`
--
ALTER TABLE `student_game_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `unique_student_game` (`student_id`,`game_type`),
  ADD KEY `idx_game_type` (`game_type`);

--
-- Indexes for table `study_sessions`
--
ALTER TABLE `study_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_session` (`user_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `lesson_id` (`lesson_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `test_exercises`
--
ALTER TABLE `test_exercises`
  ADD PRIMARY KEY (`test_id`,`exercise_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indexes for table `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `test_id` (`test_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analytics_events`
--
ALTER TABLE `analytics_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `exercise_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_achievements`
--
ALTER TABLE `game_achievements`
  MODIFY `achievement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_levels`
--
ALTER TABLE `game_levels`
  MODIFY `level_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_progress`
--
ALTER TABLE `game_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_results`
--
ALTER TABLE `game_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parent_notifications`
--
ALTER TABLE `parent_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  MODIFY `track_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_game_progress`
--
ALTER TABLE `student_game_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_sessions`
--
ALTER TABLE `study_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `test_results`
--
ALTER TABLE `test_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `completed_levels`
--
ALTER TABLE `completed_levels`
  ADD CONSTRAINT `completed_levels_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `game_achievements`
--
ALTER TABLE `game_achievements`
  ADD CONSTRAINT `game_achievements_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `game_progress`
--
ALTER TABLE `game_progress`
  ADD CONSTRAINT `game_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`);

--
-- Constraints for table `game_results`
--
ALTER TABLE `game_results`
  ADD CONSTRAINT `game_results_ibfk_15` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `game_results_ibfk_16` FOREIGN KEY (`level_id`) REFERENCES `game_levels` (`level_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parent_notifications`
--
ALTER TABLE `parent_notifications`
  ADD CONSTRAINT `parent_notifications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `parent_notifications_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  ADD CONSTRAINT `progress_tracking_ibfk_15` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `progress_tracking_ibfk_16` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_game_progress`
--
ALTER TABLE `student_game_progress`
  ADD CONSTRAINT `student_game_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `tests_ibfk_15` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_16` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `test_exercises`
--
ALTER TABLE `test_exercises`
  ADD CONSTRAINT `test_exercises_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `test_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`exercise_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_ibfk_15` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `test_results_ibfk_16` FOREIGN KEY (`student_id`) REFERENCES `students` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
