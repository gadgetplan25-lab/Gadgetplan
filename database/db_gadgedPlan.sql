-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for toko_online
CREATE DATABASE IF NOT EXISTS `toko_online` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `toko_online`;

-- Dumping structure for table toko_online.blogs
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `author_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `blogs_slug` (`slug`),
  KEY `blogs_author_id` (`author_id`),
  KEY `blogs_created_at` (`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.blogs: ~8 rows (approximately)
INSERT INTO `blogs` (`id`, `title`, `slug`, `banner_image`, `author_id`, `createdAt`, `updatedAt`) VALUES
	(19, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia', '/uploads/1759681467999-497833627.jpeg', 1, '2025-10-05 16:24:28', '2025-10-05 16:24:28'),
	(20, ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', 'iphone-17-series-dan-iphone-air-akan-segera-masuk-ke-indonesia-dan-akan-segera-tersedia-di-ibox-setelah-memenuhi-persyaratan-tkdn-dan-izin-edar-dari-kemenperin-dan-kominfo', '/uploads/1759681681141-701559882.png', 1, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(22, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 222', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-222', '/uploads/1759681810143-488423068.png', 1, '2025-10-05 16:30:10', '2025-10-05 16:30:10'),
	(23, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 1', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-1', '/uploads/1759681859658-297196883.png', 1, '2025-10-05 16:30:59', '2025-10-05 16:30:59'),
	(24, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 2', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-2', '/uploads/1759681947175-254473368.png', 1, '2025-10-05 16:32:27', '2025-10-05 16:32:27'),
	(25, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 4', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-4', '/uploads/1759681985960-493249693.png', 1, '2025-10-05 16:33:05', '2025-10-05 16:33:05'),
	(26, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 5', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-5', '/uploads/1759682019484-521229499.jpeg', 1, '2025-10-05 16:33:39', '2025-10-05 16:33:39'),
	(27, 'Apple Dipastikan Segera Rilis iPhone 17 Series di Indonesia 7', 'apple-dipastikan-segera-rilis-iphone-17-series-di-indonesia-7', '/uploads/1759682154660-426740440.png', 1, '2025-10-05 16:35:54', '2025-10-05 16:35:54');

-- Dumping structure for table toko_online.blog_contents
CREATE TABLE IF NOT EXISTS `blog_contents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` int NOT NULL,
  `type` enum('text','image') COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_contents_blog_id` (`blog_id`),
  KEY `blog_contents_position` (`position`),
  CONSTRAINT `blog_contents_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.blog_contents: ~29 rows (approximately)
INSERT INTO `blog_contents` (`id`, `blog_id`, `type`, `content`, `image_url`, `position`, `createdAt`, `updatedAt`) VALUES
	(31, 19, 'text', 'Selain memastikan kehadiran iPhone 17 series, beberapa distributor Apple juga membuka pendaftaran minat bagi konsumen lewat situs resmi perusahaan.\n\nBaca Juga: iPhone 17 Pro Max Cocok untuk yang Suka Selfie, Ruang Penyimpanannya juga Luas\n\nKonsumen yang berminat bisa mendaftar dengan menyertakan nama dan e-mail, serta memilih model produk yang diinginkan, apakah iPhone 17, iPhone 17 Air, iPhone 17 Pro dan iPhone 17 Pro Max.\n\nKonsumen juga perlu menentukan opsi penyimpanan serta warna iPhone yang dipilih.\n\nPantauan KompasTekno, iPhone 17 hadir dalam dua opsi storage, yaitu 256 GB dan 512 GB. iPhone 17 Air dan iPhone 17 Pro juga ditawarkan dalam kapasitas yang sama, disertai tambahan opsi 1 TB. Sementara itu model', NULL, 1, '2025-10-05 16:24:28', '2025-10-05 16:24:28'),
	(32, 19, 'image', NULL, '/uploads/1759681468010-104170401.png', 2, '2025-10-05 16:24:28', '2025-10-05 16:24:28'),
	(33, 19, 'text', '\n\nArtikel ini telah tayang di Kompas.com dengan judul "iPhone 17 Series Dipastikan Rilis di Indonesia Segera", Klik untuk baca: https://tekno.kompas.com/read/2025/10/03/14141447/iphone-17-series-dipastikan-rilis-di-indonesia-segera.\n\n\nKompascom+ baca berita tanpa iklan: https://kmp.im/plus6\nDownload aplikasi: https://kmp.im/app6', NULL, 3, '2025-10-05 16:24:28', '2025-10-05 16:24:28'),
	(34, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 1, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(35, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 2, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(36, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 3, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(37, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 4, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(38, 20, 'image', NULL, '/uploads/1759681681160-473836519.jpeg', 5, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(39, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 6, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(40, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 7, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(41, 20, 'text', ' iPhone 17 Series dan iPhone Air akan segera masuk ke Indonesia dan akan segera tersedia di iBox setelah memenuhi persyaratan TKDN dan izin edar dari Kemenperin dan Kominfo', NULL, 8, '2025-10-05 16:28:01', '2025-10-05 16:28:01'),
	(42, 22, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:30:10', '2025-10-05 16:30:10'),
	(43, 22, 'image', NULL, '/uploads/1759681810153-86082285.png', 2, '2025-10-05 16:30:10', '2025-10-05 16:30:10'),
	(44, 22, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:30:10', '2025-10-05 16:30:10'),
	(45, 23, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:30:59', '2025-10-05 16:30:59'),
	(46, 23, 'image', NULL, '/uploads/1759681859665-349859478.jpeg', 2, '2025-10-05 16:30:59', '2025-10-05 16:30:59'),
	(47, 23, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia\n\nApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia\n\n\nApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:30:59', '2025-10-05 16:30:59'),
	(48, 24, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia\n\n\n\n\nApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia\n\n\nApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:32:27', '2025-10-05 16:32:27'),
	(49, 24, 'image', NULL, '/uploads/1759681947180-427977497.jpeg', 2, '2025-10-05 16:32:27', '2025-10-05 16:32:27'),
	(50, 24, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:32:27', '2025-10-05 16:32:27'),
	(51, 25, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:33:06', '2025-10-05 16:33:06'),
	(52, 25, 'image', NULL, '/uploads/1759681985966-941055761.png', 2, '2025-10-05 16:33:06', '2025-10-05 16:33:06'),
	(53, 25, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:33:06', '2025-10-05 16:33:06'),
	(54, 26, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:33:39', '2025-10-05 16:33:39'),
	(55, 26, 'image', NULL, '/uploads/1759682019484-675385032.png', 2, '2025-10-05 16:33:39', '2025-10-05 16:33:39'),
	(56, 26, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:33:39', '2025-10-05 16:33:39'),
	(57, 27, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 1, '2025-10-05 16:35:54', '2025-10-05 16:35:54'),
	(58, 27, 'image', NULL, '/uploads/1759682154676-413642246.jpeg', 2, '2025-10-05 16:35:54', '2025-10-05 16:35:54'),
	(59, 27, 'text', 'Apple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di IndonesiaApple Dipastikan Segera Rilis iPhone 17 Series di Indonesia', NULL, 3, '2025-10-05 16:35:54', '2025-10-05 16:35:54');

-- Dumping structure for table toko_online.bookingpayments
CREATE TABLE IF NOT EXISTS `bookingpayments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_status` enum('pending','success','failed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `transaction_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `booking_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `bookingpayments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.bookingpayments: ~18 rows (approximately)
INSERT INTO `bookingpayments` (`id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `createdAt`, `updatedAt`, `booking_id`) VALUES
	(1, 80000, 'qris', 'pending', NULL, '2025-09-08 18:13:09', '2025-09-08 18:13:09', NULL),
	(2, 80000, 'qris', 'pending', NULL, '2025-09-08 18:22:51', '2025-09-08 18:22:51', NULL),
	(3, 80000, 'qris', 'pending', '68bf3c4bdf0fb675f9cb6163', '2025-09-08 20:27:56', '2025-09-08 20:27:56', NULL),
	(4, 80000, 'qris', 'pending', '68bf3d35df0fb675f9cb629e', '2025-09-08 20:31:50', '2025-09-08 20:31:50', NULL),
	(5, 80000, 'qris', 'pending', '68c024fa608081379787c6ce', '2025-09-09 13:00:44', '2025-09-09 13:00:44', NULL),
	(6, 80000, 'qris', 'pending', '68c025addf0fb675f9cc73a7', '2025-09-09 13:03:41', '2025-09-09 13:03:41', NULL),
	(7, 40000, 'qris', 'pending', '68c028efdf0fb675f9cc76d0', '2025-09-09 13:17:36', '2025-09-09 13:17:36', NULL),
	(8, 40000, 'qris', 'pending', '68c02974608081379787caf8', '2025-09-09 13:19:49', '2025-09-09 13:19:49', NULL),
	(9, 40000, 'qris', 'pending', '68c02a39df0fb675f9cc781a', '2025-09-09 13:23:06', '2025-09-09 13:23:06', NULL),
	(10, 40000, 'qris', 'success', '68c02b77608081379787ccf1', '2025-09-09 13:28:23', '2025-09-09 13:28:54', NULL),
	(11, 40000, 'qris', 'success', '68c038ab608081379787dd10', '2025-09-09 14:24:44', '2025-09-09 14:25:19', NULL),
	(12, 40000, 'qris', 'success', '68c03a1edf0fb675f9cc8b78', '2025-09-09 14:30:55', '2025-09-09 14:31:30', NULL),
	(13, 40000, 'qris', 'success', '68c03b29608081379787dfa6', '2025-09-09 14:35:22', '2025-09-09 14:36:12', NULL),
	(14, 40000, 'qris', 'success', '68c03e37df0fb675f9cc8fb9', '2025-09-09 14:48:24', '2025-09-09 14:49:08', NULL),
	(15, 40000, 'BNI', 'success', '68c04412df0fb675f9cc99f7', '2025-09-09 15:13:22', '2025-09-09 15:14:51', NULL),
	(16, 40000, 'qris', 'pending', '68d95feaebedfc79f5e1a662', '2025-09-28 16:18:51', '2025-09-28 16:18:51', NULL),
	(17, 40000, 'qris', 'pending', '68da28d1ebedfc79f5e36019', '2025-09-29 06:36:02', '2025-09-29 06:36:02', NULL),
	(18, 75000, 'qris', 'pending', '68da2929e7146903d226dd03', '2025-09-29 06:37:30', '2025-09-29 06:37:30', NULL),
	(19, 40000, 'qris', 'pending', '68dcd03feb65ed36ad24896d', '2025-10-01 06:54:57', '2025-10-01 06:54:57', NULL),
	(20, 40000, 'qris', 'pending', '68e008bc3184fbfd30e90e25', '2025-10-03 17:32:48', '2025-10-03 17:32:48', NULL),
	(21, 40000, 'qris', 'pending', '68e00c693184fbfd30e910b9', '2025-10-03 17:48:29', '2025-10-03 17:48:29', NULL),
	(22, 40000, 'qris', 'pending', '68e123e83184fbfd30ea0980', '2025-10-04 13:40:58', '2025-10-04 13:40:58', NULL),
	(23, 40000, 'qris', 'pending', '68e12c453184fbfd30ea135e', '2025-10-04 14:16:39', '2025-10-04 14:16:39', 35),
	(24, 150000, 'qris', 'pending', '68e5664e43f0668d90d36320', '2025-10-07 19:13:18', '2025-10-07 19:13:18', 36),
	(25, 265000, 'qris', 'pending', '68e7938f7b7d2caa6c9b0644', '2025-10-09 10:50:56', '2025-10-09 10:50:56', 37),
	(26, 75000, 'qris', 'pending', '68f9020e1ceec1c767120bc6', '2025-10-22 16:10:57', '2025-10-22 16:10:57', 38);

-- Dumping structure for table toko_online.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_date` date NOT NULL,
  `service_time` time NOT NULL,
  `jenis_perangkat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `model_perangkat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` enum('pending','confirmed','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  `technician_id` int DEFAULT NULL,
  `serviceType_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `technician_id` (`technician_id`),
  KEY `serviceType_id` (`serviceType_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `technicians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`serviceType_id`) REFERENCES `service_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.bookings: ~0 rows (approximately)
INSERT INTO `bookings` (`id`, `service_date`, `service_time`, `jenis_perangkat`, `model_perangkat`, `status`, `createdAt`, `updatedAt`, `user_id`, `technician_id`, `serviceType_id`) VALUES
	(35, '2025-10-04', '12:00:00', 'iphone', '12 pro max', 'pending', '2025-10-04 14:16:37', '2025-10-04 14:16:37', 14, 1, 1),
	(36, '2025-10-08', '09:00:00', 'macbook', 's pro', 'pending', '2025-10-07 19:13:17', '2025-10-07 19:13:17', 14, 2, 6),
	(37, '2025-10-09', '12:00:00', 'aaaa', 'bbbbb', 'pending', '2025-10-09 10:50:55', '2025-10-09 10:50:55', 5, 1, 8),
	(38, '2025-10-23', '12:00:00', 'iphone', 'iphone 13 pro max', 'pending', '2025-10-22 16:10:56', '2025-10-22 16:10:56', 25, 1, 2);

-- Dumping structure for table toko_online.cartitems
CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL DEFAULT '1',
  `price` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `color_id` int NOT NULL,
  `storage_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_cartitem_color` (`color_id`),
  KEY `fk_cartitem_storage` (`storage_id`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_cartitem_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cartitem_storage` FOREIGN KEY (`storage_id`) REFERENCES `storages` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.cartitems: ~1 rows (approximately)
INSERT INTO `cartitems` (`id`, `quantity`, `price`, `createdAt`, `updatedAt`, `cart_id`, `product_id`, `color_id`, `storage_id`) VALUES
	(26, 3, 3000000, '2025-10-09 14:00:20', '2025-10-09 14:00:20', 5, 40, 1, 1);

-- Dumping structure for table toko_online.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('active','checked_out') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.carts: ~1 rows (approximately)
INSERT INTO `carts` (`id`, `status`, `createdAt`, `updatedAt`, `user_id`) VALUES
	(4, 'active', '2025-10-07 18:12:33', '2025-10-07 18:12:33', 14),
	(5, 'active', '2025-10-09 14:00:20', '2025-10-09 14:00:20', 20),
	(6, 'active', '2025-10-30 18:56:31', '2025-10-30 18:56:31', 25);

-- Dumping structure for table toko_online.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.categories: ~2 rows (approximately)
INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
	(1, 'Iphone', 'phone generasi terbaru', '2025-09-08 17:30:39', '2025-10-05 16:13:00'),
	(2, 'Charger', 'Ugreen', '2025-09-08 17:31:15', '2025-09-08 17:31:15'),
	(3, 'aksesoris', 'coba coba coba', '2025-09-17 19:46:37', '2025-09-17 19:47:11'),
	(5, 'macBook', 'bagus', '2025-10-05 15:20:52', '2025-10-05 16:08:36');

-- Dumping structure for table toko_online.colors
CREATE TABLE IF NOT EXISTS `colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.colors: ~0 rows (approximately)
INSERT INTO `colors` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
	(1, 'putih', '2025-10-01 20:55:20', '2025-10-01 20:55:20'),
	(2, 'hitam', '2025-10-03 16:01:02', '2025-10-03 16:01:02');

-- Dumping structure for table toko_online.devices
CREATE TABLE IF NOT EXISTS `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deviceId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastUsed` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.devices: ~8 rows (approximately)
INSERT INTO `devices` (`id`, `deviceId`, `lastUsed`, `createdAt`, `updatedAt`, `userId`) VALUES
	(1, 'PostmanRuntime/7.46.0_::1', '2025-09-17 16:31:32', '2025-09-12 15:12:28', '2025-09-17 16:31:32', 5),
	(2, 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36_::1', '2025-09-14 12:14:54', '2025-09-12 18:33:04', '2025-09-14 12:14:54', 5),
	(3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36_::1', '2025-09-14 11:58:53', '2025-09-12 18:37:05', '2025-09-14 11:58:53', 5),
	(4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36_::1', '2025-09-16 13:41:23', '2025-09-16 13:41:05', '2025-09-16 13:41:23', 14),
	(5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-10-09 14:12:07', '2025-09-17 15:47:42', '2025-10-09 14:12:07', 5),
	(6, 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36_::1', '2025-09-26 11:50:56', '2025-09-17 16:21:02', '2025-09-26 11:50:56', 5),
	(7, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-10-09 11:01:04', '2025-09-18 11:15:02', '2025-10-09 11:01:04', 14),
	(8, 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36_::1', '2025-09-30 09:23:40', '2025-09-18 12:59:00', '2025-09-30 09:23:40', 15),
	(9, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-09-18 13:01:12', '2025-09-18 13:00:24', '2025-09-18 13:01:12', 15),
	(10, 'PostmanRuntime/7.46.1_::1', '2025-09-23 14:39:55', '2025-09-23 14:38:38', '2025-09-23 14:39:55', 5),
	(11, 'PostmanRuntime/7.47.1_::1', '2025-09-26 12:16:39', '2025-09-26 12:11:46', '2025-09-26 12:16:39', 15),
	(12, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-10-06 13:12:49', '2025-10-06 11:36:02', '2025-10-06 13:12:49', 18),
	(13, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-10-09 13:42:01', '2025-10-09 13:40:41', '2025-10-09 13:42:01', 19),
	(14, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36_::1', '2025-10-09 13:55:20', '2025-10-09 13:54:41', '2025-10-09 13:55:20', 20),
	(15, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36_::1', '2025-10-22 16:08:56', '2025-10-17 16:28:18', '2025-10-22 16:08:56', 15),
	(16, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36_::1', '2025-10-30 20:01:31', '2025-10-20 18:42:17', '2025-10-30 20:01:31', 25),
	(17, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36_::1', '2025-11-14 20:47:51', '2025-11-14 17:18:00', '2025-11-14 20:47:51', 25),
	(18, 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36_::1', '2025-11-14 21:36:24', '2025-11-14 21:15:47', '2025-11-14 21:36:24', 25);

-- Dumping structure for table toko_online.orderitems
CREATE TABLE IF NOT EXISTS `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `price` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `color_id` int DEFAULT NULL,
  `storage_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `fk_orderitem_color` (`color_id`),
  KEY `fk_orderitem_storage` (`storage_id`),
  CONSTRAINT `fk_orderitem_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitem_storage` FOREIGN KEY (`storage_id`) REFERENCES `storages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.orderitems: ~33 rows (approximately)
INSERT INTO `orderitems` (`id`, `quantity`, `price`, `createdAt`, `updatedAt`, `order_id`, `product_id`, `color_id`, `storage_id`) VALUES
	(49, 1, 6000000, '2025-10-05 17:15:39', '2025-10-05 17:15:39', 47, 38, 1, 2),
	(50, 1, 6000000, '2025-10-06 12:56:18', '2025-10-06 12:56:18', 48, 38, 1, 2),
	(51, 1, 3000000, '2025-10-07 16:34:21', '2025-10-07 16:34:21', 49, 40, 1, 1),
	(52, 1, 3000000, '2025-10-07 17:53:40', '2025-10-07 17:53:40', 50, 45, 2, 1),
	(53, 2, 4500000, '2025-10-07 18:03:32', '2025-10-07 18:03:32', 51, 42, NULL, NULL),
	(54, 1, 23000000, '2025-10-07 18:03:32', '2025-10-07 18:03:32', 51, 43, NULL, NULL),
	(55, 1, 4500000, '2025-10-07 18:10:15', '2025-10-07 18:10:15', 52, 42, NULL, NULL),
	(56, 1, 4000000, '2025-10-07 18:10:15', '2025-10-07 18:10:15', 52, 49, NULL, NULL),
	(57, 1, 4500000, '2025-10-07 18:11:16', '2025-10-07 18:11:16', 53, 44, NULL, NULL),
	(58, 1, 4500000, '2025-10-07 18:12:52', '2025-10-07 18:12:52', 54, 44, NULL, NULL),
	(59, 1, 15000000, '2025-10-07 18:14:17', '2025-10-07 18:14:17', 55, 41, NULL, NULL),
	(60, 1, 3000000, '2025-10-07 18:18:48', '2025-10-07 18:18:48', 56, 40, NULL, NULL),
	(61, 1, 23000000, '2025-10-07 18:29:37', '2025-10-07 18:29:37', 57, 43, NULL, NULL),
	(62, 1, 3000000, '2025-10-07 19:15:32', '2025-10-07 19:15:32', 58, 40, 1, 1),
	(63, 1, 6000000, '2025-10-07 19:16:37', '2025-10-07 19:16:37', 59, 38, 1, 1),
	(64, 1, 23000000, '2025-10-07 19:20:29', '2025-10-07 19:20:29', 60, 43, 2, 2),
	(65, 1, 23000000, '2025-10-07 19:23:07', '2025-10-07 19:23:07', 61, 43, NULL, NULL),
	(66, 1, 3000000, '2025-10-09 13:46:45', '2025-10-09 13:46:45', 62, 40, 1, 1),
	(67, 1, 3000000, '2025-10-17 16:30:40', '2025-10-17 16:30:40', 63, 40, 1, 1),
	(68, 1, 3000000, '2025-10-30 19:17:58', '2025-10-30 19:17:58', 64, 40, 1, 1),
	(69, 1, 4500000, '2025-10-30 19:19:15', '2025-10-30 19:19:15', 65, 44, 2, 1),
	(70, 1, 4500000, '2025-10-30 19:22:58', '2025-10-30 19:22:58', 66, 44, 2, 1),
	(71, 1, 4500000, '2025-10-30 19:23:11', '2025-10-30 19:23:11', 67, 44, 2, 1),
	(72, 1, 4500000, '2025-10-30 19:23:14', '2025-10-30 19:23:14', 68, 44, 2, 1),
	(73, 1, 4500000, '2025-10-30 19:23:59', '2025-10-30 19:23:59', 69, 44, 2, 1),
	(74, 1, 4500000, '2025-10-30 19:26:45', '2025-10-30 19:26:45', 70, 42, 1, 1),
	(75, 1, 23000000, '2025-10-30 19:32:39', '2025-10-30 19:32:39', 71, 43, 2, 2),
	(76, 1, 15000000, '2025-11-03 12:37:05', '2025-11-03 12:37:05', 72, 41, 1, 1),
	(77, 1, 4500000, '2025-11-10 14:55:53', '2025-11-10 14:55:53', 73, 44, 2, 1),
	(78, 1, 4500000, '2025-11-10 14:56:00', '2025-11-10 14:56:00', 74, 44, 2, 1),
	(79, 1, 4500000, '2025-11-10 14:56:40', '2025-11-10 14:56:40', 75, 44, 2, 1),
	(80, 1, 4500000, '2025-11-10 14:57:22', '2025-11-10 14:57:22', 76, 44, 2, 1),
	(81, 1, 4500000, '2025-11-10 15:18:25', '2025-11-10 15:18:25', 77, 44, 2, 1),
	(82, 1, 4500000, '2025-11-10 15:22:29', '2025-11-10 15:22:29', 78, 44, 2, 1),
	(83, 1, 4000000, '2025-11-10 21:33:01', '2025-11-10 21:33:01', 79, 49, NULL, NULL),
	(84, 1, 4000000, '2025-11-10 21:45:27', '2025-11-10 21:45:27', 80, 49, NULL, NULL),
	(85, 1, 4000000, '2025-11-14 21:41:29', '2025-11-14 21:41:29', 81, 49, 1, 2);

-- Dumping structure for table toko_online.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('pending','paid','shipped','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `total_price` float NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.orders: ~30 rows (approximately)
INSERT INTO `orders` (`id`, `status`, `total_price`, `created_at`, `createdAt`, `updatedAt`, `user_id`) VALUES
	(47, 'pending', 6000000, '2025-10-05 17:15:39', '2025-10-05 17:15:39', '2025-10-05 17:15:39', 5),
	(48, 'pending', 6000000, '2025-10-06 12:56:18', '2025-10-06 12:56:18', '2025-10-06 12:56:18', 18),
	(49, 'pending', 3000000, '2025-10-07 16:34:21', '2025-10-07 16:34:21', '2025-10-07 16:34:21', 14),
	(50, 'pending', 3000000, '2025-10-07 17:53:40', '2025-10-07 17:53:40', '2025-10-07 17:53:40', 14),
	(51, 'pending', 32000000, '2025-10-07 18:03:32', '2025-10-07 18:03:32', '2025-10-07 18:03:32', 14),
	(52, 'pending', 8500000, '2025-10-07 18:10:15', '2025-10-07 18:10:15', '2025-10-07 18:10:15', 14),
	(53, 'pending', 4500000, '2025-10-07 18:11:16', '2025-10-07 18:11:16', '2025-10-07 18:11:16', 14),
	(54, 'pending', 4500000, '2025-10-07 18:12:52', '2025-10-07 18:12:52', '2025-10-07 18:12:52', 14),
	(55, 'pending', 15000000, '2025-10-07 18:14:17', '2025-10-07 18:14:17', '2025-10-07 18:14:17', 14),
	(56, 'pending', 3000000, '2025-10-07 18:18:48', '2025-10-07 18:18:48', '2025-10-07 18:18:48', 14),
	(57, 'pending', 23000000, '2025-10-07 18:29:37', '2025-10-07 18:29:37', '2025-10-07 18:29:37', 14),
	(58, 'pending', 3000000, '2025-10-07 19:15:32', '2025-10-07 19:15:32', '2025-10-07 19:15:32', 14),
	(59, 'pending', 6000000, '2025-10-07 19:16:37', '2025-10-07 19:16:37', '2025-10-07 19:16:37', 14),
	(60, 'pending', 23000000, '2025-10-07 19:20:29', '2025-10-07 19:20:29', '2025-10-07 19:20:29', 14),
	(61, 'pending', 23000000, '2025-10-07 19:23:07', '2025-10-07 19:23:07', '2025-10-07 19:23:07', 14),
	(62, 'pending', 3000000, '2025-10-09 13:46:45', '2025-10-09 13:46:45', '2025-10-09 13:46:45', 19),
	(63, 'pending', 3000000, '2025-10-17 16:30:40', '2025-10-17 16:30:40', '2025-10-17 16:30:40', 15),
	(64, 'pending', 3000000, '2025-10-30 19:17:58', '2025-10-30 19:17:58', '2025-10-30 19:17:58', 25),
	(65, 'pending', 4500000, '2025-10-30 19:19:15', '2025-10-30 19:19:15', '2025-10-30 19:19:15', 25),
	(66, 'pending', 4500000, '2025-10-30 19:22:58', '2025-10-30 19:22:58', '2025-10-30 19:22:58', 25),
	(67, 'pending', 4500000, '2025-10-30 19:23:11', '2025-10-30 19:23:11', '2025-10-30 19:23:11', 25),
	(68, 'pending', 4500000, '2025-10-30 19:23:14', '2025-10-30 19:23:14', '2025-10-30 19:23:14', 25),
	(69, 'pending', 4500000, '2025-10-30 19:23:59', '2025-10-30 19:23:59', '2025-10-30 19:23:59', 25),
	(70, 'pending', 4500000, '2025-10-30 19:26:45', '2025-10-30 19:26:45', '2025-10-30 19:26:45', 25),
	(71, 'pending', 23000000, '2025-10-30 19:32:39', '2025-10-30 19:32:39', '2025-10-30 19:32:39', 25),
	(72, 'pending', 15000000, '2025-11-03 12:37:05', '2025-11-03 12:37:05', '2025-11-03 12:37:05', 25),
	(73, 'pending', 4500000, '2025-11-10 14:55:53', '2025-11-10 14:55:53', '2025-11-10 14:55:53', 25),
	(74, 'pending', 4500000, '2025-11-10 14:56:00', '2025-11-10 14:56:00', '2025-11-10 14:56:00', 25),
	(75, 'pending', 4500000, '2025-11-10 14:56:40', '2025-11-10 14:56:40', '2025-11-10 14:56:40', 25),
	(76, 'pending', 4500000, '2025-11-10 14:57:22', '2025-11-10 14:57:22', '2025-11-10 14:57:22', 25),
	(77, 'pending', 4510000, '2025-11-10 15:18:25', '2025-11-10 15:18:25', '2025-11-10 15:18:25', 25),
	(78, 'pending', 4510000, '2025-11-10 15:22:29', '2025-11-10 15:22:29', '2025-11-10 15:22:29', 25),
	(79, 'pending', 4000000, '2025-11-10 21:33:00', '2025-11-10 21:33:00', '2025-11-10 21:33:00', 25),
	(80, 'pending', 4010000, '2025-11-10 21:45:27', '2025-11-10 21:45:27', '2025-11-10 21:45:27', 25),
	(81, 'pending', 4010000, '2025-11-14 21:41:29', '2025-11-14 21:41:29', '2025-11-14 21:41:29', 25);

-- Dumping structure for table toko_online.otps
CREATE TABLE IF NOT EXISTS `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `type` enum('register','login') COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.otps: ~19 rows (approximately)
INSERT INTO `otps` (`id`, `code`, `expiresAt`, `type`, `createdAt`, `updatedAt`, `userId`) VALUES
	(5, '366293', '2025-09-12 18:02:32', 'login', '2025-09-12 17:57:32', '2025-09-12 17:57:32', 5),
	(6, '761705', '2025-09-12 18:06:06', 'login', '2025-09-12 18:01:06', '2025-09-12 18:01:06', 5),
	(7, '196348', '2025-09-12 18:08:59', 'login', '2025-09-12 18:03:59', '2025-09-12 18:03:59', 5),
	(8, '612144', '2025-09-12 18:12:19', 'login', '2025-09-12 18:07:19', '2025-09-12 18:07:19', 5),
	(9, '307562', '2025-09-12 18:19:59', 'login', '2025-09-12 18:14:59', '2025-09-12 18:14:59', 5),
	(10, '883268', '2025-09-12 18:25:29', 'login', '2025-09-12 18:20:29', '2025-09-12 18:20:29', 5),
	(23, '648181', '2025-09-16 13:54:05', 'login', '2025-09-16 13:49:05', '2025-09-16 13:49:05', 14),
	(24, '104230', '2025-09-16 23:40:47', 'login', '2025-09-16 23:35:47', '2025-09-16 23:35:47', 14),
	(26, '995323', '2025-09-17 15:54:18', 'login', '2025-09-17 15:49:18', '2025-09-17 15:49:18', 14),
	(28, '161674', '2025-09-17 16:39:09', 'login', '2025-09-17 16:34:09', '2025-09-17 16:34:09', 14),
	(30, '491962', '2025-09-18 13:00:07', 'login', '2025-09-18 12:55:07', '2025-09-18 12:55:07', 14),
	(34, '538732', '2025-09-22 14:17:04', 'login', '2025-09-22 14:12:04', '2025-09-22 14:12:04', 14),
	(36, '106416', '2025-09-26 12:12:29', 'login', '2025-09-26 12:07:29', '2025-09-26 12:07:29', 14),
	(38, '358772', '2025-09-30 09:28:16', 'login', '2025-09-30 09:23:16', '2025-09-30 09:23:16', 14),
	(39, '797119', '2025-09-30 09:49:13', 'login', '2025-09-30 09:44:13', '2025-09-30 09:44:13', 15),
	(40, '669783', '2025-09-30 09:49:24', 'login', '2025-09-30 09:44:24', '2025-09-30 09:44:24', 15),
	(49, '627059', '2025-10-16 15:44:22', 'login', '2025-10-16 15:39:22', '2025-10-16 15:39:22', 14),
	(57, '929019', '2025-10-22 15:34:19', 'login', '2025-10-22 15:29:19', '2025-10-22 15:29:19', 5),
	(58, '100822', '2025-10-22 15:35:11', 'login', '2025-10-22 15:30:11', '2025-10-22 15:30:11', 5);

-- Dumping structure for table toko_online.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('pending','success','failed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `transaction_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.payments: ~30 rows (approximately)
INSERT INTO `payments` (`id`, `method`, `status`, `transaction_id`, `createdAt`, `updatedAt`, `order_id`) VALUES
	(27, 'Bank_Transfer', 'pending', '68e2a7bc3184fbfd30eba089', '2025-10-05 17:15:39', '2025-10-05 17:15:41', 47),
	(28, 'Bank_Transfer', 'pending', '68e3bc7243f0668d90d0dfd4', '2025-10-06 12:56:18', '2025-10-06 12:56:19', 48),
	(29, 'Bank_Transfer', 'pending', '68e5410d43f0668d90d33042', '2025-10-07 16:34:21', '2025-10-07 16:34:22', 49),
	(30, 'Bank_Transfer', 'pending', '68e553a443f0668d90d34b8c', '2025-10-07 17:53:40', '2025-10-07 17:53:41', 50),
	(31, 'xendit', 'pending', '68e555f443f0668d90d34f1d', '2025-10-07 18:03:33', '2025-10-07 18:03:33', 51),
	(32, 'xendit', 'pending', '68e5578843f0668d90d351b5', '2025-10-07 18:10:16', '2025-10-07 18:10:16', 52),
	(33, 'xendit', 'pending', '68e557c443f0668d90d351f3', '2025-10-07 18:11:16', '2025-10-07 18:11:16', 53),
	(34, 'xendit', 'pending', '68e5582443f0668d90d35256', '2025-10-07 18:12:52', '2025-10-07 18:12:52', 54),
	(35, 'xendit', 'pending', '68e5587943f0668d90d352be', '2025-10-07 18:14:18', '2025-10-07 18:14:18', 55),
	(36, 'xendit', 'pending', '68e5598843f0668d90d3544a', '2025-10-07 18:18:49', '2025-10-07 18:18:49', 56),
	(37, 'xendit', 'pending', '68e55c1243f0668d90d3572a', '2025-10-07 18:29:38', '2025-10-07 18:29:38', 57),
	(38, 'Bank_Transfer', 'pending', '68e566d443f0668d90d363c2', '2025-10-07 19:15:32', '2025-10-07 19:15:33', 58),
	(39, 'Bank_Transfer', 'pending', '68e5671643f0668d90d36413', '2025-10-07 19:16:37', '2025-10-07 19:16:38', 59),
	(40, 'Bank_Transfer', 'pending', '68e567fd43f0668d90d3653d', '2025-10-07 19:20:29', '2025-10-07 19:20:30', 60),
	(41, 'xendit', 'pending', '68e5689b43f0668d90d36602', '2025-10-07 19:23:08', '2025-10-07 19:23:08', 61),
	(42, 'Bank_Transfer', 'pending', '68e7bcc67b7d2caa6c9b341a', '2025-10-09 13:46:45', '2025-10-09 13:46:47', 62),
	(43, 'Bank_Transfer', 'pending', '68f26f300500c69fd8d5129d', '2025-10-17 16:30:40', '2025-10-17 16:30:41', 63),
	(44, 'Bank_Transfer', 'pending', '6903b9e608ee64087307da0a', '2025-10-30 19:17:58', '2025-10-30 19:17:59', 64),
	(45, 'Bank_Transfer', 'pending', '6903ba3308ee64087307da32', '2025-10-30 19:19:15', '2025-10-30 19:19:16', 65),
	(46, 'Bank_Transfer', 'pending', '6903bb1208ee64087307dadd', '2025-10-30 19:22:58', '2025-10-30 19:22:58', 66),
	(47, 'Bank_Transfer', 'pending', '6903bb1f08ee64087307daf0', '2025-10-30 19:23:11', '2025-10-30 19:23:12', 67),
	(48, 'Bank_Transfer', 'pending', '6903bb2208ee64087307daf4', '2025-10-30 19:23:14', '2025-10-30 19:23:14', 68),
	(49, 'Bank_Transfer', 'pending', '6903bb4f08ee64087307db06', '2025-10-30 19:23:59', '2025-10-30 19:24:00', 69),
	(50, 'Bank_Transfer', 'pending', '6903bbf608ee64087307db8c', '2025-10-30 19:26:45', '2025-10-30 19:26:47', 70),
	(51, 'Bank_Transfer', 'pending', '6903bd5808ee64087307dd01', '2025-10-30 19:32:39', '2025-10-30 19:32:41', 71),
	(52, 'Bank_Transfer', 'pending', '6908a1f1149343eccb5f9cbe', '2025-11-03 12:37:05', '2025-11-03 12:37:07', 72),
	(53, 'Bank_Transfer', 'pending', '6911fcf93d7103f0eec40c42', '2025-11-10 14:55:53', '2025-11-10 14:55:54', 73),
	(54, 'Bank_Transfer', 'pending', '6911fd013d7103f0eec40c47', '2025-11-10 14:56:00', '2025-11-10 14:56:01', 74),
	(55, 'Bank_Transfer', 'pending', '6911fd283d7103f0eec40c5b', '2025-11-10 14:56:40', '2025-11-10 14:56:41', 75),
	(56, 'Bank_Transfer', 'pending', '6911fd533d7103f0eec40c6e', '2025-11-10 14:57:22', '2025-11-10 14:57:23', 76),
	(57, 'Bank_Transfer', 'pending', '691202416b1eb550e77be4a0', '2025-11-10 15:18:25', '2025-11-10 15:18:25', 77),
	(58, 'Bank_Transfer', 'pending', '691203356b1eb550e77be551', '2025-11-10 15:22:29', '2025-11-10 15:22:30', 78),
	(59, 'xendit', 'pending', '69125a0d6b1eb550e77c306f', '2025-11-10 21:33:02', '2025-11-10 21:33:02', 79),
	(60, 'xendit', 'pending', '69125cf76b1eb550e77c31f4', '2025-11-10 21:45:28', '2025-11-10 21:45:28', 80),
	(61, 'Bank_Transfer', 'pending', '6917a20926d6bc37164b9844', '2025-11-14 21:41:29', '2025-11-14 21:41:30', 81);

-- Dumping structure for table toko_online.productcolors
CREATE TABLE IF NOT EXISTS `productcolors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `colorId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductColors_colorId_productId_unique` (`productId`,`colorId`),
  KEY `colorId` (`colorId`),
  CONSTRAINT `productcolors_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productcolors_ibfk_2` FOREIGN KEY (`colorId`) REFERENCES `colors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.productcolors: ~19 rows (approximately)
INSERT INTO `productcolors` (`id`, `productId`, `colorId`, `createdAt`, `updatedAt`) VALUES
	(11, 38, 2, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(12, 38, 1, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(13, 39, 2, '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(14, 40, 1, '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(15, 41, 1, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(16, 41, 2, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(17, 42, 1, '2025-10-05 16:09:46', '2025-10-05 16:09:46'),
	(18, 43, 2, '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(19, 44, 2, '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(20, 45, 2, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(21, 46, 1, '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(22, 47, 2, '2025-10-05 16:15:53', '2025-10-05 16:15:53'),
	(23, 48, 2, '2025-10-05 16:16:41', '2025-10-05 16:16:41'),
	(24, 49, 2, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(25, 49, 1, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(26, 50, 1, '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(27, 50, 2, '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(28, 51, 1, '2025-10-05 16:20:18', '2025-10-05 16:20:18'),
	(29, 51, 2, '2025-10-05 16:20:18', '2025-10-05 16:20:18');

-- Dumping structure for table toko_online.productimages
CREATE TABLE IF NOT EXISTS `productimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.productimages: ~30 rows (approximately)
INSERT INTO `productimages` (`id`, `product_id`, `image_url`, `createdAt`, `updatedAt`) VALUES
	(83, 38, '1759676896785-989619247.png', '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(84, 38, '1759676896787-880383169.png', '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(85, 38, '1759676896787-115547539.png', '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(86, 39, '1759676997155-397065592.png', '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(87, 39, '1759676997155-939348880.png', '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(88, 40, '1759677327017-576294664.png', '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(89, 40, '1759677327018-653218957.png', '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(90, 40, '1759677327019-150988349.png', '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(91, 41, '1759680500099-855811971.png', '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(92, 41, '1759680500101-582199146.png', '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(93, 41, '1759680500108-302985193.png', '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(94, 42, '1759680585791-711716465.png', '2025-10-05 16:09:45', '2025-10-05 16:09:45'),
	(95, 42, '1759680585800-613781977.png', '2025-10-05 16:09:45', '2025-10-05 16:09:45'),
	(96, 42, '1759680585800-980247357.png', '2025-10-05 16:09:45', '2025-10-05 16:09:45'),
	(97, 43, '1759680698069-49621274.png', '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(98, 43, '1759680698071-637878815.png', '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(99, 43, '1759680698071-136007255.png', '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(100, 44, '1759680750655-134718018.png', '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(101, 44, '1759680750656-183199785.png', '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(102, 45, '1759680830049-757094598.png', '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(103, 45, '1759680830050-32947886.png', '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(104, 46, '1759680877027-349114247.png', '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(105, 46, '1759680877028-612594224.png', '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(106, 46, '1759680877037-186730971.png', '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(107, 47, '1759680953496-579146284.png', '2025-10-05 16:15:53', '2025-10-05 16:15:53'),
	(108, 47, '1759680953497-443488215.png', '2025-10-05 16:15:53', '2025-10-05 16:15:53'),
	(109, 48, '1759681001319-179567788.png', '2025-10-05 16:16:41', '2025-10-05 16:16:41'),
	(110, 48, '1759681001320-455053348.png', '2025-10-05 16:16:41', '2025-10-05 16:16:41'),
	(111, 49, '1759681055272-451670786.png', '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(112, 49, '1759681055274-710170471.png', '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(113, 50, '1759681173064-987043647.png', '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(114, 50, '1759681173065-256742720.png', '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(115, 51, '1759681218020-585041780.png', '2025-10-05 16:20:18', '2025-10-05 16:20:18'),
	(116, 51, '1759681218020-799323094.png', '2025-10-05 16:20:18', '2025-10-05 16:20:18');

-- Dumping structure for table toko_online.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` float NOT NULL,
  `stock` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.products: ~12 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `createdAt`, `updatedAt`, `category_id`) VALUES
	(38, 'iphone 13 pro max', 'ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 6000000, 0, '2025-10-05 15:08:16', '2025-10-07 19:16:37', 1),
	(39, 'air buds', ' earbud nirkabel premium dengan desain kompak dan ergonomis, kualitas suara 24-bit Hi-Fi melalui driver dua arah dan codec Samsung Seamless Codec (SSC HiFi) yang menghasilkan suara kaya dan detail. Fitur canggih termasuk Active Noise Cancellation (ANC) efektif, 360 Audio dengan Dolby Head Tracking untuk pengalaman sinematik, serta ketahanan air IPX7 dan daya tahan baterai hingga 5 jam (ANC aktif) dengan total 20 jam bersama casing', 500000, 14, '2025-10-05 15:09:57', '2025-10-05 15:09:57', 3),
	(40, 'iphone 13 pro max', 'ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 3000000, 0, '2025-10-05 15:15:27', '2025-10-30 19:17:57', 1),
	(41, 'macbook air', 'MacBook Air M1 adalah laptop ringan dan tipis dari Apple yang ditenagai chip M1, menghadirkan performa tinggi untuk tugas sehari-hari, efisiensi daya baterai luar biasa, dan pengalaman pengguna yang mulus di sistem operasi macOS. Dilengkapi layar Retina 13,3 inci, desain tanpa kipas, keyboard yang nyaman, serta port Thunderbolt/USB 4, laptop ini tetap menjadi pilihan menarik untuk produktivitas dan mobilitas. ', 15000000, 4, '2025-10-05 16:08:20', '2025-11-03 12:37:04', 5),
	(42, 'iphone 13 pro max', 'MacBook Air M1 adalah laptop ringan dan tipis dari Apple yang ditenagai chip M1, menghadirkan performa tinggi untuk tugas sehari-hari, efisiensi daya baterai luar biasa, dan pengalaman pengguna yang mulus di sistem operasi macOS. Dilengkapi layar Retina 13,3 inci, desain tanpa kipas, keyboard yang nyaman, serta port Thunderbolt/USB 4, laptop ini tetap menjadi pilihan menarik untuk produktivitas dan mobilitas. ', 4500000, 0, '2025-10-05 16:09:45', '2025-10-30 19:26:45', 1),
	(43, 'iphone 13 pro max', 'iPhone 13 Pro Max adalah ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 23000000, 3, '2025-10-05 16:11:38', '2025-10-30 19:32:39', 1),
	(44, 'iphone 13 pro max', 'iPhone 13 Pro Max adalah ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 4500000, 6, '2025-10-05 16:12:30', '2025-11-10 15:22:29', 1),
	(45, 'iphone xr', 'iPhone 13 Pro Max adalah ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 3000000, 18, '2025-10-05 16:13:50', '2025-10-07 17:53:40', 1),
	(46, 'iphone xr', 'iPhone 13 Pro Max adalah ponsel premium Apple yang menampilkan layar Super Retina XDR 6,7 inci dengan ProMotion (refresh rate adaptif hingga 120Hz) dan Ceramic Shield, didukung oleh chipset A15 Bionic untuk kinerja superior. Fitur utamanya mencakup sistem tiga kamera Pro 12MP dengan kemampuan makro dan Cinematic Mode, ketahanan air dan debu IP68, serta daya tahan baterai yang sangat baik. ', 2300000, 15, '2025-10-05 16:14:37', '2025-10-05 16:14:37', 1),
	(47, 'air pods 4', 'AirPods 4 adalah earbud nirkabel dengan dua model: standar dan dengan Peredam Kebisingan Aktif (ANC). Fitur utamanya meliputi desain telinga terbuka (Open-Ear Fit), chip H2 untuk kinerja superior, Audio Spasial Personal dengan pelacakan gerakan kepala, dan casing pengisi daya USB-C. Model dengan ANC menambahkan fitur seperti Audio Adaptif dan Kesadaran Percakapan, yang memadukan mode Transparansi dan ANC, serta secara otomatis menurunkan volume saat Anda berbicara. ', 2000000, 23, '2025-10-05 16:15:53', '2025-10-05 16:15:53', 3),
	(48, 'air pods 4', 'AirPods 4 adalah earbud nirkabel dengan dua model: standar dan dengan Peredam Kebisingan Aktif (ANC). Fitur utamanya meliputi desain telinga terbuka (Open-Ear Fit), chip H2 untuk kinerja superior, Audio Spasial Personal dengan pelacakan gerakan kepala, dan casing pengisi daya USB-C. Model dengan ANC menambahkan fitur seperti Audio Adaptif dan Kesadaran Percakapan, yang memadukan mode Transparansi dan ANC, serta secara otomatis menurunkan volume saat Anda berbicara. ', 4000000, 4, '2025-10-05 16:16:41', '2025-10-05 16:16:41', 3),
	(49, 'iphone xr', 'AirPods 4 adalah earbud nirkabel dengan dua model: standar dan dengan Peredam Kebisingan Aktif (ANC). Fitur utamanya meliputi desain telinga terbuka (Open-Ear Fit), chip H2 untuk kinerja superior, Audio Spasial Personal dengan pelacakan gerakan kepala, dan casing pengisi daya USB-C. Model dengan ANC menambahkan fitur seperti Audio Adaptif dan Kesadaran Percakapan, yang memadukan mode Transparansi dan ANC, serta secara otomatis menurunkan volume saat Anda berbicara. ', 4000000, 3, '2025-10-05 16:17:35', '2025-11-14 21:41:29', 1),
	(50, 'macbook pro', 'AirPods 4 adalah earbud nirkabel dengan dua model: standar dan dengan Peredam Kebisingan Aktif (ANC). Fitur utamanya meliputi desain telinga terbuka (Open-Ear Fit), chip H2 untuk kinerja superior, Audio Spasial Personal dengan pelacakan gerakan kepala, dan casing pengisi daya USB-C. Model dengan ANC menambahkan fitur seperti Audio Adaptif dan Kesadaran Percakapan, yang memadukan mode Transparansi dan ANC, serta secara otomatis menurunkan volume saat Anda berbicara. ', 12000000, 6, '2025-10-05 16:19:33', '2025-10-05 16:19:33', 5),
	(51, 'iphone 13 pro max', 'AirPods 4 adalah earbud nirkabel dengan dua model: standar dan dengan Peredam Kebisingan Aktif (ANC). Fitur utamanya meliputi desain telinga terbuka (Open-Ear Fit), chip H2 untuk kinerja superior, Audio Spasial Personal dengan pelacakan gerakan kepala, dan casing pengisi daya USB-C. Model dengan ANC menambahkan fitur seperti Audio Adaptif dan Kesadaran Percakapan, yang memadukan mode Transparansi dan ANC, serta secara otomatis menurunkan volume saat Anda berbicara. ', 4000000, 12, '2025-10-05 16:20:18', '2025-10-05 16:20:18', 1);

-- Dumping structure for table toko_online.productstorages
CREATE TABLE IF NOT EXISTS `productstorages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `storageId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductStorages_storageId_productId_unique` (`productId`,`storageId`),
  KEY `storageId` (`storageId`),
  CONSTRAINT `productstorages_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productstorages_ibfk_2` FOREIGN KEY (`storageId`) REFERENCES `storages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.productstorages: ~16 rows (approximately)
INSERT INTO `productstorages` (`id`, `productId`, `storageId`, `createdAt`, `updatedAt`) VALUES
	(10, 38, 1, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(11, 38, 2, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(12, 40, 1, '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(13, 41, 1, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(14, 42, 1, '2025-10-05 16:09:46', '2025-10-05 16:09:46'),
	(15, 43, 2, '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(16, 44, 1, '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(17, 45, 2, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(18, 45, 1, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(19, 46, 1, '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(20, 49, 1, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(21, 49, 2, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(22, 50, 1, '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(23, 50, 2, '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(24, 51, 1, '2025-10-05 16:20:18', '2025-10-05 16:20:18'),
	(25, 51, 2, '2025-10-05 16:20:18', '2025-10-05 16:20:18');

-- Dumping structure for table toko_online.producttags
CREATE TABLE IF NOT EXISTS `producttags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `tagId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductTags_tagId_productId_unique` (`productId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `producttags_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producttags_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.producttags: ~29 rows (approximately)
INSERT INTO `producttags` (`id`, `productId`, `tagId`, `createdAt`, `updatedAt`) VALUES
	(51, 38, 4, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(52, 38, 1, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(53, 38, 14, '2025-10-05 15:08:16', '2025-10-05 15:08:16'),
	(54, 39, 1, '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(55, 39, 14, '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(56, 39, 15, '2025-10-05 15:09:57', '2025-10-05 15:09:57'),
	(57, 40, 2, '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(58, 40, 13, '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(59, 40, 14, '2025-10-05 15:15:27', '2025-10-05 15:15:27'),
	(60, 41, 1, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(61, 41, 4, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(62, 41, 14, '2025-10-05 16:08:20', '2025-10-05 16:08:20'),
	(63, 42, 2, '2025-10-05 16:09:46', '2025-10-05 16:09:46'),
	(64, 42, 13, '2025-10-05 16:09:46', '2025-10-05 16:09:46'),
	(65, 42, 14, '2025-10-05 16:09:46', '2025-10-05 16:09:46'),
	(66, 43, 4, '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(67, 43, 1, '2025-10-05 16:11:38', '2025-10-05 16:11:38'),
	(68, 44, 2, '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(69, 44, 13, '2025-10-05 16:12:30', '2025-10-05 16:12:30'),
	(70, 45, 2, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(71, 45, 13, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(72, 45, 14, '2025-10-05 16:13:50', '2025-10-05 16:13:50'),
	(73, 46, 4, '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(74, 46, 14, '2025-10-05 16:14:37', '2025-10-05 16:14:37'),
	(75, 47, 4, '2025-10-05 16:15:53', '2025-10-05 16:15:53'),
	(76, 48, 4, '2025-10-05 16:16:41', '2025-10-05 16:16:41'),
	(77, 49, 2, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(78, 49, 13, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(79, 49, 14, '2025-10-05 16:17:35', '2025-10-05 16:17:35'),
	(80, 50, 4, '2025-10-05 16:19:33', '2025-10-05 16:19:33'),
	(81, 51, 2, '2025-10-05 16:20:18', '2025-10-05 16:20:18'),
	(82, 51, 13, '2025-10-05 16:20:18', '2025-10-05 16:20:18'),
	(83, 51, 14, '2025-10-05 16:20:18', '2025-10-05 16:20:18');

-- Dumping structure for table toko_online.service_types
CREATE TABLE IF NOT EXISTS `service_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `waktu_proses` int NOT NULL COMMENT 'Durasi pengerjaan service (menit/jam)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.service_types: ~3 rows (approximately)
INSERT INTO `service_types` (`id`, `nama`, `harga`, `waktu_proses`, `createdAt`, `updatedAt`) VALUES
	(1, 'service lcd', 80000.00, 30, '2025-09-08 17:52:23', '2025-10-03 17:47:38'),
	(2, 'Ganti Batrai', 150000.00, 30, '2025-09-18 09:56:52', '2025-10-03 17:47:51'),
	(6, 'service sensor', 300000.00, 30, '2025-10-05 15:36:29', '2025-10-05 15:36:29'),
	(8, 'service kamera', 530000.00, 60, '2025-10-05 15:46:15', '2025-10-09 10:50:17');

-- Dumping structure for table toko_online.storages
CREATE TABLE IF NOT EXISTS `storages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.storages: ~0 rows (approximately)
INSERT INTO `storages` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
	(1, '256 gb', '2025-10-01 20:55:20', '2025-10-01 20:55:20'),
	(2, '128 gb', '2025-10-03 16:01:02', '2025-10-03 16:01:02');

-- Dumping structure for table toko_online.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.tags: ~8 rows (approximately)
INSERT INTO `tags` (`id`, `name`, `description`, `categoryId`, `createdAt`, `updatedAt`) VALUES
	(1, 'baru', NULL, NULL, '2025-09-23 14:04:54', '2025-09-23 14:04:54'),
	(2, 'inter', NULL, NULL, '2025-09-23 14:04:54', '2025-09-23 14:04:54'),
	(4, 'ibox', NULL, NULL, '2025-09-25 12:03:38', '2025-09-25 12:03:38'),
	(7, 'bekas', NULL, NULL, '2025-09-25 12:05:09', '2025-09-25 12:05:09'),
	(13, 'secound', NULL, NULL, '2025-09-26 18:10:46', '2025-09-26 18:10:46'),
	(14, 'no minus', NULL, NULL, '2025-09-26 18:10:46', '2025-09-26 18:10:46'),
	(15, 'aksesoris', NULL, NULL, '2025-10-01 08:52:26', '2025-10-01 08:52:26'),
	(16, 'coba', NULL, NULL, '2025-10-01 20:37:36', '2025-10-01 20:37:36');

-- Dumping structure for table toko_online.technicians
CREATE TABLE IF NOT EXISTS `technicians` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `photoUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.technicians: ~2 rows (approximately)
INSERT INTO `technicians` (`id`, `name`, `photoUrl`, `createdAt`, `updatedAt`) VALUES
	(1, 'mark', NULL, '2025-09-08 17:57:21', '2025-10-05 16:00:43'),
	(2, 'jacob', NULL, '2025-09-08 17:57:55', '2025-10-05 16:05:51'),
	(3, 'ujang', '/uploads/1757354313348-792166469.png', '2025-09-08 17:58:33', '2025-09-23 09:39:47'),
	(4, 'ahmad', '/uploads/1759679879122-856478018.png', '2025-10-05 15:57:59', '2025-10-05 15:57:59');

-- Dumping structure for table toko_online.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','customer') COLLATE utf8mb4_general_ci DEFAULT 'customer',
  `isVerified` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `city_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table toko_online.users: ~7 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `isVerified`, `createdAt`, `updatedAt`, `city_id`, `postal_code`) VALUES
	(5, 'amarhum', 'amarhum54@gmail.com', '$2b$10$kb.4DBQXpExdplcmap/3COyBRR7gR2oDG71LQfdo9N8SPdAkXUF0O', '08123456789', 'Sukabumi', 'admin', 1, '2025-09-12 14:52:24', '2025-09-12 15:08:47', NULL, NULL),
	(14, 'angga', 'anggamy01@gmail.com', '$2b$10$F1LINV158rAJqteydCqANuWE1UNT35hW0FHCivJTl63ZHyPSpdGfm', '085216114357', 'jampang', 'customer', 1, '2025-09-16 13:39:10', '2025-10-07 16:33:50', NULL, NULL),
	(15, 'mark', 'muamar.albana_ti21@nusaputra.ac.id', '$2b$10$EqwUkTVj6gMlfM/PYmGIquoVNAHfwrXEAIXJrD5QXXZHNYcbcq6HS', '0827823784', 'nanya nanya nanya', 'admin', 1, '2025-09-18 12:57:20', '2025-09-18 12:58:28', NULL, NULL),
	(18, 'ujang bedog', 'muamar171215@gmail.com', '$2b$10$S/wymMK5Bg4AaO3raljRhe2NDZXVuo57XeJijN41fsS5BehHZlyq2', '08082031295', 'Sukabumi aja udah ga panjan panjang', 'customer', 1, '2025-10-06 11:34:45', '2025-10-06 12:57:24', NULL, NULL),
	(19, 'wigi', 'wigirahman1@gmail.com', '$2b$10$57Grk1R/Y4tT412ilguPqOmEDbCq5ob92wtvP77KvDM9yB7Qb83m.', '082122144305', 'jampang', 'customer', 1, '2025-10-09 13:39:31', '2025-10-09 13:39:58', NULL, NULL),
	(20, 'lutfi', 'lutfiher96@gmail.com', '$2b$10$1QTE5wENYffHzQH6v7TqHeuceIgUCA34Y0Sw6hGHjdD1BXRJNwG4W', '081546773342', 'sigodeg', 'customer', 1, '2025-10-09 13:52:39', '2025-10-09 13:53:18', NULL, NULL),
	(25, 'asep bedug', 'imirrum6@gmail.com', '$2b$10$cESfOYytAaD8H/vOtInRFOBct0lvDT9E8xYAvgN9xp8gSfrFYXrNy', '082736472678', 'Kp. Babakan Rt 20/07 desa karang tengah kecamatan cibadak kabupaten sukabumi', 'customer', 1, '2025-10-20 18:41:03', '2025-11-03 18:11:47', '61202', '43351');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
