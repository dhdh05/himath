-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 29, 2025 at 04:37 PM
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
(42, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 15:43:17'),
(43, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 21:34:02'),
(44, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-27 21:36:54'),
(45, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 21:45:33'),
(46, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 21:45:38'),
(47, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 21:45:42'),
(48, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 21:45:48'),
(49, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 21:45:52'),
(50, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 21:45:58'),
(51, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3}]}}', '2025-12-27 21:46:01'),
(52, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 21:46:10'),
(53, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 21:46:12'),
(54, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 21:46:15'),
(55, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 21:46:18'),
(56, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 21:46:20'),
(57, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 21:46:21'),
(58, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4}]}}', '2025-12-27 21:46:25'),
(59, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 21:46:30'),
(60, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 21:46:31'),
(61, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 21:46:33'),
(62, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 21:46:34'),
(63, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 21:46:36'),
(64, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":3,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 21:46:37'),
(65, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":3,\"score\":180,\"questions\":[{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":3,\"count\":3,\"placedNumber\":3}]}}', '2025-12-27 21:46:41'),
(66, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-27 21:46:45'),
(67, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-27 21:46:48'),
(68, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-27 21:46:50'),
(69, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-27 21:46:52'),
(70, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-27 21:46:53'),
(71, 1, 'ATTEMPT', 'digits-ghep-so', '{\"level\":4,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-27 21:46:55'),
(72, 1, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":4,\"score\":240,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":1,\"count\":1,\"placedNumber\":1}]}}', '2025-12-27 21:46:58'),
(73, 13, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-27 22:07:45'),
(74, 14, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-28 20:44:39'),
(75, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":false}', '2025-12-28 21:10:48'),
(76, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-28 21:10:51'),
(77, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":false}', '2025-12-28 21:10:55'),
(78, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-28 21:10:59'),
(79, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":false}', '2025-12-28 21:11:02'),
(80, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":false}', '2025-12-28 21:11:06'),
(81, 1, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":false}', '2025-12-28 21:11:09'),
(82, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-28 21:29:27'),
(83, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-28 21:29:30'),
(84, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-28 21:29:32'),
(85, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-28 21:29:33'),
(86, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":3,\"correct\":false}', '2025-12-28 21:29:34'),
(87, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-28 21:29:36'),
(88, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-28 21:29:40'),
(89, 15, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5}]}}', '2025-12-28 21:29:41'),
(90, 15, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5}]}}', '2025-12-28 21:29:41'),
(91, 15, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5}]}}', '2025-12-28 21:29:41'),
(92, 15, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5}]}}', '2025-12-28 21:29:42'),
(93, 15, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5}]}}', '2025-12-28 21:29:42'),
(94, 15, 'LEVEL_UP', 'ghep_level_failed', '{\"level\":{\"level\":1,\"score\":0,\"questions\":[{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4},{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2}]}}', '2025-12-29 02:23:02'),
(95, 15, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-29 16:40:34'),
(96, 15, 'ATTEMPT', 'games-dino', '{\"type\":\"revive\",\"correct\":true}', '2025-12-29 16:42:53'),
(97, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-29 17:04:14'),
(98, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-29 17:04:17'),
(99, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-29 17:04:18'),
(100, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-29 17:04:20'),
(101, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-29 17:04:22'),
(102, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":1,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-29 17:04:24'),
(103, 16, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":1,\"score\":60,\"questions\":[{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Kem\",\"icon\":\"fas fa-ice-cream\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Lá\",\"icon\":\"fas fa-leaf\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":2,\"count\":2,\"placedNumber\":2}]}}', '2025-12-29 17:04:27'),
(104, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":1,\"answer\":1,\"correct\":true}', '2025-12-29 17:04:31'),
(105, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":2,\"answer\":2,\"correct\":true}', '2025-12-29 17:04:34'),
(106, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":5,\"answer\":5,\"correct\":true}', '2025-12-29 17:04:36'),
(107, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":3,\"answer\":3,\"correct\":true}', '2025-12-29 17:04:38'),
(108, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":4,\"answer\":4,\"correct\":true}', '2025-12-29 17:04:40'),
(109, 16, 'ATTEMPT', 'digits-ghep-so', '{\"level\":2,\"chosen\":6,\"answer\":6,\"correct\":true}', '2025-12-29 17:04:41'),
(110, 16, 'LEVEL_UP', 'ghep_level_complete', '{\"level\":{\"level\":2,\"score\":120,\"questions\":[{\"iconType\":\"Hình vuông\",\"icon\":\"fas fa-square\",\"answer\":5,\"count\":5,\"placedNumber\":5},{\"iconType\":\"Táo\",\"icon\":\"fas fa-apple-alt\",\"answer\":4,\"count\":4,\"placedNumber\":4},{\"iconType\":\"Chanh\",\"icon\":\"fas fa-lemon\",\"answer\":6,\"count\":6,\"placedNumber\":6},{\"iconType\":\"Trái tim\",\"icon\":\"fas fa-heart\",\"answer\":1,\"count\":1,\"placedNumber\":1},{\"iconType\":\"Cà rốt\",\"icon\":\"fas fa-carrot\",\"answer\":3,\"count\":3,\"placedNumber\":3},{\"iconType\":\"Ngôi sao\",\"icon\":\"fas fa-star\",\"answer\":2,\"count\":2,\"placedNumber\":2}]}}', '2025-12-29 17:04:44');

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

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`exercise_id`, `lesson_id`, `question_text`, `audio_url`, `image_url`, `options`, `correct_answer`, `level`, `type`, `created_at`) VALUES
(1, 1, 'Số 1 trong tiếng Anh đọc là gì?', NULL, NULL, '[\"One\",\"Two\",\"Three\"]', 'One', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(2, 1, 'Số 2 trong tiếng Anh đọc là gì?', NULL, NULL, '[\"One\",\"Two\",\"Three\"]', 'Two', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(3, 1, 'Số 3 trong tiếng Anh đọc là gì?', NULL, NULL, '[\"Five\",\"Four\",\"Three\"]', 'Three', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(4, 1, 'Quả táo tiếng Anh là gì?', NULL, NULL, '[\"Banana\",\"Apple\",\"Orange\"]', 'Apple', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(5, 2, 'Số 1 tiếng Hàn đọc là gì?', NULL, NULL, '[\"Hana\",\"Dul\",\"Set\"]', 'Hana', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(6, 2, 'Số 2 tiếng Hàn đọc là gì?', NULL, NULL, '[\"Hana\",\"Dul\",\"Set\"]', 'Dul', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(7, 3, 'Số 1 tiếng Trung đọc là gì?', NULL, NULL, '[\"Yi\",\"Er\",\"San\"]', 'Yi', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(8, 3, 'Số 10 tiếng Trung là gì?', NULL, NULL, '[\"Ba\",\"Jiu\",\"Shi\"]', 'Shi', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(9, 4, 'Video này dùng để làm gì?', NULL, NULL, '[\"Học hát\",\"Test kỹ thuật\",\"Đếm số\"]', 'Test kỹ thuật', 'easy', 'multiple_choice', '2025-12-29 05:20:18'),
(10, 5, 'Số nào đứng sau số 1?', NULL, NULL, '[\"0\",\"2\",\"3\",\"5\"]', '2', 'easy', 'multiple_choice', NULL),
(11, 5, 'Bàn tay bé có mấy ngón?', NULL, NULL, '[\"2\",\"5\",\"10\",\"1\"]', '5', 'easy', 'multiple_choice', NULL),
(12, 5, 'Số 10 gồm số 1 và số mấy?', NULL, NULL, '[\"0\",\"2\",\"5\",\"8\"]', '0', 'easy', 'multiple_choice', NULL),
(13, 5, 'Số nào lớn nhất trong các số sau?', NULL, NULL, '[\"1\",\"5\",\"9\",\"3\"]', '9', 'easy', 'multiple_choice', NULL),
(14, 6, 'Hình nào có thể lăn được?', NULL, NULL, '[\"Hình vuông\",\"Hình tam giác\",\"Hình tròn\",\"Hình chữ nhật\"]', 'Hình tròn', 'easy', 'multiple_choice', NULL),
(15, 6, 'Bánh chưng ngày Tết có hình gì?', NULL, NULL, '[\"Tròn\",\"Vuông\",\"Tam giác\",\"Sao\"]', 'Vuông', 'easy', 'multiple_choice', NULL),
(16, 6, 'Hình tam giác có mấy cạnh?', NULL, NULL, '[\"3 cạnh\",\"4 cạnh\",\"0 cạnh\",\"2 cạnh\"]', '3 cạnh', 'easy', 'multiple_choice', NULL),
(17, 6, 'Ông mặt trời thường được vẽ bằng hình gì?', NULL, NULL, '[\"Hình vuông\",\"Hình tròn\",\"Hình tam giác\",\"Hình chữ nhật\"]', 'Hình tròn', 'easy', 'multiple_choice', NULL);

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

--
-- Dumping data for table `game_achievements`
--

INSERT INTO `game_achievements` (`achievement_id`, `student_id`, `game_type`, `achievement_type`, `title`, `description`, `icon_url`, `earned_at`) VALUES
(1, 16, 'ghep-so', 'first_play', 'Khám Phá Mới! 🎮', 'Bé đã thử game ghep-so lần đầu!', NULL, '2025-12-29 17:04:27'),
(2, 16, 'tinh-toan', 'first_play', 'Khám Phá Mới! 🎮', 'Bé đã thử game tinh-toan lần đầu!', NULL, '2025-12-29 17:05:27');

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
(23, 1, 75, 'so-sanh', 100, 100, 3, 30, 1, 1, NULL, '2025-12-27 16:02:45'),
(24, 1, 50, 'chan-le', 70, 100, 1, 35, 1, 1, NULL, '2025-12-27 21:40:25'),
(25, 1, 41, 'ghep-so', 60, 100, 3, 3, 1, 1, NULL, '2025-12-27 21:46:01'),
(26, 1, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-27 21:46:24'),
(27, 1, 43, 'ghep-so', 180, 100, 3, 3, 1, 1, NULL, '2025-12-27 21:46:40'),
(28, 1, 44, 'ghep-so', 240, 100, 3, 3, 1, 1, NULL, '2025-12-27 21:46:58'),
(29, 14, 75, 'so-sanh', 100, 100, 3, 38, 1, 1, NULL, '2025-12-28 21:25:10'),
(30, 15, 41, 'ghep-so', 60, 100, 3, 1, 1, 1, NULL, '2025-12-28 21:29:41'),
(31, 15, 41, 'ghep-so', 60, 100, 3, 1, 1, 1, NULL, '2025-12-28 21:29:41'),
(32, 15, 41, 'ghep-so', 60, 100, 3, 1, 1, 1, NULL, '2025-12-28 21:29:41'),
(33, 15, 41, 'ghep-so', 60, 100, 3, 1, 1, 1, NULL, '2025-12-28 21:29:41'),
(34, 15, 41, 'ghep-so', 60, 100, 3, 1, 1, 1, NULL, '2025-12-28 21:29:41'),
(35, 15, 50, 'chan-le', 100, 100, 3, 32, 1, 1, NULL, '2025-12-28 21:30:13'),
(36, 15, 70, 'practice-nhan-ngon', 110, 100, 2, 3, 1, 1, NULL, '2025-12-28 21:40:20'),
(37, 15, 70, 'practice-nhan-ngon', 110, 100, 2, 3, 1, 1, NULL, '2025-12-28 21:40:20'),
(38, 15, 70, 'practice-nhan-ngon', 130, 100, 2, 18, 1, 1, NULL, '2025-12-28 21:43:48'),
(39, 15, 70, 'practice-nhan-ngon', 130, 100, 2, 18, 1, 1, NULL, '2025-12-28 21:43:48'),
(40, 15, 70, 'practice-nhan-ngon', 130, 100, 2, 18, 1, 1, NULL, '2025-12-28 21:43:48'),
(41, 15, 70, 'practice-nhan-ngon', 130, 100, 2, 19, 1, 1, NULL, '2025-12-28 21:43:48'),
(47, 16, 41, 'ghep-so', 60, 100, 3, 3, 1, 1, NULL, '2025-12-29 17:04:27'),
(48, 16, 42, 'ghep-so', 120, 100, 3, 3, 1, 1, NULL, '2025-12-29 17:04:44'),
(49, 16, 72, 'tinh-toan', 40, 100, 0, 27, 1, 0, NULL, '2025-12-29 17:05:27');

-- --------------------------------------------------------

--
-- Table structure for table `learning_goals`
--

CREATE TABLE `learning_goals` (
  `goal_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `goal_type` enum('time','stars','score') NOT NULL,
  `target_value` int(11) NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `status` enum('active','completed','failed') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learning_goals`
--

INSERT INTO `learning_goals` (`goal_id`, `student_id`, `goal_type`, `target_value`, `deadline`, `status`, `created_at`) VALUES
(1, 15, 'stars', 15, NULL, 'active', '2025-12-29 03:16:18'),
(2, 1, 'stars', 1000, NULL, 'active', '2025-12-29 04:50:11');

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

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `title`, `topic`, `description`, `content`, `video_url`, `thumbnail_url`, `teacher_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Học đếm số tiếng Anh (1-10)', 'Ngoại ngữ', 'Bé học đếm số tiếng Anh vui nhộn.', NULL, 'https://drive.google.com/file/d/1FV7ZNywSaBBqP1ShVJXOBoB7mB3TPzkx/view?usp=drive_link', 'https://i.ytimg.com/vi/Aq4UAss33qA/hqdefault.jpg', NULL, NULL, '2025-12-29 04:21:28', NULL),
(2, 'Học đếm số tiếng Hàn (1-10)', 'Ngoại ngữ', 'Cùng Pinkfong đếm số tiếng Hàn thật dễ dàng.', NULL, 'https://drive.google.com/file/d/1PvVUcItfaHe_WosHsELAu6wB0hRBCWPr/view?usp=drive_link', './assets/images/thumbnails/kr-numbers-1.png', NULL, NULL, '2025-12-29 04:21:28', NULL),
(3, 'Cùng đếm từ 1 tới 10 bằng tiếng Trung nhé', 'Ngoại ngữ', 'Học đếm số tiếng Trung qua bài hát vui nhộn.', NULL, 'https://drive.google.com/file/d/1HPvHALcAmGGY2VmBEXbe9XiS6sF9NyO4/view?usp=sharing', './assets/images/thumbnails/chinese_numbers.jpg', NULL, NULL, '2025-12-29 04:21:28', NULL),
(4, 'TEST KỸ THUẬT: Sintel (W3C)', 'Test', 'Video này để kiểm tra trình phát MP4.', NULL, 'https://media.w3.org/2010/05/sintel/trailer.mp4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/640px-Sintel_poster.jpg', NULL, NULL, '2025-12-29 04:21:28', NULL),
(5, 'Bé tập đếm số từ 1 đến 10', 'Toán học', 'Học đếm số thật vui qua bài hát sôi động!', NULL, 'https://www.youtube.com/watch?v=Aq4UAss33qA', 'https://i.ytimg.com/vi/Aq4UAss33qA/hqdefault.jpg', NULL, NULL, '2025-12-29 22:02:22', NULL),
(6, 'Nhận biết các hình khối cơ bản', 'Hình học', 'Hình tròn, hình vuông, hình tam giác có gì khác nhau nhỉ?', NULL, 'https://drive.google.com/file/d/1OkJ1dgjcbpBfNQqnrgDO_NGU0_1nuxgI/view?usp=drive_link', 'https://i.ytimg.com/vi/Kz8rKw-rVQI/hqdefault.jpg', NULL, NULL, '2025-12-29 22:02:22', NULL);

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
  `current_level` int(11) DEFAULT 1,
  `streak_count` int(11) DEFAULT 0,
  `last_activity_date` tinytext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`user_id`, `date_of_birth`, `class_name`, `parent_id`, `teacher_id`, `quick_login_code`, `total_stars`, `current_level`, `streak_count`, `last_activity_date`) VALUES
(1, '2020-01-01 00:00:00', 'L?? M???m', 9, NULL, NULL, 10, 1, 0, NULL),
(5, NULL, NULL, 9, NULL, NULL, 0, 1, 0, NULL),
(6, NULL, NULL, 9, NULL, NULL, 0, 1, 0, NULL),
(7, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(8, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(10, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(11, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(12, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(13, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL),
(14, NULL, NULL, NULL, NULL, NULL, 0, 1, 2, '2025-12-29'),
(15, NULL, NULL, NULL, NULL, NULL, 0, 1, 2, '2025-12-29'),
(16, NULL, NULL, NULL, NULL, NULL, 0, 1, 0, NULL);

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
(1, 1, '', 2, 1, 3, 0, '2025-12-26 16:49:12', NULL),
(2, 16, 'ghep-so', 2, 2, 6, 2, '2025-12-29 17:04:44', '2025-12-29 17:04:44'),
(4, 16, '', 1, 0, 0, 1, '2025-12-29 17:05:27', '2025-12-29 17:05:27');

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
(93, 1, 'home', '2025-12-27 09:37:14', NULL, 0),
(94, 1, 'home', '2025-12-27 09:37:45', NULL, 0),
(95, 1, 'home', '2025-12-27 09:37:48', NULL, 0),
(96, 1, 'home', '2025-12-27 09:48:13', NULL, 0),
(97, 1, 'home', '2025-12-27 14:32:05', NULL, 0),
(98, 1, 'home', '2025-12-27 14:32:49', NULL, 0),
(99, 1, 'home', '2025-12-27 14:32:59', '2025-12-27 14:33:00', 1),
(100, 1, 'users', '2025-12-27 14:33:00', '2025-12-27 14:33:21', 21),
(101, 1, 'digits-hoc-so', '2025-12-27 14:33:21', '2025-12-27 14:33:25', 4),
(102, 1, 'digits-hoc-so', '2025-12-27 14:33:21', '2025-12-27 14:33:25', 4),
(103, 1, 'digits-ghep-so', '2025-12-27 14:33:25', '2025-12-27 14:33:31', 6),
(104, 1, 'digits-ghep-so', '2025-12-27 14:33:25', '2025-12-27 14:33:31', 6),
(105, 1, 'digits-hoc-so', '2025-12-27 14:33:31', '2025-12-27 14:33:54', 23),
(106, 1, 'digits-hoc-so', '2025-12-27 14:33:31', '2025-12-27 14:33:54', 23),
(107, 1, 'digits-ghep-so', '2025-12-27 14:33:54', '2025-12-27 14:33:57', 3),
(108, 1, 'digits-ghep-so', '2025-12-27 14:33:54', '2025-12-27 14:33:57', 3),
(109, 1, 'digits-chan-le', '2025-12-27 14:33:57', '2025-12-27 14:33:59', 2),
(110, 1, 'digits-chan-le', '2025-12-27 14:33:57', '2025-12-27 14:33:59', 2),
(111, 1, 'digits-ghep-so', '2025-12-27 14:33:59', '2025-12-27 14:34:06', 7),
(112, 1, 'digits-ghep-so', '2025-12-27 14:33:59', '2025-12-27 14:34:06', 7),
(113, 1, 'digits-chan-le', '2025-12-27 14:34:06', '2025-12-27 14:34:36', 30),
(114, 1, 'digits-chan-le', '2025-12-27 14:34:06', '2025-12-27 14:34:36', 30),
(115, 1, 'digits-dem-so', '2025-12-27 14:34:36', '2025-12-27 14:35:48', 72),
(116, 1, 'digits-dem-so', '2025-12-27 14:34:36', '2025-12-27 14:35:48', 72),
(117, 1, 'compare-so-sanh', '2025-12-27 14:35:48', '2025-12-27 14:35:51', 3),
(118, 1, 'compare-so-sanh', '2025-12-27 14:35:48', '2025-12-27 14:35:51', 3),
(119, 1, 'compare-xep-so', '2025-12-27 14:35:51', '2025-12-27 14:35:56', 5),
(120, 1, 'compare-xep-so', '2025-12-27 14:35:51', '2025-12-27 14:35:56', 5),
(121, 1, 'practice-tinh-toan', '2025-12-27 14:35:56', '2025-12-27 14:35:58', 2),
(122, 1, 'practice-tinh-toan', '2025-12-27 14:35:56', '2025-12-27 14:35:58', 2),
(123, 1, 'practice-nhan-ngon', '2025-12-27 14:35:58', '2025-12-27 14:36:33', 35),
(124, 1, 'practice-nhan-ngon', '2025-12-27 14:35:58', '2025-12-27 14:36:33', 35),
(125, 1, 'games-dino', '2025-12-27 14:36:33', '2025-12-27 14:37:12', 39),
(126, 1, 'games-dino', '2025-12-27 14:36:33', '2025-12-27 14:37:12', 39),
(127, 1, 'users', '2025-12-27 14:37:12', '2025-12-27 14:37:15', 3),
(128, 1, 'home', '2025-12-27 14:37:15', '2025-12-27 14:37:22', 7),
(129, 1, 'games-dino', '2025-12-27 14:37:22', '2025-12-27 14:37:23', 1),
(130, 1, 'games-dino', '2025-12-27 14:37:22', '2025-12-27 14:37:23', 1),
(131, 1, 'games', '2025-12-27 14:37:23', '2025-12-27 14:37:51', 28),
(132, 1, 'games', '2025-12-27 14:37:23', '2025-12-27 14:37:51', 28),
(133, 1, 'home', '2025-12-27 14:37:51', '2025-12-27 14:38:04', 13),
(134, 1, 'home', '2025-12-27 14:38:04', NULL, 0),
(135, 1, 'home', '2025-12-27 14:38:12', NULL, 0),
(136, 1, 'home', '2025-12-27 14:38:15', NULL, 0),
(137, 1, 'home', '2025-12-27 14:38:48', '2025-12-27 14:39:08', 20),
(138, 1, 'users', '2025-12-27 14:39:08', '2025-12-27 14:39:30', 22),
(139, 1, 'home', '2025-12-27 14:39:30', '2025-12-27 14:39:41', 11),
(140, 1, 'digits-hoc-so', '2025-12-27 14:39:41', '2025-12-27 14:39:43', 2),
(141, 1, 'digits-hoc-so', '2025-12-27 14:39:41', '2025-12-27 14:39:43', 2),
(142, 1, 'digits-ghep-so', '2025-12-27 14:39:43', '2025-12-27 14:39:45', 2),
(143, 1, 'digits-ghep-so', '2025-12-27 14:39:43', '2025-12-27 14:39:45', 2),
(144, 1, 'digits-hoc-so', '2025-12-27 14:39:45', '2025-12-27 14:39:50', 5),
(145, 1, 'digits-hoc-so', '2025-12-27 14:39:45', '2025-12-27 14:39:50', 5),
(146, 1, 'digits-chan-le', '2025-12-27 14:39:50', '2025-12-27 14:40:33', 43),
(147, 1, 'digits-chan-le', '2025-12-27 14:39:50', '2025-12-27 14:40:33', 43),
(148, 1, 'users', '2025-12-27 14:40:33', '2025-12-27 14:40:42', 9),
(149, 1, 'games', '2025-12-27 14:40:42', '2025-12-27 14:41:07', 25),
(150, 1, 'games', '2025-12-27 14:40:43', '2025-12-27 14:41:07', 24),
(151, 1, 'home', '2025-12-27 14:41:07', '2025-12-27 14:41:09', 2),
(152, 1, 'users', '2025-12-27 14:41:09', NULL, 0),
(153, 1, 'home', '2025-12-27 14:42:22', '2025-12-27 14:42:24', 2),
(154, 1, 'users', '2025-12-27 14:42:24', '2025-12-27 14:42:36', 12),
(155, 1, 'home', '2025-12-27 14:42:36', NULL, 0),
(156, 1, 'home', '2025-12-27 14:42:43', NULL, 0),
(157, 1, 'home', '2025-12-27 14:42:50', NULL, 0),
(158, 1, 'home', '2025-12-27 14:42:57', '2025-12-27 14:43:00', 3),
(159, 1, 'users', '2025-12-27 14:43:00', '2025-12-27 14:44:35', 95),
(160, 1, 'home', '2025-12-27 14:44:35', NULL, 0),
(161, 1, 'home', '2025-12-27 14:44:40', NULL, 0),
(162, 1, 'home', '2025-12-27 14:44:44', NULL, 0),
(163, 1, 'home', '2025-12-27 14:44:55', '2025-12-27 14:45:06', 11),
(164, 1, 'digits-hoc-so', '2025-12-27 14:45:06', '2025-12-27 14:45:23', 17),
(165, 1, 'digits-hoc-so', '2025-12-27 14:45:06', '2025-12-27 14:45:23', 17),
(166, 1, 'digits-hoc-so', '2025-12-27 14:45:23', '2025-12-27 14:45:30', 7),
(167, 1, 'digits-hoc-so', '2025-12-27 14:45:23', '2025-12-27 14:45:30', 7),
(168, 1, 'digits-ghep-so', '2025-12-27 14:45:30', '2025-12-27 14:47:01', 91),
(169, 1, 'digits-ghep-so', '2025-12-27 14:45:30', '2025-12-27 14:47:01', 91),
(170, 1, 'digits-chan-le', '2025-12-27 14:47:01', '2025-12-27 14:47:03', 2),
(171, 1, 'digits-chan-le', '2025-12-27 14:47:01', '2025-12-27 14:47:03', 2),
(172, 1, 'digits-dem-so', '2025-12-27 14:47:03', '2025-12-27 14:47:07', 4),
(173, 1, 'digits-dem-so', '2025-12-27 14:47:03', '2025-12-27 14:47:07', 4),
(174, 1, 'compare-so-sanh', '2025-12-27 14:47:07', '2025-12-27 14:47:34', 27),
(175, 1, 'compare-so-sanh', '2025-12-27 14:47:07', '2025-12-27 14:47:34', 27),
(176, 1, 'compare-xep-so', '2025-12-27 14:47:34', '2025-12-27 14:48:07', 33),
(177, 1, 'compare-xep-so', '2025-12-27 14:47:34', '2025-12-27 14:48:07', 33),
(178, 1, 'practice-tinh-toan', '2025-12-27 14:48:07', '2025-12-27 14:48:17', 10),
(179, 1, 'practice-tinh-toan', '2025-12-27 14:48:07', '2025-12-27 14:48:17', 10),
(180, 1, 'practice-nhan-ngon', '2025-12-27 14:48:17', '2025-12-27 14:48:19', 2),
(181, 1, 'practice-nhan-ngon', '2025-12-27 14:48:17', '2025-12-27 14:48:19', 2),
(182, 1, 'practice-tinh-toan', '2025-12-27 14:48:19', '2025-12-27 14:49:07', 48),
(183, 1, 'practice-tinh-toan', '2025-12-27 14:48:19', '2025-12-27 14:49:07', 48),
(184, 1, 'practice-nhan-ngon', '2025-12-27 14:49:07', '2025-12-27 14:49:39', 32),
(185, 1, 'practice-nhan-ngon', '2025-12-27 14:49:07', '2025-12-27 14:49:39', 32),
(186, 1, 'games', '2025-12-27 14:49:39', '2025-12-27 14:49:42', 3),
(187, 1, 'games', '2025-12-27 14:49:39', '2025-12-27 14:49:42', 3),
(188, 1, 'games-dino', '2025-12-27 14:49:42', '2025-12-27 14:49:46', 4),
(189, 1, 'games-dino', '2025-12-27 14:49:42', '2025-12-27 14:49:46', 4),
(190, 1, 'users', '2025-12-27 14:49:46', '2025-12-27 14:50:12', 26),
(191, 1, 'games-dino', '2025-12-27 14:50:12', '2025-12-27 14:50:51', 39),
(192, 1, 'games-dino', '2025-12-27 14:50:12', '2025-12-27 14:50:51', 39),
(193, 1, 'home', '2025-12-27 14:50:51', NULL, 0),
(194, 1, 'home', '2025-12-27 14:52:06', NULL, 0),
(195, 1, 'home', '2025-12-27 14:52:09', NULL, 0),
(196, 1, 'home', '2025-12-27 14:53:29', NULL, 0),
(197, 1, 'home', '2025-12-27 14:53:43', NULL, 0),
(198, 1, 'home', '2025-12-27 14:56:20', NULL, 0),
(199, 1, 'home', '2025-12-27 14:56:47', NULL, 0),
(200, 1, 'home', '2025-12-27 15:03:11', NULL, 0),
(201, 13, 'home', '2025-12-27 15:03:29', '2025-12-27 15:03:32', 3),
(202, 13, 'digits-hoc-so', '2025-12-27 15:03:32', '2025-12-27 15:03:33', 1),
(203, 13, 'digits-hoc-so', '2025-12-27 15:03:32', '2025-12-27 15:03:33', 1),
(204, 13, 'digits-ghep-so', '2025-12-27 15:03:33', '2025-12-27 15:03:37', 4),
(205, 13, 'digits-ghep-so', '2025-12-27 15:03:33', '2025-12-27 15:03:37', 4),
(206, 13, 'compare-xep-so', '2025-12-27 15:03:37', '2025-12-27 15:04:18', 41),
(207, 13, 'compare-xep-so', '2025-12-27 15:03:37', '2025-12-27 15:04:18', 41),
(208, 13, 'users', '2025-12-27 15:04:18', '2025-12-27 15:07:12', 174),
(209, 13, 'games-dino', '2025-12-27 15:07:12', '2025-12-27 15:07:47', 35),
(210, 13, 'games-dino', '2025-12-27 15:07:12', '2025-12-27 15:07:47', 35),
(211, 13, 'home', '2025-12-27 15:07:47', '2025-12-27 15:07:50', 3),
(212, 13, 'users', '2025-12-27 15:07:50', NULL, 0),
(213, 13, 'home', '2025-12-27 15:10:41', '2025-12-27 15:10:43', 2),
(214, 13, 'users', '2025-12-27 15:10:43', NULL, 0),
(215, 13, 'home', '2025-12-27 15:10:50', '2025-12-27 15:11:22', 32),
(216, 13, 'users', '2025-12-27 15:11:22', NULL, 0),
(217, 13, 'home', '2025-12-27 15:19:40', NULL, 0),
(218, 13, 'home', '2025-12-27 15:22:25', '2025-12-27 15:22:30', 5),
(219, 13, 'users', '2025-12-27 15:22:30', '2025-12-27 15:23:01', 31),
(220, 13, 'home', '2025-12-27 15:23:01', NULL, 0),
(221, 13, 'home', '2025-12-27 15:23:04', NULL, 0),
(222, 1, 'home', '2025-12-27 15:23:08', NULL, 0),
(223, 1, 'home', '2025-12-27 15:23:13', '2025-12-27 15:23:14', 1),
(224, 1, 'users', '2025-12-27 15:23:14', NULL, 0),
(225, 1, 'home', '2025-12-27 15:24:29', NULL, 0),
(226, 1, 'home', '2025-12-27 15:26:05', '2025-12-27 15:26:09', 4),
(227, 1, 'users', '2025-12-27 15:26:09', NULL, 0),
(228, 1, 'home', '2025-12-27 15:26:35', '2025-12-27 15:26:38', 3),
(229, 1, 'users', '2025-12-27 15:26:38', NULL, 0),
(230, 1, 'home', '2025-12-27 15:32:48', '2025-12-27 15:33:25', 37),
(231, 1, 'users', '2025-12-27 15:33:25', NULL, 0),
(232, 1, 'home', '2025-12-27 15:42:09', NULL, 0),
(233, 1, 'home', '2025-12-27 15:42:22', NULL, 0),
(234, 1, 'home', '2025-12-27 15:42:29', NULL, 0),
(235, 1, 'home', '2025-12-27 15:43:11', NULL, 0),
(236, 1, 'home', '2025-12-27 15:43:35', NULL, 0),
(237, 1, 'home', '2025-12-27 15:43:53', '2025-12-27 15:46:00', 127),
(238, 1, 'users', '2025-12-27 15:46:00', NULL, 0),
(239, 1, 'home', '2025-12-27 15:52:01', '2025-12-27 15:52:04', 3),
(240, 1, 'users', '2025-12-27 15:52:04', '2025-12-27 15:52:15', 11),
(241, 1, 'home', '2025-12-27 15:52:15', NULL, 0),
(242, 1, 'home', '2025-12-27 15:52:18', NULL, 0),
(243, 1, 'home', '2025-12-27 15:52:21', NULL, 0),
(244, 1, 'home', '2025-12-27 15:52:30', '2025-12-27 15:52:32', 2),
(245, 1, 'users', '2025-12-27 15:52:32', NULL, 0),
(246, 1, 'home', '2025-12-28 13:08:36', '2025-12-28 13:08:38', 2),
(247, 1, 'users', '2025-12-28 13:08:38', '2025-12-28 13:08:49', 11),
(248, 1, 'home', '2025-12-28 13:08:49', NULL, 0),
(249, 1, 'home', '2025-12-28 13:08:54', NULL, 0),
(250, 14, 'home', '2025-12-28 13:13:26', '2025-12-28 13:13:35', 9),
(251, 14, 'digits-hoc-so', '2025-12-28 13:13:35', '2025-12-28 13:13:44', 9),
(252, 14, 'digits-hoc-so', '2025-12-28 13:13:35', '2025-12-28 13:13:44', 9),
(253, 14, 'digits-ghep-so', '2025-12-28 13:13:44', '2025-12-28 13:13:47', 3),
(254, 14, 'digits-ghep-so', '2025-12-28 13:13:44', '2025-12-28 13:13:47', 3),
(255, 14, 'digits-chan-le', '2025-12-28 13:13:47', '2025-12-28 13:13:48', 1),
(256, 14, 'digits-chan-le', '2025-12-28 13:13:47', '2025-12-28 13:13:48', 1),
(257, 14, 'digits-dem-so', '2025-12-28 13:13:48', '2025-12-28 13:13:51', 3),
(258, 14, 'digits-dem-so', '2025-12-28 13:13:48', '2025-12-28 13:13:51', 3),
(259, 14, 'compare-so-sanh', '2025-12-28 13:13:51', '2025-12-28 13:13:54', 3),
(260, 14, 'compare-so-sanh', '2025-12-28 13:13:51', '2025-12-28 13:13:54', 3),
(261, 14, 'compare-xep-so', '2025-12-28 13:13:54', '2025-12-28 13:13:56', 2),
(262, 14, 'compare-xep-so', '2025-12-28 13:13:54', '2025-12-28 13:13:56', 2),
(263, 14, 'practice-tinh-toan', '2025-12-28 13:13:56', '2025-12-28 13:13:57', 1),
(264, 14, 'practice-tinh-toan', '2025-12-28 13:13:56', '2025-12-28 13:13:57', 1),
(265, 14, 'practice-nhan-ngon', '2025-12-28 13:13:57', '2025-12-28 13:14:01', 4),
(266, 14, 'practice-nhan-ngon', '2025-12-28 13:13:57', '2025-12-28 13:14:01', 4),
(267, 14, 'games', '2025-12-28 13:14:01', '2025-12-28 13:14:07', 6),
(268, 14, 'games', '2025-12-28 13:14:01', '2025-12-28 13:14:07', 6),
(269, 14, 'games-dino', '2025-12-28 13:14:07', '2025-12-28 13:14:09', 2),
(270, 14, 'games-dino', '2025-12-28 13:14:07', '2025-12-28 13:14:09', 2),
(271, 14, 'users', '2025-12-28 13:14:09', NULL, 0),
(272, 14, 'home', '2025-12-28 13:35:04', NULL, 0),
(273, 14, 'home', '2025-12-28 13:42:47', NULL, 0),
(274, 14, 'home', '2025-12-28 13:42:51', NULL, 0),
(275, 14, 'home', '2025-12-28 13:43:23', NULL, 0),
(276, 14, 'home', '2025-12-28 13:43:29', NULL, 0),
(277, 14, 'home', '2025-12-28 13:43:32', NULL, 0),
(278, 14, 'home', '2025-12-28 13:43:35', NULL, 0),
(279, 14, 'home', '2025-12-28 13:43:38', NULL, 0),
(280, 14, 'home', '2025-12-28 13:43:42', NULL, 0),
(281, 14, 'home', '2025-12-28 13:43:46', NULL, 0),
(282, 14, 'home', '2025-12-28 13:43:49', NULL, 0),
(283, 14, 'home', '2025-12-28 13:43:56', NULL, 0),
(284, 14, 'home', '2025-12-28 13:43:59', NULL, 0),
(285, 14, 'home', '2025-12-28 13:44:02', NULL, 0),
(286, 14, 'home', '2025-12-28 13:44:05', NULL, 0),
(287, 14, 'home', '2025-12-28 13:44:14', NULL, 0),
(288, 14, 'home', '2025-12-28 13:44:21', NULL, 0),
(289, 14, 'home', '2025-12-28 13:44:30', '2025-12-28 13:44:35', 5),
(290, 14, 'digits-hoc-so', '2025-12-28 13:44:35', '2025-12-28 13:44:35', 0),
(291, 14, 'digits-hoc-so', '2025-12-28 13:44:35', '2025-12-28 13:44:35', 0),
(292, 14, 'digits-ghep-so', '2025-12-28 13:44:35', '2025-12-28 13:44:40', 5),
(293, 14, 'digits-ghep-so', '2025-12-28 13:44:35', '2025-12-28 13:44:40', 5),
(294, 14, 'digits-chan-le', '2025-12-28 13:44:40', NULL, 0),
(295, 14, 'digits-chan-le', '2025-12-28 13:44:40', NULL, 0),
(296, 14, 'home', '2025-12-28 13:44:44', '2025-12-28 13:44:48', 4),
(297, 14, 'digits-dem-so', '2025-12-28 13:44:48', '2025-12-28 13:44:51', 3),
(298, 14, 'digits-dem-so', '2025-12-28 13:44:48', '2025-12-28 13:44:51', 3),
(299, 14, 'compare-so-sanh', '2025-12-28 13:44:51', '2025-12-28 13:46:13', 82),
(300, 14, 'compare-so-sanh', '2025-12-28 13:44:51', '2025-12-28 13:46:13', 82),
(301, 14, 'compare-xep-so', '2025-12-28 13:46:13', '2025-12-28 13:46:45', 32),
(302, 14, 'compare-xep-so', '2025-12-28 13:46:13', '2025-12-28 13:46:45', 32),
(303, 14, 'practice-tinh-toan', '2025-12-28 13:46:45', '2025-12-28 13:46:47', 2),
(304, 14, 'practice-tinh-toan', '2025-12-28 13:46:45', '2025-12-28 13:46:47', 2),
(305, 14, 'practice-nhan-ngon', '2025-12-28 13:46:47', '2025-12-28 13:47:09', 22),
(306, 14, 'practice-nhan-ngon', '2025-12-28 13:46:47', '2025-12-28 13:47:09', 22),
(307, 14, 'games', '2025-12-28 13:47:09', '2025-12-28 13:47:11', 2),
(308, 14, 'games', '2025-12-28 13:47:09', '2025-12-28 13:47:11', 2),
(309, 14, 'games-dino', '2025-12-28 13:47:11', '2025-12-28 13:48:50', 99),
(310, 14, 'games-dino', '2025-12-28 13:47:11', '2025-12-28 13:48:50', 99),
(311, 14, 'users', '2025-12-28 13:48:50', '2025-12-28 13:49:03', 13),
(312, 14, 'practice-nhan-ngon', '2025-12-28 13:49:03', '2025-12-28 13:49:05', 2),
(313, 14, 'practice-nhan-ngon', '2025-12-28 13:49:03', '2025-12-28 13:49:05', 2),
(314, 14, 'games', '2025-12-28 13:49:05', NULL, 0),
(315, 14, 'games', '2025-12-28 13:49:05', NULL, 0),
(316, 14, 'home', '2025-12-28 13:49:22', NULL, 0),
(317, 14, 'home', '2025-12-28 13:49:39', '2025-12-28 13:49:46', 7),
(318, 14, 'practice-nhan-ngon', '2025-12-28 13:49:46', NULL, 0),
(319, 14, 'practice-nhan-ngon', '2025-12-28 13:49:46', NULL, 0),
(320, 14, 'home', '2025-12-28 13:49:48', '2025-12-28 13:49:51', 3),
(321, 14, 'games-dino', '2025-12-28 13:49:51', '2025-12-28 13:49:52', 1),
(322, 14, 'games-dino', '2025-12-28 13:49:51', '2025-12-28 13:49:52', 1),
(323, 14, 'practice-nhan-ngon', '2025-12-28 13:49:52', NULL, 0),
(324, 14, 'practice-nhan-ngon', '2025-12-28 13:49:52', NULL, 0),
(325, 14, 'home', '2025-12-28 13:50:02', '2025-12-28 13:50:57', 55),
(326, 14, 'games-dino', '2025-12-28 13:50:57', '2025-12-28 13:50:58', 1),
(327, 14, 'games-dino', '2025-12-28 13:50:57', '2025-12-28 13:50:58', 1),
(328, 14, 'games', '2025-12-28 13:50:58', '2025-12-28 13:51:00', 2),
(329, 14, 'games', '2025-12-28 13:50:58', '2025-12-28 13:51:00', 2),
(330, 14, 'practice-nhan-ngon', '2025-12-28 13:51:00', '2025-12-28 13:52:26', 86),
(331, 14, 'practice-nhan-ngon', '2025-12-28 13:51:00', '2025-12-28 13:52:26', 86),
(332, 14, 'digits-hoc-so', '2025-12-28 13:52:26', '2025-12-28 13:52:29', 3),
(333, 14, 'digits-hoc-so', '2025-12-28 13:52:27', '2025-12-28 13:52:29', 2),
(334, 14, 'digits-ghep-so', '2025-12-28 13:52:29', '2025-12-28 13:52:30', 1),
(335, 14, 'digits-ghep-so', '2025-12-28 13:52:29', '2025-12-28 13:52:30', 1),
(336, 14, 'digits-chan-le', '2025-12-28 13:52:30', '2025-12-28 13:52:38', 8),
(337, 14, 'digits-chan-le', '2025-12-28 13:52:30', '2025-12-28 13:52:38', 8),
(338, 14, 'digits-dem-so', '2025-12-28 13:52:38', '2025-12-28 13:52:43', 5),
(339, 14, 'digits-dem-so', '2025-12-28 13:52:38', '2025-12-28 13:52:43', 5),
(340, 14, 'compare-so-sanh', '2025-12-28 13:52:43', NULL, 0),
(341, 14, 'compare-so-sanh', '2025-12-28 13:52:43', NULL, 0),
(342, 14, 'home', '2025-12-28 13:53:08', NULL, 0),
(343, 14, 'home', '2025-12-28 13:53:12', '2025-12-28 13:54:11', 59),
(344, 14, 'practice-nhan-ngon', '2025-12-28 13:54:11', '2025-12-28 13:55:33', 82),
(345, 14, 'practice-nhan-ngon', '2025-12-28 13:54:11', '2025-12-28 13:55:33', 82),
(346, 14, 'users', '2025-12-28 13:55:33', NULL, 0),
(347, 14, 'home', '2025-12-28 13:55:46', NULL, 0),
(348, 14, 'home', '2025-12-28 13:56:21', '2025-12-28 13:56:43', 22),
(349, 14, 'games-dino', '2025-12-28 13:56:43', '2025-12-28 13:56:45', 2),
(350, 14, 'games-dino', '2025-12-28 13:56:43', '2025-12-28 13:56:45', 2),
(351, 14, 'practice-nhan-ngon', '2025-12-28 13:56:45', '2025-12-28 13:57:12', 27),
(352, 14, 'practice-nhan-ngon', '2025-12-28 13:56:45', '2025-12-28 13:57:12', 27),
(353, 14, 'digits-ghep-so', '2025-12-28 13:57:12', '2025-12-28 13:57:13', 1),
(354, 14, 'digits-ghep-so', '2025-12-28 13:57:12', '2025-12-28 13:57:13', 1),
(355, 14, 'digits-chan-le', '2025-12-28 13:57:13', '2025-12-28 13:57:50', 37),
(356, 14, 'digits-chan-le', '2025-12-28 13:57:14', '2025-12-28 13:57:50', 36),
(357, 14, 'home', '2025-12-28 13:57:50', '2025-12-28 13:58:47', 57),
(358, 14, 'digits-chan-le', '2025-12-28 13:58:47', '2025-12-28 13:59:11', 24),
(359, 14, 'digits-chan-le', '2025-12-28 13:58:47', '2025-12-28 13:59:11', 24),
(360, 14, 'digits-hoc-so', '2025-12-28 13:59:11', '2025-12-28 13:59:12', 1),
(361, 14, 'digits-hoc-so', '2025-12-28 13:59:11', '2025-12-28 13:59:12', 1),
(362, 14, 'digits-ghep-so', '2025-12-28 13:59:12', '2025-12-28 13:59:16', 4),
(363, 14, 'digits-ghep-so', '2025-12-28 13:59:12', '2025-12-28 13:59:16', 4),
(364, 14, 'digits-chan-le', '2025-12-28 13:59:16', '2025-12-28 13:59:17', 1),
(365, 14, 'digits-chan-le', '2025-12-28 13:59:16', '2025-12-28 13:59:17', 1),
(366, 14, 'digits-dem-so', '2025-12-28 13:59:17', '2025-12-28 13:59:20', 3),
(367, 14, 'digits-dem-so', '2025-12-28 13:59:17', '2025-12-28 13:59:20', 3),
(368, 14, 'compare-so-sanh', '2025-12-28 13:59:20', '2025-12-28 13:59:21', 1),
(369, 14, 'compare-so-sanh', '2025-12-28 13:59:20', '2025-12-28 13:59:21', 1),
(370, 14, 'compare-xep-so', '2025-12-28 13:59:21', '2025-12-28 13:59:23', 2),
(371, 14, 'compare-xep-so', '2025-12-28 13:59:21', '2025-12-28 13:59:23', 2),
(372, 14, 'practice-tinh-toan', '2025-12-28 13:59:23', '2025-12-28 13:59:27', 4),
(373, 14, 'practice-tinh-toan', '2025-12-28 13:59:23', '2025-12-28 13:59:27', 4),
(374, 14, 'compare-xep-so', '2025-12-28 13:59:27', '2025-12-28 13:59:31', 4),
(375, 14, 'compare-xep-so', '2025-12-28 13:59:27', '2025-12-28 13:59:31', 4),
(376, 14, 'practice-tinh-toan', '2025-12-28 13:59:31', '2025-12-28 13:59:32', 1),
(377, 14, 'practice-tinh-toan', '2025-12-28 13:59:31', '2025-12-28 13:59:32', 1),
(378, 14, 'practice-nhan-ngon', '2025-12-28 13:59:32', '2025-12-28 13:59:34', 2),
(379, 14, 'practice-nhan-ngon', '2025-12-28 13:59:32', '2025-12-28 13:59:34', 2),
(380, 14, 'games', '2025-12-28 13:59:34', '2025-12-28 13:59:37', 3),
(381, 14, 'games', '2025-12-28 13:59:34', '2025-12-28 13:59:37', 3),
(382, 14, 'games-dino', '2025-12-28 13:59:37', '2025-12-28 13:59:37', 0),
(383, 14, 'games-dino', '2025-12-28 13:59:37', '2025-12-28 13:59:37', 0),
(384, 14, 'games-dino', '2025-12-28 13:59:37', '2025-12-28 13:59:37', 0),
(385, 14, 'games-dino', '2025-12-28 13:59:37', '2025-12-28 13:59:41', 4),
(386, 14, 'games-dino', '2025-12-28 13:59:37', '2025-12-28 13:59:41', 4),
(387, 14, 'games-dino', '2025-12-28 13:59:37', NULL, 0),
(388, 14, 'compare-so-sanh', '2025-12-28 13:59:41', '2025-12-28 13:59:42', 1),
(389, 14, 'compare-so-sanh', '2025-12-28 13:59:41', '2025-12-28 13:59:42', 1),
(390, 14, 'compare-xep-so', '2025-12-28 13:59:42', '2025-12-28 13:59:45', 3),
(391, 14, 'compare-xep-so', '2025-12-28 13:59:42', '2025-12-28 13:59:45', 3),
(392, 14, 'digits-hoc-so', '2025-12-28 13:59:45', '2025-12-28 13:59:48', 3),
(393, 14, 'digits-hoc-so', '2025-12-28 13:59:45', '2025-12-28 13:59:48', 3),
(394, 14, 'digits-ghep-so', '2025-12-28 13:59:48', '2025-12-28 13:59:49', 1),
(395, 14, 'digits-ghep-so', '2025-12-28 13:59:48', '2025-12-28 13:59:49', 1),
(396, 14, 'digits-hoc-so', '2025-12-28 13:59:49', NULL, 0),
(397, 14, 'digits-hoc-so', '2025-12-28 13:59:49', NULL, 0),
(398, 14, 'home', '2025-12-28 13:59:52', '2025-12-28 13:59:55', 3),
(399, 14, 'compare-so-sanh', '2025-12-28 13:59:55', '2025-12-28 13:59:56', 1),
(400, 14, 'compare-so-sanh', '2025-12-28 13:59:55', '2025-12-28 13:59:56', 1),
(401, 14, 'compare-xep-so', '2025-12-28 13:59:56', '2025-12-28 13:59:59', 3),
(402, 14, 'compare-xep-so', '2025-12-28 13:59:56', '2025-12-28 13:59:59', 3),
(403, 14, 'digits-chan-le', '2025-12-28 13:59:59', NULL, 0),
(404, 14, 'digits-chan-le', '2025-12-28 13:59:59', NULL, 0),
(405, 14, 'home', '2025-12-28 14:00:27', '2025-12-28 14:00:34', 7),
(406, 14, 'digits-chan-le', '2025-12-28 14:00:34', NULL, 0),
(407, 14, 'digits-chan-le', '2025-12-28 14:00:34', NULL, 0),
(408, 14, 'home', '2025-12-28 14:01:27', NULL, 0),
(409, 14, 'home', '2025-12-28 14:01:45', '2025-12-28 14:02:02', 17),
(410, 14, 'digits-hoc-so', '2025-12-28 14:02:02', '2025-12-28 14:02:03', 1),
(411, 14, 'digits-hoc-so', '2025-12-28 14:02:02', '2025-12-28 14:02:03', 1),
(412, 14, 'digits-ghep-so', '2025-12-28 14:02:03', '2025-12-28 14:02:04', 1),
(413, 14, 'digits-ghep-so', '2025-12-28 14:02:03', '2025-12-28 14:02:04', 1),
(414, 14, 'digits-chan-le', '2025-12-28 14:02:04', '2025-12-28 14:02:07', 3),
(415, 14, 'digits-chan-le', '2025-12-28 14:02:04', '2025-12-28 14:02:07', 3),
(416, 14, 'digits-dem-so', '2025-12-28 14:02:07', '2025-12-28 14:02:08', 1),
(417, 14, 'digits-dem-so', '2025-12-28 14:02:07', '2025-12-28 14:02:08', 1),
(418, 14, 'digits-chan-le', '2025-12-28 14:02:08', '2025-12-28 14:02:12', 4),
(419, 14, 'digits-chan-le', '2025-12-28 14:02:08', '2025-12-28 14:02:12', 4),
(420, 14, 'digits-dem-so', '2025-12-28 14:02:12', '2025-12-28 14:02:14', 2),
(421, 14, 'digits-dem-so', '2025-12-28 14:02:12', '2025-12-28 14:02:14', 2),
(422, 14, 'compare-so-sanh', '2025-12-28 14:02:14', '2025-12-28 14:02:15', 1),
(423, 14, 'compare-so-sanh', '2025-12-28 14:02:14', '2025-12-28 14:02:15', 1),
(424, 14, 'compare-xep-so', '2025-12-28 14:02:15', '2025-12-28 14:02:17', 2),
(425, 14, 'compare-xep-so', '2025-12-28 14:02:15', '2025-12-28 14:02:17', 2),
(426, 14, 'practice-tinh-toan', '2025-12-28 14:02:17', '2025-12-28 14:02:18', 1),
(427, 14, 'practice-tinh-toan', '2025-12-28 14:02:17', '2025-12-28 14:02:18', 1),
(428, 14, 'practice-nhan-ngon', '2025-12-28 14:02:18', '2025-12-28 14:02:19', 1),
(429, 14, 'practice-nhan-ngon', '2025-12-28 14:02:18', '2025-12-28 14:02:19', 1),
(430, 14, 'practice-tinh-toan', '2025-12-28 14:02:19', '2025-12-28 14:02:23', 4),
(431, 14, 'practice-tinh-toan', '2025-12-28 14:02:19', '2025-12-28 14:02:23', 4),
(432, 14, 'games-dino', '2025-12-28 14:02:23', '2025-12-28 14:02:24', 1),
(433, 14, 'games-dino', '2025-12-28 14:02:23', '2025-12-28 14:02:24', 1),
(434, 14, 'games', '2025-12-28 14:02:24', '2025-12-28 14:02:26', 2),
(435, 14, 'games', '2025-12-28 14:02:24', '2025-12-28 14:02:26', 2),
(436, 14, 'games-dino', '2025-12-28 14:02:26', '2025-12-28 14:02:28', 2),
(437, 14, 'games-dino', '2025-12-28 14:02:26', '2025-12-28 14:02:28', 2),
(438, 14, 'users', '2025-12-28 14:02:28', NULL, 0),
(439, 14, 'home', '2025-12-28 14:02:31', '2025-12-28 14:02:35', 4),
(440, 14, 'users', '2025-12-28 14:02:35', NULL, 0),
(441, 14, 'home', '2025-12-28 14:03:47', NULL, 0),
(442, 14, 'home', '2025-12-28 14:04:00', NULL, 0),
(443, 14, 'home', '2025-12-28 14:04:07', NULL, 0),
(444, 1, 'home', '2025-12-28 14:04:16', '2025-12-28 14:04:17', 1),
(445, 1, 'users', '2025-12-28 14:04:17', NULL, 0),
(446, 1, 'home', '2025-12-28 14:04:22', '2025-12-28 14:04:24', 2),
(447, 1, 'users', '2025-12-28 14:04:24', '2025-12-28 14:04:41', 17),
(448, 1, 'home', '2025-12-28 14:04:41', NULL, 0),
(449, 1, 'home', '2025-12-28 14:04:44', NULL, 0),
(450, 14, 'home', '2025-12-28 14:04:52', '2025-12-28 14:04:53', 1),
(451, 14, 'users', '2025-12-28 14:04:53', NULL, 0),
(452, 14, 'home', '2025-12-28 14:07:46', NULL, 0),
(453, 14, 'home', '2025-12-28 14:07:56', NULL, 0),
(454, 14, 'home', '2025-12-28 14:08:10', '2025-12-28 14:08:17', 7),
(455, 14, 'users', '2025-12-28 14:08:17', '2025-12-28 14:08:33', 16),
(456, 14, 'games', '2025-12-28 14:08:33', '2025-12-28 14:09:17', 44),
(457, 14, 'games', '2025-12-28 14:08:33', '2025-12-28 14:09:17', 44),
(458, 14, 'home', '2025-12-28 14:09:17', '2025-12-28 14:09:27', 10),
(459, 14, 'users', '2025-12-28 14:09:27', '2025-12-28 14:09:33', 6),
(460, 14, 'home', '2025-12-28 14:09:33', NULL, 0),
(461, 14, 'home', '2025-12-28 14:09:37', NULL, 0),
(462, 1, 'home', '2025-12-28 14:09:45', '2025-12-28 14:09:45', 0),
(463, 1, 'users', '2025-12-28 14:09:45', '2025-12-28 14:09:55', 10),
(464, 1, 'games-dino', '2025-12-28 14:09:55', '2025-12-28 14:11:12', 77),
(465, 1, 'games-dino', '2025-12-28 14:09:55', '2025-12-28 14:11:12', 77),
(466, 1, 'home', '2025-12-28 14:11:12', '2025-12-28 14:11:15', 3),
(467, 1, 'users', '2025-12-28 14:11:15', NULL, 0),
(468, 1, 'home', '2025-12-28 14:14:14', NULL, 0),
(469, 1, 'home', '2025-12-28 14:14:25', '2025-12-28 14:14:42', 17),
(470, 1, 'users', '2025-12-28 14:14:42', '2025-12-28 14:15:12', 30),
(471, 1, 'home', '2025-12-28 14:15:12', NULL, 0),
(472, 1, 'home', '2025-12-28 14:15:15', NULL, 0),
(473, 1, 'home', '2025-12-28 14:15:52', '2025-12-28 14:15:53', 1),
(474, 1, 'users', '2025-12-28 14:15:53', '2025-12-28 14:16:24', 31),
(475, 1, 'home', '2025-12-28 14:16:24', NULL, 0),
(476, 1, 'home', '2025-12-28 14:16:28', NULL, 0),
(477, 14, 'home', '2025-12-28 14:16:37', '2025-12-28 14:16:37', 0),
(478, 14, 'users', '2025-12-28 14:16:37', NULL, 0),
(479, 14, 'home', '2025-12-28 14:20:03', NULL, 0),
(480, 14, 'home', '2025-12-28 14:20:07', NULL, 0),
(481, 14, 'home', '2025-12-28 14:20:19', '2025-12-28 14:21:24', 65),
(482, 14, 'users', '2025-12-28 14:21:24', NULL, 0),
(483, 14, 'home', '2025-12-28 14:22:04', '2025-12-28 14:22:22', 18),
(484, 14, 'users', '2025-12-28 14:22:22', '2025-12-28 14:24:32', 130),
(485, 14, 'users', '2025-12-28 14:24:04', '2025-12-28 14:24:04', 0),
(486, 14, 'compare-so-sanh', '2025-12-28 14:24:32', '2025-12-28 14:25:13', 41),
(487, 14, 'compare-so-sanh', '2025-12-28 14:24:32', '2025-12-28 14:25:13', 41),
(488, 14, 'users', '2025-12-28 14:25:13', '2025-12-28 14:25:39', 26),
(489, 14, 'home', '2025-12-28 14:25:39', NULL, 0),
(490, 14, 'home', '2025-12-28 14:25:42', NULL, 0),
(491, 1, 'home', '2025-12-28 14:25:51', '2025-12-28 14:25:53', 2),
(492, 1, 'users', '2025-12-28 14:25:53', NULL, 0),
(493, 1, 'home', '2025-12-28 14:27:09', NULL, 0),
(494, 1, 'home', '2025-12-28 14:27:15', NULL, 0),
(495, 1, 'home', '2025-12-28 14:27:30', '2025-12-28 14:27:57', 27),
(496, 1, 'users', '2025-12-28 14:27:57', '2025-12-28 14:28:17', 20),
(497, 1, 'home', '2025-12-28 14:28:17', NULL, 0),
(498, 1, 'home', '2025-12-28 14:28:20', NULL, 0),
(499, 15, 'home', '2025-12-28 14:29:07', '2025-12-28 14:29:14', 7),
(500, 15, 'digits-hoc-so', '2025-12-28 14:29:14', '2025-12-28 14:29:24', 10),
(501, 15, 'digits-hoc-so', '2025-12-28 14:29:14', '2025-12-28 14:29:24', 10),
(502, 15, 'digits-ghep-so', '2025-12-28 14:29:24', '2025-12-28 14:29:41', 17),
(503, 15, 'digits-ghep-so', '2025-12-28 14:29:24', '2025-12-28 14:29:41', 17),
(504, 15, 'digits-chan-le', '2025-12-28 14:29:41', '2025-12-28 14:30:15', 34),
(505, 15, 'digits-chan-le', '2025-12-28 14:29:41', '2025-12-28 14:30:15', 34),
(506, 15, 'users', '2025-12-28 14:30:15', NULL, 0),
(507, 15, 'home', '2025-12-28 14:33:47', NULL, 0),
(508, 15, 'home', '2025-12-28 14:34:04', '2025-12-28 14:37:29', 205),
(509, 15, 'games-dino', '2025-12-28 14:37:29', '2025-12-28 14:37:30', 1),
(510, 15, 'games-dino', '2025-12-28 14:37:29', '2025-12-28 14:37:30', 1),
(511, 15, 'games', '2025-12-28 14:37:30', '2025-12-28 14:37:36', 6),
(512, 15, 'games', '2025-12-28 14:37:30', '2025-12-28 14:37:36', 6),
(513, 15, 'practice-tinh-toan', '2025-12-28 14:37:36', '2025-12-28 14:37:37', 1),
(514, 15, 'practice-tinh-toan', '2025-12-28 14:37:36', '2025-12-28 14:37:37', 1),
(515, 15, 'practice-nhan-ngon', '2025-12-28 14:37:37', NULL, 0),
(516, 15, 'practice-nhan-ngon', '2025-12-28 14:37:37', NULL, 0),
(517, 15, 'home', '2025-12-28 14:39:23', NULL, 0),
(518, 15, 'home', '2025-12-28 14:39:28', '2025-12-28 14:39:41', 13),
(519, 15, 'games', '2025-12-28 14:39:41', '2025-12-28 14:40:13', 32),
(520, 15, 'games', '2025-12-28 14:39:41', '2025-12-28 14:40:13', 32),
(521, 15, 'practice-nhan-ngon', '2025-12-28 14:40:13', '2025-12-28 14:40:55', 42),
(522, 15, 'practice-nhan-ngon', '2025-12-28 14:40:13', '2025-12-28 14:40:55', 42),
(523, 15, 'practice-tinh-toan', '2025-12-28 14:40:55', '2025-12-28 14:41:01', 6),
(524, 15, 'practice-tinh-toan', '2025-12-28 14:40:55', '2025-12-28 14:41:01', 6),
(525, 15, 'compare-so-sanh', '2025-12-28 14:41:01', NULL, 0),
(526, 15, 'compare-so-sanh', '2025-12-28 14:41:01', NULL, 0),
(527, 15, 'home', '2025-12-28 14:41:17', NULL, 0),
(528, 15, 'home', '2025-12-28 14:41:28', '2025-12-28 14:42:55', 87),
(529, 15, 'practice-tinh-toan', '2025-12-28 14:42:55', '2025-12-28 14:43:25', 30),
(530, 15, 'practice-tinh-toan', '2025-12-28 14:42:55', '2025-12-28 14:43:25', 30),
(531, 15, 'practice-nhan-ngon', '2025-12-28 14:43:25', '2025-12-28 14:44:01', 36),
(532, 15, 'practice-nhan-ngon', '2025-12-28 14:43:25', '2025-12-28 14:44:01', 36),
(533, 15, 'users', '2025-12-28 14:44:01', '2025-12-28 14:45:57', 116),
(534, 15, 'games', '2025-12-28 14:45:57', '2025-12-28 14:46:06', 9),
(535, 15, 'games', '2025-12-28 14:45:57', '2025-12-28 14:46:06', 9),
(536, 15, 'games-dino', '2025-12-28 14:46:06', '2025-12-28 14:46:09', 3),
(537, 15, 'games-dino', '2025-12-28 14:46:06', '2025-12-28 14:46:09', 3),
(538, 15, 'digits-hoc-so', '2025-12-28 14:46:09', '2025-12-28 14:46:14', 5),
(539, 15, 'digits-hoc-so', '2025-12-28 14:46:09', '2025-12-28 14:46:14', 5),
(540, 15, 'digits-ghep-so', '2025-12-28 14:46:14', '2025-12-28 14:46:16', 2),
(541, 15, 'digits-ghep-so', '2025-12-28 14:46:14', '2025-12-28 14:46:16', 2),
(542, 15, 'digits-chan-le', '2025-12-28 14:46:16', '2025-12-28 14:46:25', 9),
(543, 15, 'digits-chan-le', '2025-12-28 14:46:16', '2025-12-28 14:46:25', 9),
(544, 15, 'digits-hoc-so', '2025-12-28 14:46:25', '2025-12-28 14:46:34', 9),
(545, 15, 'digits-hoc-so', '2025-12-28 14:46:25', '2025-12-28 14:46:34', 9),
(546, 15, 'digits-ghep-so', '2025-12-28 14:46:34', '2025-12-28 14:46:43', 9),
(547, 15, 'digits-ghep-so', '2025-12-28 14:46:34', '2025-12-28 14:46:43', 9),
(548, 15, 'digits-chan-le', '2025-12-28 14:46:43', '2025-12-28 14:46:45', 2),
(549, 15, 'digits-chan-le', '2025-12-28 14:46:43', '2025-12-28 14:46:45', 2),
(550, 15, 'digits-dem-so', '2025-12-28 14:46:45', '2025-12-28 14:46:56', 11),
(551, 15, 'digits-dem-so', '2025-12-28 14:46:45', '2025-12-28 14:46:56', 11),
(552, 15, 'compare-so-sanh', '2025-12-28 14:46:56', '2025-12-28 14:47:11', 15),
(553, 15, 'compare-so-sanh', '2025-12-28 14:46:56', '2025-12-28 14:47:11', 15),
(554, 15, 'users', '2025-12-28 14:47:11', NULL, 0),
(555, 15, 'home', '2025-12-28 14:47:47', '2025-12-28 14:49:58', 131),
(556, 15, 'users', '2025-12-28 14:49:58', '2025-12-28 14:50:13', 15),
(557, 15, 'games', '2025-12-28 14:50:13', NULL, 0),
(558, 15, 'games', '2025-12-28 14:50:13', NULL, 0),
(559, 15, 'home', '2025-12-28 14:51:57', NULL, 0),
(560, 15, 'home', '2025-12-28 14:52:14', '2025-12-28 14:52:27', 13),
(561, 15, 'games', '2025-12-28 14:52:27', NULL, 0),
(562, 15, 'games', '2025-12-28 14:52:27', NULL, 0),
(563, 15, 'home', '2025-12-28 14:53:22', NULL, 0),
(564, 15, 'home', '2025-12-28 14:53:31', '2025-12-28 14:53:36', 5),
(565, 15, 'games', '2025-12-28 14:53:36', '2025-12-28 14:56:31', 175),
(566, 15, 'games', '2025-12-28 14:53:36', '2025-12-28 14:56:31', 175),
(567, 15, 'users', '2025-12-28 14:56:31', '2025-12-28 14:59:01', 150),
(568, 15, 'home', '2025-12-28 14:59:01', NULL, 0),
(569, 15, 'home', '2025-12-28 14:59:36', NULL, 0),
(570, 15, 'home', '2025-12-28 15:00:19', NULL, 0),
(571, 15, 'home', '2025-12-28 15:00:26', '2025-12-28 15:00:40', 14),
(572, 15, 'users', '2025-12-28 15:00:40', NULL, 0),
(573, 15, 'home', '2025-12-28 15:00:43', '2025-12-28 15:01:39', 56),
(574, 15, 'users', '2025-12-28 15:01:39', '2025-12-28 15:01:48', 9),
(575, 15, 'games', '2025-12-28 15:01:48', '2025-12-28 15:02:35', 47),
(576, 15, 'games-hung-tao', '2025-12-28 15:01:48', '2025-12-28 15:02:35', 47),
(577, 15, 'home', '2025-12-28 15:02:35', '2025-12-28 15:02:37', 2),
(578, 15, 'users', '2025-12-28 15:02:37', NULL, 0),
(579, 15, 'home', '2025-12-28 15:04:21', NULL, 0),
(580, 15, 'home', '2025-12-28 15:04:30', NULL, 0),
(581, 15, 'home', '2025-12-28 15:07:22', NULL, 0),
(582, 15, 'home', '2025-12-28 15:07:45', NULL, 0),
(583, 15, 'home', '2025-12-28 15:07:54', NULL, 0),
(584, 15, 'home', '2025-12-28 15:08:14', NULL, 0),
(585, 15, 'home', '2025-12-28 15:08:26', NULL, 0),
(586, 15, 'home', '2025-12-28 15:09:19', NULL, 0),
(587, 15, 'home', '2025-12-28 15:10:18', NULL, 0),
(588, 15, 'home', '2025-12-28 15:10:33', '2025-12-28 15:10:40', 7),
(589, 15, 'users', '2025-12-28 15:10:40', NULL, 0),
(590, 15, 'home', '2025-12-28 15:11:19', NULL, 0),
(591, 15, 'home', '2025-12-28 15:11:25', NULL, 0),
(592, 15, 'home', '2025-12-28 15:11:35', NULL, 0),
(593, 15, 'home', '2025-12-28 15:11:41', NULL, 0),
(594, 15, 'home', '2025-12-28 15:11:48', NULL, 0),
(595, 15, 'home', '2025-12-28 15:12:00', NULL, 0),
(596, 15, 'home', '2025-12-28 15:13:48', NULL, 0),
(597, 15, 'home', '2025-12-28 15:14:02', NULL, 0),
(598, 15, 'home', '2025-12-28 15:15:14', NULL, 0),
(599, 15, 'home', '2025-12-28 15:17:02', NULL, 0),
(600, 15, 'home', '2025-12-28 15:17:22', NULL, 0),
(601, 15, 'home', '2025-12-28 15:17:34', NULL, 0),
(602, 15, 'home', '2025-12-28 15:18:05', NULL, 0),
(603, 15, 'home', '2025-12-28 15:18:31', NULL, 0),
(604, 15, 'home', '2025-12-28 15:18:46', '2025-12-28 17:11:12', 6746),
(605, 15, 'digits-hoc-so', '2025-12-28 17:11:12', '2025-12-28 17:11:14', 2),
(606, 15, 'digits-hoc-so', '2025-12-28 17:11:12', '2025-12-28 17:11:14', 2),
(607, 15, 'digits-ghep-so', '2025-12-28 17:11:14', '2025-12-28 17:11:15', 1),
(608, 15, 'digits-ghep-so', '2025-12-28 17:11:14', '2025-12-28 17:11:15', 1),
(609, 15, 'digits-chan-le', '2025-12-28 17:11:15', '2025-12-28 17:11:16', 1),
(610, 15, 'digits-chan-le', '2025-12-28 17:11:15', '2025-12-28 17:11:16', 1),
(611, 15, 'digits-dem-so', '2025-12-28 17:11:16', '2025-12-28 17:11:18', 2),
(612, 15, 'digits-dem-so', '2025-12-28 17:11:16', '2025-12-28 17:11:18', 2),
(613, 15, 'compare-so-sanh', '2025-12-28 17:11:18', '2025-12-28 17:11:19', 1),
(614, 15, 'compare-so-sanh', '2025-12-28 17:11:18', '2025-12-28 17:11:19', 1),
(615, 15, 'compare-xep-so', '2025-12-28 17:11:19', '2025-12-28 17:11:21', 2),
(616, 15, 'compare-xep-so', '2025-12-28 17:11:19', '2025-12-28 17:11:21', 2),
(617, 15, 'practice-tinh-toan', '2025-12-28 17:11:21', '2025-12-28 17:11:22', 1),
(618, 15, 'practice-tinh-toan', '2025-12-28 17:11:21', '2025-12-28 17:11:22', 1),
(619, 15, 'practice-nhan-ngon', '2025-12-28 17:11:22', '2025-12-28 17:11:23', 1),
(620, 15, 'practice-nhan-ngon', '2025-12-28 17:11:22', '2025-12-28 17:11:23', 1),
(621, 15, 'games', '2025-12-28 17:11:23', '2025-12-28 17:11:25', 2),
(622, 15, 'games-hung-tao', '2025-12-28 17:11:23', '2025-12-28 17:11:25', 2),
(623, 15, 'games-dino', '2025-12-28 17:11:25', '2025-12-28 17:11:29', 4),
(624, 15, 'games-dino', '2025-12-28 17:11:25', '2025-12-28 17:11:29', 4),
(625, 15, 'users', '2025-12-28 17:11:29', '2025-12-28 17:11:41', 12),
(626, 15, 'home', '2025-12-28 17:11:41', '2025-12-28 17:11:44', 3),
(627, 15, 'home', '2025-12-28 17:11:44', '2025-12-28 17:11:45', 1),
(628, 15, 'home', '2025-12-28 17:11:45', '2025-12-28 17:11:45', 0),
(629, 15, 'home', '2025-12-28 17:11:45', '2025-12-28 17:11:51', 6),
(630, 15, 'home', '2025-12-28 17:11:51', '2025-12-28 17:11:55', 4),
(631, 15, 'home', '2025-12-28 17:11:55', '2025-12-28 17:11:58', 3),
(632, 15, 'home', '2025-12-28 17:11:58', '2025-12-28 17:12:16', 18),
(633, 15, 'home', '2025-12-28 17:12:16', '2025-12-28 17:12:32', 16),
(634, 15, 'home', '2025-12-28 17:12:32', NULL, 0),
(635, 15, 'home', '2025-12-28 17:15:34', NULL, 0),
(636, 15, 'home', '2025-12-28 17:15:43', '2025-12-28 17:15:49', 6),
(637, 15, 'home', '2025-12-28 17:15:49', '2025-12-28 17:17:22', 93),
(638, 15, 'home', '2025-12-28 17:17:22', '2025-12-28 17:17:25', 3),
(639, 15, 'home', '2025-12-28 17:17:25', '2025-12-28 17:17:27', 2),
(640, 15, 'home', '2025-12-28 17:17:27', NULL, 0),
(641, 15, 'home', '2025-12-28 17:17:29', '2025-12-28 17:20:27', 178),
(642, 15, 'home', '2025-12-28 17:20:27', '2025-12-28 17:20:33', 6),
(643, 15, 'home', '2025-12-28 17:20:33', '2025-12-28 17:20:46', 13),
(644, 15, 'home', '2025-12-28 17:20:46', '2025-12-28 17:22:34', 108),
(645, 15, 'practice-tinh-toan', '2025-12-28 17:22:34', '2025-12-28 17:22:35', 1),
(646, 15, 'practice-tinh-toan', '2025-12-28 17:22:34', '2025-12-28 17:22:35', 1),
(647, 15, 'home', '2025-12-28 17:22:35', '2025-12-28 17:22:38', 3),
(648, 15, 'home', '2025-12-28 17:22:38', '2025-12-28 17:22:40', 2),
(649, 15, 'home', '2025-12-28 17:22:40', NULL, 0),
(650, 15, 'home', '2025-12-28 17:24:27', '2025-12-28 17:26:52', 145),
(651, 15, 'users', '2025-12-28 17:26:52', '2025-12-28 17:27:39', 47),
(652, 15, 'games', '2025-12-28 17:27:39', '2025-12-28 17:27:40', 1),
(653, 15, 'games-hung-tao', '2025-12-28 17:27:39', '2025-12-28 17:27:40', 1),
(654, 15, 'games-dino', '2025-12-28 17:27:40', '2025-12-28 17:27:42', 2),
(655, 15, 'games-dino', '2025-12-28 17:27:40', '2025-12-28 17:27:42', 2),
(656, 15, 'practice-tinh-toan', '2025-12-28 17:27:42', '2025-12-28 17:27:42', 0),
(657, 15, 'practice-tinh-toan', '2025-12-28 17:27:42', '2025-12-28 17:27:42', 0),
(658, 15, 'practice-nhan-ngon', '2025-12-28 17:27:42', '2025-12-28 17:27:50', 8),
(659, 15, 'practice-nhan-ngon', '2025-12-28 17:27:42', '2025-12-28 17:27:50', 8),
(660, 15, 'compare-so-sanh', '2025-12-28 17:27:50', '2025-12-28 17:27:51', 1),
(661, 15, 'compare-so-sanh', '2025-12-28 17:27:50', '2025-12-28 17:27:51', 1),
(662, 15, 'compare-xep-so', '2025-12-28 17:27:51', '2025-12-28 17:27:54', 3),
(663, 15, 'compare-xep-so', '2025-12-28 17:27:52', '2025-12-28 17:27:54', 2),
(664, 15, 'digits-hoc-so', '2025-12-28 17:27:54', '2025-12-28 17:27:55', 1),
(665, 15, 'digits-hoc-so', '2025-12-28 17:27:54', '2025-12-28 17:27:55', 1),
(666, 15, 'digits-ghep-so', '2025-12-28 17:27:55', '2025-12-28 17:27:56', 1),
(667, 15, 'digits-ghep-so', '2025-12-28 17:27:55', '2025-12-28 17:27:56', 1),
(668, 15, 'digits-chan-le', '2025-12-28 17:27:56', '2025-12-28 17:27:58', 2),
(669, 15, 'digits-chan-le', '2025-12-28 17:27:56', '2025-12-28 17:27:58', 2),
(670, 15, 'digits-dem-so', '2025-12-28 17:27:58', '2025-12-28 17:28:00', 2),
(671, 15, 'digits-dem-so', '2025-12-28 17:27:58', '2025-12-28 17:28:00', 2),
(672, 15, 'home', '2025-12-28 17:28:00', '2025-12-28 17:28:07', 7),
(673, 15, 'home', '2025-12-28 17:28:07', '2025-12-28 17:28:10', 3),
(674, 15, 'home', '2025-12-28 17:28:10', '2025-12-28 17:29:50', 100),
(675, 15, 'home', '2025-12-28 17:29:50', '2025-12-28 17:31:30', 100),
(676, 15, 'home', '2025-12-28 17:31:30', NULL, 0),
(677, 15, 'home', '2025-12-28 17:33:38', NULL, 0),
(678, 15, 'home', '2025-12-28 17:34:14', NULL, 0),
(679, 15, 'home', '2025-12-28 17:34:18', NULL, 0),
(680, 15, 'home', '2025-12-28 17:36:16', '2025-12-28 17:37:33', 77),
(681, 15, 'users', '2025-12-28 17:37:33', '2025-12-28 17:39:31', 118),
(682, 15, 'home', '2025-12-28 17:39:31', NULL, 0),
(683, 15, 'home', '2025-12-28 17:45:16', NULL, 0),
(684, 15, 'home', '2025-12-28 17:45:51', NULL, 0),
(685, 15, 'home', '2025-12-28 17:45:57', NULL, 0),
(686, 15, 'home', '2025-12-28 17:47:34', '2025-12-28 17:47:41', 7),
(687, 15, 'digits-hoc-so', '2025-12-28 17:47:41', '2025-12-28 17:47:42', 1),
(688, 15, 'digits-hoc-so', '2025-12-28 17:47:41', '2025-12-28 17:47:42', 1),
(689, 15, 'home', '2025-12-28 17:47:42', '2025-12-28 17:47:45', 3),
(690, 15, 'users', '2025-12-28 17:47:45', '2025-12-28 17:48:18', 33),
(691, 15, 'home', '2025-12-28 17:48:18', NULL, 0),
(692, 15, 'home', '2025-12-28 17:49:06', NULL, 0),
(693, 15, 'home', '2025-12-28 17:49:47', NULL, 0),
(694, 15, 'home', '2025-12-28 17:53:51', NULL, 0),
(695, 15, 'home', '2025-12-28 17:55:16', '2025-12-28 17:59:40', 264),
(696, 15, 'home', '2025-12-28 17:59:40', '2025-12-28 17:59:45', 5),
(697, 15, 'home', '2025-12-28 17:59:45', '2025-12-28 17:59:48', 3),
(698, 15, 'home', '2025-12-28 17:59:48', '2025-12-28 17:59:50', 2),
(699, 15, 'home', '2025-12-28 17:59:50', '2025-12-28 18:00:20', 30),
(700, 15, 'home', '2025-12-28 18:00:20', '2025-12-28 18:01:12', 52),
(701, 15, 'home', '2025-12-28 18:01:12', '2025-12-28 18:01:14', 2),
(702, 15, 'home', '2025-12-28 18:01:14', '2025-12-28 18:01:18', 4),
(703, 15, 'home', '2025-12-28 18:01:18', NULL, 0),
(704, 15, 'home', '2025-12-28 18:01:59', NULL, 0),
(705, 15, 'home', '2025-12-28 18:07:04', NULL, 0),
(706, 15, 'home', '2025-12-28 18:08:23', NULL, 0),
(707, 15, 'home', '2025-12-28 18:08:26', NULL, 0),
(708, 15, 'home', '2025-12-28 18:08:31', NULL, 0),
(709, 15, 'home', '2025-12-28 18:08:36', '2025-12-28 18:09:13', 37),
(710, 15, 'home', '2025-12-28 18:09:13', '2025-12-28 18:09:16', 3),
(711, 15, 'home', '2025-12-28 18:09:16', NULL, 0),
(712, 15, 'home', '2025-12-28 18:09:19', '2025-12-28 18:10:01', 42),
(713, 15, 'home', '2025-12-28 18:10:01', NULL, 0),
(714, 15, 'home', '2025-12-28 18:10:12', NULL, 0),
(715, 15, 'home', '2025-12-28 18:11:49', NULL, 0),
(716, 15, 'home', '2025-12-28 18:12:18', '2025-12-28 18:12:20', 2),
(717, 15, 'digits-hoc-so', '2025-12-28 18:12:20', '2025-12-28 18:12:22', 2),
(718, 15, 'digits-hoc-so', '2025-12-28 18:12:20', '2025-12-28 18:12:22', 2),
(719, 15, 'home', '2025-12-28 18:12:22', NULL, 0),
(720, 15, 'home', '2025-12-28 18:14:24', NULL, 0),
(721, 1, 'home', '2025-12-28 18:14:31', '2025-12-28 18:14:36', 5),
(722, 1, 'digits-hoc-so', '2025-12-28 18:14:36', '2025-12-28 18:14:38', 2),
(723, 1, 'digits-hoc-so', '2025-12-28 18:14:36', '2025-12-28 18:14:38', 2),
(724, 1, 'home', '2025-12-28 18:14:38', NULL, 0),
(725, 1, 'home', '2025-12-28 18:16:21', NULL, 0),
(726, 1, 'home', '2025-12-28 18:16:32', NULL, 0),
(727, 1, 'home', '2025-12-28 18:16:43', '2025-12-28 18:16:45', 2),
(728, 1, 'digits-hoc-so', '2025-12-28 18:16:45', '2025-12-28 18:16:48', 3),
(729, 1, 'digits-hoc-so', '2025-12-28 18:16:45', '2025-12-28 18:16:48', 3),
(730, 1, 'home', '2025-12-28 18:16:48', NULL, 0),
(731, 1, 'home', '2025-12-28 18:19:56', NULL, 0),
(732, 1, 'home', '2025-12-28 18:20:21', NULL, 0),
(733, 1, 'home', '2025-12-28 18:21:31', NULL, 0),
(734, 1, 'home', '2025-12-28 18:21:42', NULL, 0),
(735, 1, 'home', '2025-12-28 18:21:55', NULL, 0),
(736, 1, 'home', '2025-12-28 18:23:03', '2025-12-28 18:24:38', 95),
(737, 1, 'home', '2025-12-28 18:24:38', NULL, 0),
(738, 15, 'home', '2025-12-28 18:25:04', NULL, 0),
(739, 15, 'home', '2025-12-28 18:25:32', NULL, 0),
(740, 15, 'home', '2025-12-28 18:26:15', NULL, 0),
(741, 15, 'home', '2025-12-28 18:26:45', NULL, 0),
(742, 15, 'home', '2025-12-28 18:26:56', NULL, 0),
(743, 15, 'home', '2025-12-28 18:27:06', NULL, 0),
(744, 15, 'home', '2025-12-28 18:27:28', NULL, 0),
(745, 15, 'home', '2025-12-28 18:39:47', NULL, 0),
(746, 15, 'home', '2025-12-28 18:43:53', NULL, 0),
(747, 15, 'home', '2025-12-28 18:50:33', NULL, 0),
(748, 15, 'home', '2025-12-28 18:50:37', NULL, 0),
(749, 15, 'home', '2025-12-28 18:50:59', NULL, 0),
(750, 15, 'home', '2025-12-28 18:54:30', '2025-12-28 18:56:15', 105),
(751, 15, 'home', '2025-12-28 18:56:15', NULL, 0),
(752, 15, 'home', '2025-12-28 19:14:00', NULL, 0),
(753, 15, 'home', '2025-12-28 19:15:46', NULL, 0),
(754, 15, 'home', '2025-12-28 19:15:50', NULL, 0),
(755, 15, 'home', '2025-12-28 19:15:50', NULL, 0),
(756, 15, 'home', '2025-12-28 19:16:02', NULL, 0),
(757, 15, 'home', '2025-12-28 19:16:02', NULL, 0),
(758, 15, 'home', '2025-12-28 19:18:19', '2025-12-28 19:21:51', 212),
(759, 15, 'home', '2025-12-28 19:18:20', '2025-12-28 19:19:25', 65),
(760, 15, 'practice-tinh-toan', '2025-12-28 19:19:25', '2025-12-28 19:19:27', 2),
(761, 15, 'practice-tinh-toan', '2025-12-28 19:19:25', '2025-12-28 19:19:27', 2),
(762, 15, 'users', '2025-12-28 19:19:27', '2025-12-28 19:19:29', 2),
(763, 15, 'games-dino', '2025-12-28 19:19:29', '2025-12-28 19:19:30', 1),
(764, 15, 'games-dino', '2025-12-28 19:19:29', '2025-12-28 19:19:30', 1),
(765, 15, 'games', '2025-12-28 19:19:30', '2025-12-28 19:19:32', 2),
(766, 15, 'games-hung-tao', '2025-12-28 19:19:30', '2025-12-28 19:19:32', 2),
(767, 15, 'practice-tinh-toan', '2025-12-28 19:19:32', '2025-12-28 19:19:32', 0),
(768, 15, 'practice-tinh-toan', '2025-12-28 19:19:32', '2025-12-28 19:19:32', 0),
(769, 15, 'practice-nhan-ngon', '2025-12-28 19:19:32', '2025-12-28 19:19:34', 2),
(770, 15, 'practice-nhan-ngon', '2025-12-28 19:19:32', '2025-12-28 19:19:34', 2),
(771, 15, 'compare-so-sanh', '2025-12-28 19:19:34', '2025-12-28 19:19:35', 1),
(772, 15, 'compare-so-sanh', '2025-12-28 19:19:34', '2025-12-28 19:19:35', 1);
INSERT INTO `study_sessions` (`id`, `user_id`, `page_name`, `start_time`, `end_time`, `duration`) VALUES
(773, 15, 'compare-xep-so', '2025-12-28 19:19:35', '2025-12-28 19:19:45', 10),
(774, 15, 'compare-xep-so', '2025-12-28 19:19:35', '2025-12-28 19:19:45', 10),
(775, 15, 'digits-hoc-so', '2025-12-28 19:19:45', '2025-12-28 19:19:46', 1),
(776, 15, 'digits-hoc-so', '2025-12-28 19:19:45', '2025-12-28 19:19:46', 1),
(777, 15, 'digits-ghep-so', '2025-12-28 19:19:46', '2025-12-28 19:19:52', 6),
(778, 15, 'digits-ghep-so', '2025-12-28 19:19:46', '2025-12-28 19:19:52', 6),
(779, 15, 'digits-chan-le', '2025-12-28 19:19:52', '2025-12-28 19:19:56', 4),
(780, 15, 'digits-chan-le', '2025-12-28 19:19:52', '2025-12-28 19:19:56', 4),
(781, 15, 'digits-dem-so', '2025-12-28 19:19:56', NULL, 0),
(782, 15, 'digits-dem-so', '2025-12-28 19:19:56', NULL, 0),
(783, 15, 'compare-xep-so', '2025-12-28 19:21:51', '2025-12-28 19:21:57', 6),
(784, 15, 'compare-xep-so', '2025-12-28 19:21:51', '2025-12-28 19:21:57', 6),
(785, 15, 'compare-so-sanh', '2025-12-28 19:21:57', '2025-12-28 19:21:59', 2),
(786, 15, 'compare-so-sanh', '2025-12-28 19:21:57', '2025-12-28 19:21:59', 2),
(787, 15, 'digits-hoc-so', '2025-12-28 19:21:59', '2025-12-28 19:22:00', 1),
(788, 15, 'digits-hoc-so', '2025-12-28 19:21:59', '2025-12-28 19:22:00', 1),
(789, 15, 'digits-ghep-so', '2025-12-28 19:22:00', '2025-12-28 19:23:37', 97),
(790, 15, 'digits-ghep-so', '2025-12-28 19:22:00', '2025-12-28 19:23:37', 97),
(791, 15, 'digits-chan-le', '2025-12-28 19:23:37', '2025-12-28 19:23:56', 19),
(792, 15, 'digits-chan-le', '2025-12-28 19:23:37', '2025-12-28 19:23:56', 19),
(793, 15, 'home', '2025-12-28 19:23:56', '2025-12-28 19:24:00', 4),
(794, 15, 'home', '2025-12-28 19:24:00', '2025-12-28 19:24:02', 2),
(795, 15, 'home', '2025-12-28 19:24:02', '2025-12-28 19:24:15', 13),
(796, 15, 'digits-hoc-so', '2025-12-28 19:24:15', '2025-12-28 19:24:16', 1),
(797, 15, 'digits-hoc-so', '2025-12-28 19:24:15', '2025-12-28 19:24:16', 1),
(798, 15, 'digits-ghep-so', '2025-12-28 19:24:16', '2025-12-28 19:24:20', 4),
(799, 15, 'digits-ghep-so', '2025-12-28 19:24:16', '2025-12-28 19:24:20', 4),
(800, 15, 'digits-chan-le', '2025-12-28 19:24:20', '2025-12-28 19:24:22', 2),
(801, 15, 'digits-chan-le', '2025-12-28 19:24:20', '2025-12-28 19:24:22', 2),
(802, 15, 'digits-dem-so', '2025-12-28 19:24:22', '2025-12-28 19:24:25', 3),
(803, 15, 'digits-dem-so', '2025-12-28 19:24:22', '2025-12-28 19:24:25', 3),
(804, 15, 'compare-so-sanh', '2025-12-28 19:24:25', '2025-12-28 19:24:27', 2),
(805, 15, 'compare-so-sanh', '2025-12-28 19:24:25', '2025-12-28 19:24:27', 2),
(806, 15, 'compare-xep-so', '2025-12-28 19:24:27', '2025-12-28 19:25:30', 63),
(807, 15, 'compare-xep-so', '2025-12-28 19:24:27', '2025-12-28 19:25:30', 63),
(808, 15, 'compare-so-sanh', '2025-12-28 19:25:30', '2025-12-28 19:25:31', 1),
(809, 15, 'compare-so-sanh', '2025-12-28 19:25:30', '2025-12-28 19:25:31', 1),
(810, 15, 'digits-hoc-so', '2025-12-28 19:25:31', '2025-12-28 19:25:33', 2),
(811, 15, 'digits-hoc-so', '2025-12-28 19:25:31', '2025-12-28 19:25:33', 2),
(812, 15, 'digits-ghep-so', '2025-12-28 19:25:33', '2025-12-28 19:25:34', 1),
(813, 15, 'digits-ghep-so', '2025-12-28 19:25:33', '2025-12-28 19:25:34', 1),
(814, 15, 'digits-chan-le', '2025-12-28 19:25:34', '2025-12-28 19:25:37', 3),
(815, 15, 'digits-chan-le', '2025-12-28 19:25:34', '2025-12-28 19:25:37', 3),
(816, 15, 'digits-dem-so', '2025-12-28 19:25:37', '2025-12-28 19:25:40', 3),
(817, 15, 'digits-dem-so', '2025-12-28 19:25:37', '2025-12-28 19:25:40', 3),
(818, 15, 'games', '2025-12-28 19:25:40', '2025-12-28 19:25:41', 1),
(819, 15, 'games-hung-tao', '2025-12-28 19:25:40', '2025-12-28 19:25:41', 1),
(820, 15, 'games-dino', '2025-12-28 19:25:41', '2025-12-28 19:25:43', 2),
(821, 15, 'games-dino', '2025-12-28 19:25:41', '2025-12-28 19:25:43', 2),
(822, 15, 'users', '2025-12-28 19:25:43', NULL, 0),
(823, 15, 'home', '2025-12-28 19:27:08', '2025-12-28 19:27:10', 2),
(824, 15, 'users', '2025-12-28 19:27:10', NULL, 0),
(825, 15, 'home', '2025-12-28 19:27:18', '2025-12-28 19:27:30', 12),
(826, 15, 'users', '2025-12-28 19:27:30', NULL, 0),
(827, 15, 'home', '2025-12-28 19:31:29', NULL, 0),
(828, 15, 'home', '2025-12-28 19:31:43', NULL, 0),
(829, 15, 'home', '2025-12-28 19:31:57', '2025-12-28 19:32:16', 19),
(830, 15, 'about-us', '2025-12-28 19:32:16', NULL, 0),
(831, 15, 'home', '2025-12-28 19:33:57', '2025-12-28 19:34:00', 3),
(832, 15, 'about-us', '2025-12-28 19:34:00', NULL, 0),
(833, 15, 'home', '2025-12-28 19:34:38', NULL, 0),
(834, 15, 'home', '2025-12-28 19:34:41', '2025-12-28 19:34:48', 7),
(835, 15, 'about-us', '2025-12-28 19:34:48', NULL, 0),
(836, 15, 'home', '2025-12-28 19:35:35', '2025-12-28 19:35:39', 4),
(837, 15, 'about-us', '2025-12-28 19:35:39', NULL, 0),
(838, 15, 'home', '2025-12-28 19:36:25', '2025-12-28 19:36:28', 3),
(839, 15, 'about-us', '2025-12-28 19:36:28', NULL, 0),
(840, 15, 'home', '2025-12-28 19:37:00', NULL, 0),
(841, 15, 'home', '2025-12-28 19:37:04', '2025-12-28 19:37:07', 3),
(842, 15, 'about-us', '2025-12-28 19:37:07', NULL, 0),
(843, 15, 'home', '2025-12-28 19:37:53', '2025-12-28 19:37:58', 5),
(844, 15, 'about-us', '2025-12-28 19:37:58', NULL, 0),
(845, 15, 'home', '2025-12-28 19:39:25', '2025-12-28 19:39:36', 11),
(846, 15, 'about-us', '2025-12-28 19:39:36', NULL, 0),
(847, 15, 'home', '2025-12-28 19:40:29', '2025-12-28 19:41:14', 45),
(848, 15, 'about-us', '2025-12-28 19:41:14', NULL, 0),
(849, 15, 'home', '2025-12-28 19:41:50', NULL, 0),
(850, 15, 'home', '2025-12-28 19:41:53', '2025-12-28 19:41:57', 4),
(851, 15, 'about-us', '2025-12-28 19:41:57', NULL, 0),
(852, 15, 'home', '2025-12-28 19:42:14', '2025-12-28 19:42:25', 11),
(853, 15, 'about-us', '2025-12-28 19:42:25', '2025-12-28 19:47:11', 286),
(854, 15, 'users', '2025-12-28 19:47:11', '2025-12-28 19:47:21', 10),
(855, 15, 'home', '2025-12-28 19:47:21', NULL, 0),
(856, 15, 'home', '2025-12-28 20:05:09', '2025-12-28 20:05:14', 5),
(857, 15, 'users', '2025-12-28 20:05:14', NULL, 0),
(858, 15, 'home', '2025-12-28 20:05:29', '2025-12-28 20:05:38', 9),
(859, 15, 'about-us', '2025-12-28 20:05:38', NULL, 0),
(860, 15, 'home', '2025-12-28 20:05:42', NULL, 0),
(861, 15, 'home', '2025-12-28 20:07:27', NULL, 0),
(862, 15, 'home', '2025-12-28 20:07:46', NULL, 0),
(863, 15, 'home', '2025-12-28 20:08:11', '2025-12-28 20:09:23', 72),
(864, 15, 'users', '2025-12-28 20:09:23', NULL, 0),
(865, 15, 'home', '2025-12-28 20:12:02', '2025-12-28 20:16:06', 244),
(866, 15, 'users', '2025-12-28 20:16:06', '2025-12-28 20:16:06', 0),
(867, 15, 'users', '2025-12-28 20:16:06', NULL, 0),
(868, 15, 'home', '2025-12-28 20:17:03', '2025-12-28 20:17:14', 11),
(869, 15, 'users', '2025-12-28 20:17:14', NULL, 0),
(870, 15, 'home', '2025-12-28 20:20:54', NULL, 0),
(871, 15, 'home', '2025-12-28 20:40:00', '2025-12-28 20:40:03', 3),
(872, 15, 'users', '2025-12-28 20:40:03', '2025-12-28 20:41:05', 62),
(873, 15, 'about-us', '2025-12-28 20:41:05', NULL, 0),
(874, 15, 'home', '2025-12-28 20:41:42', NULL, 0),
(875, 15, 'home', '2025-12-28 20:41:55', NULL, 0),
(876, 15, 'home', '2025-12-28 20:42:05', '2025-12-28 20:42:34', 29),
(877, 15, 'learning', '2025-12-28 20:42:34', '2025-12-28 20:43:36', 62),
(878, 15, 'users', '2025-12-28 20:43:36', '2025-12-28 20:43:38', 2),
(879, 15, 'games', '2025-12-28 20:43:38', '2025-12-28 20:43:41', 3),
(880, 15, 'games-hung-tao', '2025-12-28 20:43:39', '2025-12-28 20:43:41', 2),
(881, 15, 'practice-tinh-toan', '2025-12-28 20:43:41', '2025-12-28 20:43:45', 4),
(882, 15, 'practice-tinh-toan', '2025-12-28 20:43:41', '2025-12-28 20:43:45', 4),
(883, 15, 'learning', '2025-12-28 20:43:45', NULL, 0),
(884, 15, 'home', '2025-12-28 20:44:04', '2025-12-28 20:44:20', 16),
(885, 15, 'learning', '2025-12-28 20:44:20', NULL, 0),
(886, 15, 'home', '2025-12-28 20:44:56', '2025-12-28 20:45:20', 24),
(887, 15, 'learning', '2025-12-28 20:45:20', NULL, 0),
(888, 15, 'home', '2025-12-28 20:46:02', NULL, 0),
(889, 15, 'home', '2025-12-28 20:46:29', '2025-12-28 20:46:31', 2),
(890, 15, 'learning', '2025-12-28 20:46:31', NULL, 0),
(891, 15, 'home', '2025-12-28 20:47:41', NULL, 0),
(892, 15, 'home', '2025-12-28 20:48:02', '2025-12-28 20:48:04', 2),
(893, 15, 'learning', '2025-12-28 20:48:04', NULL, 0),
(894, 15, 'home', '2025-12-28 20:48:49', '2025-12-28 20:49:10', 21),
(895, 15, 'learning', '2025-12-28 20:49:10', NULL, 0),
(896, 15, 'home', '2025-12-28 20:50:03', '2025-12-28 20:50:05', 2),
(897, 15, 'learning', '2025-12-28 20:50:05', NULL, 0),
(898, 15, 'home', '2025-12-28 20:50:47', '2025-12-28 20:51:06', 19),
(899, 15, 'learning', '2025-12-28 20:51:06', NULL, 0),
(900, 15, 'home', '2025-12-28 20:52:35', NULL, 0),
(901, 15, 'home', '2025-12-28 20:54:08', NULL, 0),
(902, 15, 'home', '2025-12-28 20:54:10', NULL, 0),
(903, 15, 'home', '2025-12-28 20:54:14', '2025-12-28 20:54:23', 9),
(904, 15, 'learning', '2025-12-28 20:54:23', NULL, 0),
(905, 15, 'home', '2025-12-28 20:54:28', '2025-12-28 20:54:30', 2),
(906, 15, 'learning', '2025-12-28 20:54:30', NULL, 0),
(907, 15, 'home', '2025-12-28 20:55:07', '2025-12-28 20:55:17', 10),
(908, 15, 'learning', '2025-12-28 20:55:17', NULL, 0),
(909, 15, 'home', '2025-12-28 20:58:02', NULL, 0),
(910, 15, 'home', '2025-12-28 20:58:46', NULL, 0),
(911, 15, 'home', '2025-12-28 20:59:02', NULL, 0),
(912, 15, 'home', '2025-12-28 20:59:08', NULL, 0),
(913, 15, 'home', '2025-12-28 20:59:12', NULL, 0),
(914, 15, 'home', '2025-12-28 20:59:19', NULL, 0),
(915, 15, 'home', '2025-12-28 21:00:08', NULL, 0),
(916, 15, 'home', '2025-12-28 21:00:14', NULL, 0),
(917, 15, 'home', '2025-12-28 21:00:15', NULL, 0),
(918, 15, 'home', '2025-12-28 21:00:38', NULL, 0),
(919, 15, 'home', '2025-12-28 21:00:42', NULL, 0),
(920, 15, 'home', '2025-12-28 21:00:53', '2025-12-28 21:01:00', 7),
(921, 15, 'learning', '2025-12-28 21:01:00', NULL, 0),
(922, 15, 'home', '2025-12-28 21:01:27', '2025-12-28 21:01:31', 4),
(923, 15, 'learning', '2025-12-28 21:01:31', NULL, 0),
(924, 15, 'home', '2025-12-28 21:03:48', NULL, 0),
(925, 15, 'home', '2025-12-28 21:05:23', NULL, 0),
(926, 15, 'home', '2025-12-28 21:05:38', NULL, 0),
(927, 15, 'home', '2025-12-28 21:06:16', '2025-12-28 21:06:22', 6),
(928, 15, 'learning', '2025-12-28 21:06:22', NULL, 0),
(929, 15, 'home', '2025-12-28 21:08:33', NULL, 0),
(930, 15, 'home', '2025-12-28 21:09:27', NULL, 0),
(931, 15, 'home', '2025-12-28 21:10:13', '2025-12-28 21:10:27', 14),
(932, 15, 'learning', '2025-12-28 21:10:27', NULL, 0),
(933, 15, 'home', '2025-12-28 21:11:20', '2025-12-28 21:12:03', 43),
(934, 15, 'learning', '2025-12-28 21:12:03', NULL, 0),
(935, 15, 'home', '2025-12-28 21:12:43', NULL, 0),
(936, 15, 'home', '2025-12-28 21:14:04', NULL, 0),
(937, 15, 'home', '2025-12-28 21:14:27', NULL, 0),
(938, 15, 'home', '2025-12-28 21:15:56', NULL, 0),
(939, 15, 'home', '2025-12-28 21:16:39', NULL, 0),
(940, 15, 'home', '2025-12-28 21:17:22', '2025-12-28 21:18:42', 80),
(941, 15, 'learning', '2025-12-28 21:18:42', NULL, 0),
(942, 15, 'home', '2025-12-28 21:18:47', NULL, 0),
(943, 15, 'home', '2025-12-28 21:19:35', NULL, 0),
(944, 15, 'home', '2025-12-28 21:21:15', NULL, 0),
(945, 15, 'home', '2025-12-28 21:22:54', '2025-12-28 21:23:26', 32),
(946, 15, 'learning', '2025-12-28 21:23:26', NULL, 0),
(947, 15, 'home', '2025-12-28 21:24:14', '2025-12-28 21:24:22', 8),
(948, 15, 'learning', '2025-12-28 21:24:22', '2025-12-28 21:25:57', 95),
(949, 15, 'users', '2025-12-28 21:25:57', '2025-12-28 21:26:08', 11),
(950, 15, 'home', '2025-12-28 21:26:08', NULL, 0),
(951, 15, 'home', '2025-12-28 21:26:55', '2025-12-28 21:27:08', 13),
(952, 15, 'learning', '2025-12-28 21:27:08', NULL, 0),
(953, 15, 'home', '2025-12-28 21:28:08', '2025-12-28 21:28:23', 15),
(954, 15, 'learning', '2025-12-28 21:28:23', NULL, 0),
(955, 15, 'home', '2025-12-28 21:32:27', NULL, 0),
(956, 15, 'home', '2025-12-28 21:32:37', NULL, 0),
(957, 15, 'home', '2025-12-28 21:33:05', '2025-12-28 21:33:10', 5),
(958, 15, 'learning', '2025-12-28 21:33:10', NULL, 0),
(959, 15, 'home', '2025-12-28 21:34:28', '2025-12-28 21:34:30', 2),
(960, 15, 'users', '2025-12-28 21:34:30', '2025-12-28 21:34:59', 29),
(961, 15, 'learning', '2025-12-28 21:34:59', NULL, 0),
(962, 15, 'home', '2025-12-28 21:36:13', NULL, 0),
(963, 15, 'home', '2025-12-28 21:36:23', '2025-12-28 21:36:43', 20),
(964, 15, 'learning', '2025-12-28 21:36:43', '2025-12-28 21:37:34', 51),
(965, 15, 'about-us', '2025-12-28 21:37:34', '2025-12-28 21:37:34', 0),
(966, 15, 'users', '2025-12-28 21:37:34', NULL, 0),
(967, 15, 'home', '2025-12-28 21:37:42', '2025-12-28 21:37:44', 2),
(968, 15, 'users', '2025-12-28 21:37:44', NULL, 0),
(969, 15, 'home', '2025-12-28 21:38:34', NULL, 0),
(970, 1, 'home', '2025-12-28 21:38:46', '2025-12-28 21:38:47', 1),
(971, 1, 'learning', '2025-12-28 21:38:47', '2025-12-28 21:39:18', 31),
(972, 1, 'users', '2025-12-28 21:39:18', NULL, 0),
(973, 1, 'home', '2025-12-28 21:40:22', NULL, 0),
(974, 1, 'home', '2025-12-28 21:45:08', '2025-12-28 21:45:10', 2),
(975, 1, 'learning', '2025-12-28 21:45:10', '2025-12-28 21:46:06', 56),
(976, 1, 'users', '2025-12-28 21:46:06', NULL, 0),
(977, 1, 'home', '2025-12-28 21:48:37', NULL, 0),
(978, 1, 'home', '2025-12-28 21:48:46', '2025-12-28 21:49:54', 68),
(979, 1, 'users', '2025-12-28 21:49:54', '2025-12-28 21:50:14', 20),
(980, 1, 'home', '2025-12-28 21:50:14', NULL, 0),
(981, 1, 'home', '2025-12-28 21:50:33', NULL, 0),
(982, 1, 'home', '2025-12-28 21:51:10', NULL, 0),
(983, 1, 'home', '2025-12-28 21:51:19', NULL, 0),
(984, 1, 'home', '2025-12-28 21:52:10', NULL, 0),
(985, 1, 'home', '2025-12-28 21:52:23', NULL, 0),
(986, 1, 'home', '2025-12-28 21:52:36', NULL, 0),
(987, 1, 'home', '2025-12-28 21:52:48', NULL, 0),
(988, 1, 'home', '2025-12-28 21:53:07', '2025-12-28 21:53:47', 40),
(989, 1, 'learning', '2025-12-28 21:53:47', NULL, 0),
(990, 1, 'home', '2025-12-28 21:56:13', NULL, 0),
(991, 1, 'home', '2025-12-28 21:56:25', NULL, 0),
(992, 1, 'home', '2025-12-28 21:57:19', '2025-12-28 21:57:28', 9),
(993, 1, 'learning', '2025-12-28 21:57:28', NULL, 0),
(994, 1, 'home', '2025-12-28 21:58:10', NULL, 0),
(995, 1, 'home', '2025-12-28 21:58:20', NULL, 0),
(996, 1, 'home', '2025-12-28 21:58:30', '2025-12-28 21:58:45', 15),
(997, 1, 'learning', '2025-12-28 21:58:45', NULL, 0),
(998, 1, 'home', '2025-12-28 21:59:59', NULL, 0),
(999, 1, 'home', '2025-12-28 22:00:09', NULL, 0),
(1000, 1, 'home', '2025-12-28 22:00:20', '2025-12-28 22:09:44', 564),
(1001, 1, 'home', '2025-12-28 22:02:45', '2025-12-28 22:02:54', 9),
(1002, 1, 'learning', '2025-12-28 22:02:54', NULL, 0),
(1003, 1, 'home', '2025-12-28 22:03:11', '2025-12-28 22:03:13', 2),
(1004, 1, 'learning', '2025-12-28 22:03:13', NULL, 0),
(1005, 1, 'learning', '2025-12-28 22:09:44', NULL, 0),
(1006, 1, 'home', '2025-12-28 22:11:18', '2025-12-28 22:11:31', 13),
(1007, 1, 'learning', '2025-12-28 22:11:31', NULL, 0),
(1008, 1, 'home', '2025-12-28 22:13:34', '2025-12-28 22:13:48', 14),
(1009, 1, 'learning', '2025-12-28 22:13:48', '2025-12-28 22:14:19', 31),
(1010, 1, 'home', '2025-12-28 22:14:19', NULL, 0),
(1011, 1, 'home', '2025-12-28 22:15:34', '2025-12-28 22:15:50', 16),
(1012, 1, 'learning', '2025-12-28 22:15:50', NULL, 0),
(1013, 1, 'home', '2025-12-28 22:18:14', NULL, 0),
(1014, 1, 'home', '2025-12-28 22:19:33', '2025-12-28 22:20:40', 67),
(1015, 1, 'learning', '2025-12-28 22:20:40', NULL, 0),
(1016, 1, 'home', '2025-12-28 22:22:42', NULL, 0),
(1017, 1, 'home', '2025-12-28 22:31:14', NULL, 0),
(1018, 1, 'home', '2025-12-28 22:32:14', NULL, 0),
(1019, 1, 'home', '2025-12-28 22:33:10', NULL, 0),
(1020, 1, 'home', '2025-12-28 22:33:12', NULL, 0),
(1021, 1, 'home', '2025-12-28 22:33:19', NULL, 0),
(1022, 1, 'home', '2025-12-28 22:33:25', NULL, 0),
(1023, 1, 'home', '2025-12-28 22:34:29', NULL, 0),
(1024, 1, 'home', '2025-12-28 22:35:41', NULL, 0),
(1025, 1, 'home', '2025-12-28 22:39:13', NULL, 0),
(1026, 1, 'home', '2025-12-28 22:39:24', NULL, 0),
(1027, 1, 'home', '2025-12-28 22:40:24', NULL, 0),
(1028, 1, 'home', '2025-12-28 22:41:25', '2025-12-28 22:42:36', 71),
(1029, 1, 'home', '2025-12-28 22:42:36', '2025-12-28 22:42:40', 4),
(1030, 1, 'users', '2025-12-28 22:42:40', NULL, 0),
(1031, 15, 'home', '2025-12-28 23:02:14', NULL, 0),
(1032, 15, 'home', '2025-12-28 23:08:44', '2025-12-28 23:08:49', 5),
(1033, 15, 'users', '2025-12-28 23:08:49', NULL, 0),
(1034, 15, 'home', '2025-12-28 23:09:44', NULL, 0),
(1035, 15, 'home', '2025-12-28 23:09:47', NULL, 0),
(1036, 15, 'home', '2025-12-28 23:10:06', NULL, 0),
(1037, 15, 'home', '2025-12-28 23:10:17', NULL, 0),
(1038, 15, 'home', '2025-12-28 23:10:26', NULL, 0),
(1039, 15, 'home', '2025-12-28 23:11:11', NULL, 0),
(1040, 15, 'home', '2025-12-28 23:11:21', '2025-12-28 23:12:33', 72),
(1041, 15, 'users', '2025-12-28 23:12:33', NULL, 0),
(1042, 15, 'home', '2025-12-28 23:15:22', NULL, 0),
(1043, 15, 'home', '2025-12-28 23:15:44', '2025-12-28 23:16:01', 17),
(1044, 15, 'users', '2025-12-28 23:16:01', NULL, 0),
(1045, 15, 'home', '2025-12-29 09:18:46', '2025-12-29 09:19:15', 29),
(1046, 15, 'practice-viet-so', '2025-12-29 09:19:15', '2025-12-29 09:19:18', 3),
(1047, 15, 'practice-nhan-ngon', '2025-12-29 09:19:18', '2025-12-29 09:19:21', 3),
(1048, 15, 'practice-nhan-ngon', '2025-12-29 09:19:18', '2025-12-29 09:19:21', 3),
(1049, 15, 'practice-viet-so', '2025-12-29 09:19:21', NULL, 0),
(1050, 15, 'home', '2025-12-29 09:19:23', NULL, 0),
(1051, 15, 'home', '2025-12-29 09:21:14', '2025-12-29 09:22:06', 52),
(1052, 15, 'practice-viet-so', '2025-12-29 09:22:06', NULL, 0),
(1053, 15, 'home', '2025-12-29 09:22:09', '2025-12-29 09:22:11', 2),
(1054, 15, 'practice-viet-so', '2025-12-29 09:22:11', NULL, 0),
(1055, 15, 'home', '2025-12-29 09:23:03', '2025-12-29 09:23:39', 36),
(1056, 15, 'practice-viet-so', '2025-12-29 09:23:39', NULL, 0),
(1057, 15, 'home', '2025-12-29 09:25:40', '2025-12-29 09:25:54', 14),
(1058, 15, 'practice-viet-so', '2025-12-29 09:25:55', NULL, 0),
(1059, 15, 'home', '2025-12-29 09:27:58', NULL, 0),
(1060, 15, 'home', '2025-12-29 09:28:11', NULL, 0),
(1061, 15, 'home', '2025-12-29 09:28:31', '2025-12-29 09:28:56', 25),
(1062, 15, 'home', '2025-12-29 09:28:56', '2025-12-29 09:28:59', 3),
(1063, 15, 'home', '2025-12-29 09:28:59', '2025-12-29 09:29:01', 2),
(1064, 15, 'learning', '2025-12-29 09:29:01', '2025-12-29 09:29:06', 5),
(1065, 15, 'users', '2025-12-29 09:29:06', '2025-12-29 09:29:19', 13),
(1066, 15, 'learning', '2025-12-29 09:29:19', '2025-12-29 09:29:56', 37),
(1067, 15, 'practice-viet-so', '2025-12-29 09:29:56', NULL, 0),
(1068, 15, 'home', '2025-12-29 09:31:37', NULL, 0),
(1069, 15, 'home', '2025-12-29 09:33:09', '2025-12-29 09:33:13', 4),
(1070, 15, 'practice-viet-so', '2025-12-29 09:33:13', NULL, 0),
(1071, 15, 'home', '2025-12-29 09:36:06', '2025-12-29 09:38:46', 160),
(1072, 15, 'practice-viet-so', '2025-12-29 09:38:46', '2025-12-29 09:40:00', 74),
(1073, 15, 'home', '2025-12-29 09:40:00', '2025-12-29 09:40:04', 4),
(1074, 15, 'digits-hoc-so', '2025-12-29 09:40:04', '2025-12-29 09:40:09', 5),
(1075, 15, 'digits-hoc-so', '2025-12-29 09:40:04', '2025-12-29 09:40:09', 5),
(1076, 15, 'digits-ghep-so', '2025-12-29 09:40:09', NULL, 0),
(1077, 15, 'digits-ghep-so', '2025-12-29 09:40:09', NULL, 0),
(1078, 15, 'home', '2025-12-29 09:40:24', '2025-12-29 09:40:25', 1),
(1079, 15, 'home', '2025-12-29 09:40:25', '2025-12-29 09:40:27', 2),
(1080, 15, 'digits-hoc-so', '2025-12-29 09:40:27', '2025-12-29 09:40:28', 1),
(1081, 15, 'digits-hoc-so', '2025-12-29 09:40:27', '2025-12-29 09:40:28', 1),
(1082, 15, 'digits-ghep-so', '2025-12-29 09:40:28', '2025-12-29 09:40:35', 7),
(1083, 15, 'digits-ghep-so', '2025-12-29 09:40:28', '2025-12-29 09:40:35', 7),
(1084, 15, 'digits-chan-le', '2025-12-29 09:40:35', '2025-12-29 09:40:41', 6),
(1085, 15, 'digits-chan-le', '2025-12-29 09:40:35', '2025-12-29 09:40:41', 6),
(1086, 15, 'digits-dem-so', '2025-12-29 09:40:41', '2025-12-29 09:40:48', 7),
(1087, 15, 'digits-dem-so', '2025-12-29 09:40:41', '2025-12-29 09:40:48', 7),
(1088, 15, 'compare-so-sanh', '2025-12-29 09:40:48', '2025-12-29 09:40:51', 3),
(1089, 15, 'compare-so-sanh', '2025-12-29 09:40:48', '2025-12-29 09:40:51', 3),
(1090, 15, 'compare-xep-so', '2025-12-29 09:40:51', '2025-12-29 09:41:11', 20),
(1091, 15, 'compare-xep-so', '2025-12-29 09:40:51', '2025-12-29 09:41:11', 20),
(1092, 15, 'practice-tinh-toan', '2025-12-29 09:41:11', '2025-12-29 09:41:28', 17),
(1093, 15, 'practice-tinh-toan', '2025-12-29 09:41:11', '2025-12-29 09:41:28', 17),
(1094, 15, 'compare-so-sanh', '2025-12-29 09:41:28', '2025-12-29 09:41:31', 3),
(1095, 15, 'compare-so-sanh', '2025-12-29 09:41:28', '2025-12-29 09:41:31', 3),
(1096, 15, 'home', '2025-12-29 09:41:31', '2025-12-29 09:41:38', 7),
(1097, 15, 'digits-hoc-so', '2025-12-29 09:41:38', '2025-12-29 09:41:56', 18),
(1098, 15, 'digits-hoc-so', '2025-12-29 09:41:38', '2025-12-29 09:41:56', 18),
(1099, 15, 'digits-chan-le', '2025-12-29 09:41:56', '2025-12-29 09:41:57', 1),
(1100, 15, 'digits-chan-le', '2025-12-29 09:41:56', '2025-12-29 09:41:57', 1),
(1101, 15, 'digits-dem-so', '2025-12-29 09:41:57', '2025-12-29 09:42:01', 4),
(1102, 15, 'digits-dem-so', '2025-12-29 09:41:57', '2025-12-29 09:42:01', 4),
(1103, 15, 'compare-so-sanh', '2025-12-29 09:42:01', '2025-12-29 09:42:02', 1),
(1104, 15, 'compare-so-sanh', '2025-12-29 09:42:01', '2025-12-29 09:42:02', 1),
(1105, 15, 'compare-xep-so', '2025-12-29 09:42:02', '2025-12-29 09:42:04', 2),
(1106, 15, 'compare-xep-so', '2025-12-29 09:42:02', '2025-12-29 09:42:04', 2),
(1107, 15, 'practice-tinh-toan', '2025-12-29 09:42:04', '2025-12-29 09:42:05', 1),
(1108, 15, 'practice-tinh-toan', '2025-12-29 09:42:04', '2025-12-29 09:42:05', 1),
(1109, 15, 'practice-nhan-ngon', '2025-12-29 09:42:05', '2025-12-29 09:42:16', 11),
(1110, 15, 'practice-nhan-ngon', '2025-12-29 09:42:05', '2025-12-29 09:42:16', 11),
(1111, 15, 'practice-viet-so', '2025-12-29 09:42:16', '2025-12-29 09:42:31', 15),
(1112, 15, 'games', '2025-12-29 09:42:31', '2025-12-29 09:42:46', 15),
(1113, 15, 'games-hung-tao', '2025-12-29 09:42:31', '2025-12-29 09:42:46', 15),
(1114, 15, 'games-dino', '2025-12-29 09:42:46', '2025-12-29 09:42:55', 9),
(1115, 15, 'games-dino', '2025-12-29 09:42:46', '2025-12-29 09:42:55', 9),
(1116, 15, 'learning', '2025-12-29 09:42:55', '2025-12-29 09:43:06', 11),
(1117, 15, 'users', '2025-12-29 09:43:06', '2025-12-29 09:43:08', 2),
(1118, 15, 'about-us', '2025-12-29 09:43:08', '2025-12-29 09:45:58', 170),
(1119, 15, 'users', '2025-12-29 09:45:58', '2025-12-29 09:47:18', 80),
(1120, 15, 'home', '2025-12-29 09:47:18', '2025-12-29 09:47:19', 1),
(1121, 15, 'users', '2025-12-29 09:47:19', '2025-12-29 09:47:20', 1),
(1122, 15, 'home', '2025-12-29 09:47:20', '2025-12-29 09:47:29', 9),
(1123, 15, 'home', '2025-12-29 09:47:29', '2025-12-29 09:47:43', 14),
(1124, 15, 'home', '2025-12-29 09:47:43', '2025-12-29 09:47:46', 3),
(1125, 15, 'home', '2025-12-29 09:47:46', '2025-12-29 09:47:49', 3),
(1126, 15, 'home', '2025-12-29 09:47:49', '2025-12-29 09:48:03', 14),
(1127, 15, 'home', '2025-12-29 09:48:03', '2025-12-29 09:48:08', 5),
(1128, 15, 'games', '2025-12-29 09:48:08', '2025-12-29 09:48:11', 3),
(1129, 15, 'games-hung-tao', '2025-12-29 09:48:08', '2025-12-29 09:48:11', 3),
(1130, 15, 'home', '2025-12-29 09:48:11', '2025-12-29 09:50:30', 139),
(1131, 15, 'practice-viet-so', '2025-12-29 09:50:30', NULL, 0),
(1132, 15, 'home', '2025-12-29 09:51:42', NULL, 0),
(1133, 15, 'home', '2025-12-29 09:51:52', '2025-12-29 09:52:43', 51),
(1134, 15, 'about-us', '2025-12-29 09:52:43', '2025-12-29 09:53:07', 24),
(1135, 15, 'users', '2025-12-29 09:53:07', '2025-12-29 09:53:34', 27),
(1136, 15, 'about-us', '2025-12-29 09:53:34', '2025-12-29 09:59:51', 377),
(1137, 15, 'home', '2025-12-29 09:59:51', NULL, 0),
(1138, 16, 'home', '2025-12-29 10:02:03', '2025-12-29 10:02:20', 17),
(1139, 16, 'home', '2025-12-29 10:02:20', '2025-12-29 10:02:32', 12),
(1140, 16, 'learning', '2025-12-29 10:02:32', '2025-12-29 10:03:28', 56),
(1141, 16, 'users', '2025-12-29 10:03:28', '2025-12-29 10:03:45', 17),
(1142, 16, 'digits-hoc-so', '2025-12-29 10:03:45', '2025-12-29 10:03:58', 13),
(1143, 16, 'digits-hoc-so', '2025-12-29 10:03:45', '2025-12-29 10:03:58', 13),
(1144, 16, 'users', '2025-12-29 10:03:58', '2025-12-29 10:04:11', 13),
(1145, 16, 'digits-ghep-so', '2025-12-29 10:04:11', '2025-12-29 10:04:48', 37),
(1146, 16, 'digits-ghep-so', '2025-12-29 10:04:11', '2025-12-29 10:04:48', 37),
(1147, 16, 'users', '2025-12-29 10:04:48', '2025-12-29 10:04:59', 11),
(1148, 16, 'practice-tinh-toan', '2025-12-29 10:04:59', '2025-12-29 10:08:26', 207),
(1149, 16, 'practice-tinh-toan', '2025-12-29 10:04:59', '2025-12-29 10:08:26', 207),
(1150, 16, 'practice-nhan-ngon', '2025-12-29 10:08:26', '2025-12-29 10:08:32', 6),
(1151, 16, 'practice-nhan-ngon', '2025-12-29 10:08:26', '2025-12-29 10:08:32', 6),
(1152, 16, 'users', '2025-12-29 10:08:32', '2025-12-29 10:08:45', 13),
(1153, 16, 'home', '2025-12-29 10:08:45', NULL, 0),
(1154, 16, 'home', '2025-12-29 10:09:46', '2025-12-29 10:09:48', 2),
(1155, 16, 'users', '2025-12-29 10:09:48', '2025-12-29 10:09:55', 7),
(1156, 16, 'home', '2025-12-29 10:09:55', '2025-12-29 10:09:57', 2),
(1157, 16, 'users', '2025-12-29 10:09:57', '2025-12-29 10:10:05', 8),
(1158, 16, 'home', '2025-12-29 10:10:05', '2025-12-29 10:11:09', 64),
(1159, 16, 'practice-viet-so', '2025-12-29 10:11:09', '2025-12-29 10:12:24', 75),
(1160, 16, 'users', '2025-12-29 10:12:24', '2025-12-29 10:18:20', 356),
(1161, 16, 'home', '2025-12-29 10:18:20', NULL, 0),
(1162, 16, 'home', '2025-12-29 10:18:33', NULL, 0),
(1163, 16, 'home', '2025-12-29 10:19:45', '2025-12-29 10:21:41', 116),
(1164, 16, 'practice-viet-so', '2025-12-29 10:21:41', '2025-12-29 10:21:59', 18),
(1165, 16, 'games', '2025-12-29 10:21:59', '2025-12-29 10:22:00', 1),
(1166, 16, 'games-hung-tao', '2025-12-29 10:21:59', '2025-12-29 10:22:00', 1),
(1167, 16, 'games-dino', '2025-12-29 10:22:00', '2025-12-29 10:22:01', 1),
(1168, 16, 'games-dino', '2025-12-29 10:22:00', '2025-12-29 10:22:01', 1),
(1169, 16, 'practice-tinh-toan', '2025-12-29 10:22:01', NULL, 0),
(1170, 16, 'practice-tinh-toan', '2025-12-29 10:22:01', NULL, 0),
(1171, 16, 'home', '2025-12-29 10:23:45', '2025-12-29 10:24:05', 20),
(1172, 16, 'practice-viet-so', '2025-12-29 10:24:05', NULL, 0),
(1173, 16, 'home', '2025-12-29 10:25:36', '2025-12-29 10:25:58', 22),
(1174, 16, 'practice-viet-so', '2025-12-29 10:25:58', '2025-12-29 10:28:37', 159),
(1175, 16, 'users', '2025-12-29 10:28:37', NULL, 0),
(1176, 16, 'home', '2025-12-29 10:29:21', '2025-12-29 10:29:48', 27),
(1177, 16, 'practice-viet-so', '2025-12-29 10:29:48', '2025-12-29 10:30:29', 41),
(1178, 16, 'practice-nhan-ngon', '2025-12-29 10:30:29', '2025-12-29 10:30:32', 3),
(1179, 16, 'practice-nhan-ngon', '2025-12-29 10:30:29', '2025-12-29 10:30:32', 3),
(1180, 16, 'practice-viet-so', '2025-12-29 10:30:32', '2025-12-29 10:30:41', 9),
(1181, 16, 'compare-xep-so', '2025-12-29 10:30:41', '2025-12-29 10:30:42', 1),
(1182, 16, 'compare-xep-so', '2025-12-29 10:30:41', '2025-12-29 10:30:42', 1),
(1183, 16, 'compare-so-sanh', '2025-12-29 10:30:42', '2025-12-29 10:30:44', 2),
(1184, 16, 'compare-so-sanh', '2025-12-29 10:30:42', '2025-12-29 10:30:44', 2),
(1185, 16, 'digits-hoc-so', '2025-12-29 10:30:44', NULL, 0),
(1186, 16, 'digits-hoc-so', '2025-12-29 10:30:44', NULL, 0),
(1187, 16, 'home', '2025-12-29 10:31:09', '2025-12-29 10:32:14', 65),
(1188, 16, 'digits-hoc-so', '2025-12-29 10:32:14', NULL, 0),
(1189, 16, 'digits-hoc-so', '2025-12-29 10:32:14', NULL, 0),
(1190, 16, 'home', '2025-12-29 10:32:38', '2025-12-29 10:32:40', 2),
(1191, 16, 'digits-hoc-so', '2025-12-29 10:32:40', NULL, 0),
(1192, 16, 'digits-hoc-so', '2025-12-29 10:32:40', NULL, 0),
(1193, 16, 'home', '2025-12-29 14:30:49', NULL, 0),
(1194, 15, 'home', '2025-12-29 14:39:46', NULL, 0),
(1195, 15, 'home', '2025-12-29 14:40:34', '2025-12-29 14:40:44', 10),
(1196, 15, 'users', '2025-12-29 14:40:44', '2025-12-29 14:42:06', 82),
(1197, 15, 'practice-viet-so', '2025-12-29 14:42:06', '2025-12-29 14:42:09', 3),
(1198, 15, 'practice-nhan-ngon', '2025-12-29 14:42:09', '2025-12-29 14:42:10', 1),
(1199, 15, 'practice-tinh-toan', '2025-12-29 14:42:10', '2025-12-29 14:42:12', 2),
(1200, 15, 'compare-so-sanh', '2025-12-29 14:42:12', '2025-12-29 14:42:12', 0),
(1201, 15, 'compare-xep-so', '2025-12-29 14:42:12', '2025-12-29 14:42:17', 5),
(1202, 15, 'practice-nhan-ngon', '2025-12-29 14:42:13', '2025-12-29 14:42:13', 0),
(1203, 15, 'practice-tinh-toan', '2025-12-29 14:42:13', '2025-12-29 14:42:14', 1),
(1204, 15, 'compare-so-sanh', '2025-12-29 14:42:14', '2025-12-29 14:42:14', 0),
(1205, 15, 'compare-xep-so', '2025-12-29 14:42:14', '2025-12-29 14:42:17', 3),
(1206, 15, 'home', '2025-12-29 14:42:17', '2025-12-29 14:42:19', 2),
(1207, 15, 'digits-hoc-so', '2025-12-29 14:42:19', '2025-12-29 14:42:24', 5),
(1208, 15, 'digits-hoc-so', '2025-12-29 14:42:20', '2025-12-29 14:42:24', 4),
(1209, 15, 'digits-ghep-so', '2025-12-29 14:42:24', '2025-12-29 14:42:25', 1),
(1210, 15, 'digits-ghep-so', '2025-12-29 14:42:24', '2025-12-29 14:42:25', 1),
(1211, 15, 'digits-chan-le', '2025-12-29 14:42:25', '2025-12-29 14:42:25', 0),
(1212, 15, 'digits-chan-le', '2025-12-29 14:42:25', '2025-12-29 14:42:25', 0),
(1213, 15, 'digits-dem-so', '2025-12-29 14:42:25', '2025-12-29 14:42:29', 4),
(1214, 15, 'digits-dem-so', '2025-12-29 14:42:25', '2025-12-29 14:42:29', 4),
(1215, 15, 'practice-viet-so', '2025-12-29 14:42:29', '2025-12-29 14:43:09', 40),
(1216, 15, 'learning', '2025-12-29 14:43:09', '2025-12-29 14:43:11', 2),
(1217, 15, 'about-us', '2025-12-29 14:43:11', '2025-12-29 14:43:11', 0),
(1218, 15, 'users', '2025-12-29 14:43:11', NULL, 0),
(1219, 15, 'home', '2025-12-29 14:43:48', NULL, 0),
(1220, 15, 'home', '2025-12-29 14:44:31', NULL, 0),
(1221, 15, 'home', '2025-12-29 14:47:57', NULL, 0),
(1222, 14, 'home', '2025-12-29 14:48:39', '2025-12-29 14:48:47', 8),
(1223, 14, 'users', '2025-12-29 14:48:47', '2025-12-29 14:49:07', 20),
(1224, 14, 'home', '2025-12-29 14:49:07', NULL, 0),
(1225, 14, 'home', '2025-12-29 15:07:28', '2025-12-29 15:07:30', 2),
(1226, 14, 'learning', '2025-12-29 15:07:30', NULL, 0),
(1227, 14, 'home', '2025-12-29 15:08:04', '2025-12-29 15:08:14', 10),
(1228, 14, 'about-us', '2025-12-29 15:08:14', '2025-12-29 15:08:49', 35),
(1229, 14, 'learning', '2025-12-29 15:08:49', NULL, 0),
(1230, 14, 'home', '2025-12-29 15:08:51', '2025-12-29 15:08:52', 1),
(1231, 14, 'learning', '2025-12-29 15:08:52', NULL, 0),
(1232, 14, 'home', '2025-12-29 15:10:58', NULL, 0),
(1233, 14, 'home', '2025-12-29 15:11:44', '2025-12-29 15:12:47', 63),
(1234, 14, 'learning', '2025-12-29 15:12:47', NULL, 0),
(1235, 14, 'home', '2025-12-29 15:14:26', '2025-12-29 15:14:59', 33),
(1236, 14, 'learning', '2025-12-29 15:14:59', '2025-12-29 15:18:03', 184),
(1237, 14, 'users', '2025-12-29 15:18:03', '2025-12-29 15:18:11', 8),
(1238, 14, 'practice-tinh-toan', '2025-12-29 15:18:11', '2025-12-29 15:18:11', 0),
(1239, 14, 'practice-tinh-toan', '2025-12-29 15:18:11', '2025-12-29 15:18:11', 0),
(1240, 14, 'practice-nhan-ngon', '2025-12-29 15:18:11', '2025-12-29 15:18:13', 2),
(1241, 14, 'practice-nhan-ngon', '2025-12-29 15:18:11', '2025-12-29 15:18:13', 2),
(1242, 14, 'practice-viet-so', '2025-12-29 15:18:13', '2025-12-29 15:18:17', 4),
(1243, 14, 'home', '2025-12-29 15:18:17', '2025-12-29 15:18:36', 19),
(1244, 14, 'digits-hoc-so', '2025-12-29 15:18:36', '2025-12-29 15:18:37', 1),
(1245, 14, 'digits-hoc-so', '2025-12-29 15:18:36', '2025-12-29 15:18:37', 1),
(1246, 14, 'digits-ghep-so', '2025-12-29 15:18:37', '2025-12-29 15:18:39', 2),
(1247, 14, 'digits-ghep-so', '2025-12-29 15:18:37', '2025-12-29 15:18:39', 2),
(1248, 14, 'digits-chan-le', '2025-12-29 15:18:39', '2025-12-29 15:18:40', 1),
(1249, 14, 'digits-chan-le', '2025-12-29 15:18:39', '2025-12-29 15:18:40', 1),
(1250, 14, 'digits-dem-so', '2025-12-29 15:18:40', '2025-12-29 15:18:48', 8),
(1251, 14, 'digits-dem-so', '2025-12-29 15:18:40', '2025-12-29 15:18:48', 8),
(1252, 14, 'home', '2025-12-29 15:18:48', NULL, 0),
(1253, 14, 'home', '2025-12-29 15:18:52', NULL, 0),
(1254, 14, 'home', '2025-12-29 15:19:37', NULL, 0),
(1255, 14, 'home', '2025-12-29 15:20:13', '2025-12-29 15:20:15', 2),
(1256, 14, 'learning', '2025-12-29 15:20:15', NULL, 0),
(1257, 14, 'home', '2025-12-29 15:21:15', '2025-12-29 15:21:18', 3),
(1258, 14, 'learning', '2025-12-29 15:21:18', NULL, 0),
(1259, 14, 'home', '2025-12-29 15:22:42', '2025-12-29 15:22:43', 1),
(1260, 14, 'learning', '2025-12-29 15:22:43', NULL, 0),
(1261, 14, 'home', '2025-12-29 15:23:12', '2025-12-29 15:23:14', 2),
(1262, 14, 'learning', '2025-12-29 15:23:14', NULL, 0),
(1263, 14, 'home', '2025-12-29 15:23:57', '2025-12-29 15:24:13', 16),
(1264, 14, 'learning', '2025-12-29 15:24:13', NULL, 0),
(1265, 14, 'home', '2025-12-29 15:24:17', '2025-12-29 15:24:40', 23),
(1266, 14, 'learning', '2025-12-29 15:24:40', NULL, 0),
(1267, 14, 'home', '2025-12-29 15:28:01', '2025-12-29 15:28:18', 17),
(1268, 14, 'learning', '2025-12-29 15:28:18', NULL, 0),
(1269, 14, 'home', '2025-12-29 15:28:58', '2025-12-29 15:29:48', 50),
(1270, 14, 'learning', '2025-12-29 15:29:48', NULL, 0),
(1271, 14, 'home', '2025-12-29 15:29:51', '2025-12-29 15:29:52', 1),
(1272, 14, 'learning', '2025-12-29 15:29:52', NULL, 0),
(1273, 14, 'home', '2025-12-29 15:30:28', '2025-12-29 15:30:42', 14),
(1274, 14, 'learning', '2025-12-29 15:30:42', NULL, 0),
(1275, 14, 'home', '2025-12-29 15:35:48', NULL, 0);

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
  `parent_pin` varchar(4) DEFAULT '1234',
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `avatar_url`, `role`, `email`, `phone`, `created_at`, `updated_at`, `parent_pin`, `dob`) VALUES
(1, 'hocsinh', '$2b$10$v5azKoY72NP7kEgXRfaM9.cy46WUX1dO74j9qi5ZjVrxeixgvxPTe', 'Bé Bi (5 tuổi)', 'default_avatar.png', 'student', 'huydo24012005@gmail.com', NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234', NULL),
(3, 'phuhuynh', '$2b$10$WcMPCXqpTYS/UpXidIQixewG9OWGQM2NFJGfpVl0/hVFF/mN5xPqC', 'M??? B?? Bi', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234', NULL),
(4, 'admin', '$2b$10$6gimmH66k6q/2.iMeU9ZlOxi7HqRf9YZQNQZEf.1qmbnoJk0P8rrC', 'Qu???n Tr??? Vi??n', 'default_avatar.png', 'admin', NULL, NULL, '2025-12-21 03:02:50', '2025-12-21 03:02:50', '1234', NULL),
(5, 'st_Nam', '$2b$10$yt8b.u5sYFzDR0GGz0vtE.Bqu.9eUACgZ1ysXRgEAia11HyEhDDem', 'Be Nam', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:00:42', '2025-12-21 14:00:42', '1234', NULL),
(6, 'st_Trung', '$2b$10$W/k6FfVrTR4WA5JvBmL6nuGDHUJLuHdYKBG0HSi7wuHcX3Ln59nqS', 'Be Phan Cong Trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:23:25', '2025-12-21 14:23:25', '1234', NULL),
(7, 'st_Huy', '$2b$10$kbHjo/vL8QtmoAFDjJkF8.36YCyU2uOmBGS8xW9y9zsQwznVhK.C.', 'Be Nguyen Quang Huy', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:27:52', '2025-12-21 14:27:52', '1234', NULL),
(8, 'hocsinhmoi-trung', '$2b$10$skF1nzhPsQrKo/WFcgRc..SZXnktlMOLdxMoOIM0Y5TWKGD2ceZLa', 'trung', 'default_avatar.png', 'student', NULL, NULL, '2025-12-21 14:32:24', '2025-12-21 14:32:24', '1234', NULL),
(9, 'phuhuynhmoi-Hieu', '$2b$10$CtaARUkSwu3FXk7zclfMceo9cWlR5GNbUZJh915dr69K2BhnDkN1W', 'Hieu', 'default_avatar.png', 'parent', NULL, NULL, '2025-12-21 14:57:28', '2025-12-21 14:57:28', '1234', NULL),
(10, '123', '$2b$10$VtUHskxPMwucyntQX4d9WuRE20kYfabO1Dr4tnidNmWRwznNbi.uy', 'hocsinhmoi-Linh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:13:55', '2025-12-22 21:13:55', '1234', NULL),
(11, 'st_Lunh', '$2b$10$xdTLWBAf2AMTZlm72aOuS.UAUmiBmLyDTlIvS0Sghifcg7wluZ9oq', 'Lunh', 'default_avatar.png', 'student', NULL, NULL, '2025-12-22 21:15:31', '2025-12-22 21:15:31', '1234', NULL),
(12, 'giaovien', '$2b$10$nmqnLZyesfEirZAnhV4xOuM.XfKuiP4Dn03/x.HmuLCCFxEsW8yx2', 'behui 20tui', 'default_avatar.png', 'student', NULL, NULL, '2025-12-27 16:29:06', NULL, '1234', NULL),
(13, 'trungngu', '$2b$10$AlimLrfleNIdtGslfScDguSaniTkTVzfIWk.WvJ29imTn5T92Dp7O', 'trung ngu', 'default_avatar.png', 'student', NULL, NULL, '2025-12-27 21:38:41', NULL, '1234', NULL),
(14, 'betrungnghean', '$2b$10$Y9DWHpRJRC04sJixBYffn.2TwpP90sBoJcynmMAUd1stsQ7bGy.7y', 'Bé Trung', 'default_avatar.png', 'student', 'hhhh@gmail.com', NULL, '2025-12-28 20:11:46', NULL, '0000', '2004-05-20'),
(15, 'behuythaibinh', '$2b$10$m94yA.2TYDIOkTu.RIvX2.UACQbc.ZJVYeN7iApV4qo9d6R.1IZg6', 'Bé Huy 20 tuổi', 'default_avatar.png', 'student', 'huydo2401@gmail.com', NULL, '2025-12-28 21:28:53', NULL, '5555', '2005-01-21'),
(16, 'huymatlon', '$2b$10$Nws5.1Hqn6GH2vZhgcDfNuI8GXOrkS3ZKEl.hqyMQxZGQmU/Xp58K', 'Phan Công Trung', 'default_avatar.png', 'student', 'Trung.PC233683@sis.hust.edu.vn', NULL, '2025-12-29 17:01:51', NULL, '2810', '2005-10-28');

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
-- Indexes for table `learning_goals`
--
ALTER TABLE `learning_goals`
  ADD PRIMARY KEY (`goal_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `exercise_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_achievements`
--
ALTER TABLE `game_achievements`
  MODIFY `achievement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT for table `learning_goals`
--
ALTER TABLE `learning_goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `study_sessions`
--
ALTER TABLE `study_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1276;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
