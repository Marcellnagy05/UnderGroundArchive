-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2025 at 10:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `undergroundarchive`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `AchievementId` int(11) NOT NULL,
  `PointAmount` int(11) NOT NULL,
  `AchievementDescription` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`AchievementId`, `PointAmount`, `AchievementDescription`) VALUES
(4, 100, 'First Words – Write your first comment'),
(5, 500, 'Engaged Reader – Write 10 comments'),
(6, 2000, 'Top Reviewer – Write 50 comments'),
(7, 5000, 'Conversationalist – Join the discussion with 100 comments'),
(8, 10000, 'Discussion Leader – Share your insights in 250 comments'),
(9, 20000, 'Community Voice – Make your voice heard with 500 comments'),
(10, 50000, 'Master Debater – Reach 1000 comments and shape the conversation'),
(11, 100000, 'Legendary Commenter – With 2500 comments, you’re a discussion icon'),
(12, 250000, 'Eternal Echo – Leave a lasting mark with 5000 comments');

-- --------------------------------------------------------

--
-- Table structure for table `aspnetroleclaims`
--

CREATE TABLE `aspnetroleclaims` (
  `Id` int(11) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetroles`
--

CREATE TABLE `aspnetroles` (
  `Id` varchar(255) NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetroles`
--

INSERT INTO `aspnetroles` (`Id`, `Name`, `NormalizedName`, `ConcurrencyStamp`) VALUES
('138f65de-0e69-11f0-a9b3-a85e45d4c0f1', 'User', 'USER', '138f65fa-0e69-11f0-a9b3-a85e45d4c0f1'),
('138f71d0-0e69-11f0-a9b3-a85e45d4c0f1', 'Author', 'AUTHOR', '138f720a-0e69-11f0-a9b3-a85e45d4c0f1'),
('138f7313-0e69-11f0-a9b3-a85e45d4c0f1', 'Critic', 'CRITIC', '138f731a-0e69-11f0-a9b3-a85e45d4c0f1'),
('138f7388-0e69-11f0-a9b3-a85e45d4c0f1', 'Moderator', 'MODERATOR', '138f7390-0e69-11f0-a9b3-a85e45d4c0f1'),
('138f73c9-0e69-11f0-a9b3-a85e45d4c0f1', 'Admin', 'ADMIN', '138f73cf-0e69-11f0-a9b3-a85e45d4c0f1');

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserclaims`
--

CREATE TABLE `aspnetuserclaims` (
  `Id` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserlogins`
--

CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(255) NOT NULL,
  `ProviderKey` varchar(255) NOT NULL,
  `ProviderDisplayName` longtext DEFAULT NULL,
  `UserId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aspnetuserroles`
--

CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetuserroles`
--

INSERT INTO `aspnetuserroles` (`UserId`, `RoleId`) VALUES
('12f8f280-aeb6-4168-9727-f36b2fe28336', '138f65de-0e69-11f0-a9b3-a85e45d4c0f1'),
('81423145-47fc-4437-8593-7995ec0f8d0a', '138f73c9-0e69-11f0-a9b3-a85e45d4c0f1'),
('94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', '138f71d0-0e69-11f0-a9b3-a85e45d4c0f1'),
('ab797d0d-6b67-4945-9927-36dc33df4aef', '138f7388-0e69-11f0-a9b3-a85e45d4c0f1'),
('ae98e37a-22ee-42a4-b361-312101a69563', '138f65de-0e69-11f0-a9b3-a85e45d4c0f1'),
('af68748e-a603-4fe6-b169-c7abe6ad2c81', '138f71d0-0e69-11f0-a9b3-a85e45d4c0f1'),
('ddadb0e6-9a91-4bae-b4f5-73ed7db4a118', '138f7313-0e69-11f0-a9b3-a85e45d4c0f1');

-- --------------------------------------------------------

--
-- Table structure for table `aspnetusers`
--

CREATE TABLE `aspnetusers` (
  `Id` varchar(255) NOT NULL,
  `RankId` int(11) DEFAULT NULL,
  `SubscriptionId` int(11) DEFAULT NULL,
  `JoinDate` datetime(6) NOT NULL,
  `BirthDate` datetime(6) DEFAULT NULL,
  `Country` longtext DEFAULT NULL,
  `RankPoints` int(11) NOT NULL,
  `Balance` decimal(65,30) NOT NULL,
  `Theme` longtext NOT NULL,
  `ProfilePictureId` int(11) DEFAULT NULL,
  `IsMuted` tinyint(1) NOT NULL,
  `IsBanned` tinyint(1) NOT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `Email` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext DEFAULT NULL,
  `SecurityStamp` longtext DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL,
  `PhoneNumber` longtext DEFAULT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aspnetusers`
--

INSERT INTO `aspnetusers` (`Id`, `RankId`, `SubscriptionId`, `JoinDate`, `BirthDate`, `Country`, `RankPoints`, `Balance`, `Theme`, `ProfilePictureId`, `IsMuted`, `IsBanned`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`) VALUES
('12f8f280-aeb6-4168-9727-f36b2fe28336', 1, 1, '2025-03-31 21:51:02.344954', '2000-01-01 00:00:00.000000', 'User2', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestUser2', 'TESTUSER2', 'user2@user2.user2', 'USER2@USER2.USER2', 0, 'AQAAAAIAAYagAAAAENRYw1ccAZe7c6GD5TRD3t8gO7C/SI5TcjMbGRUPtzWG4pV0OsjbznOpIkGIJzke1A==', 'V5OYCQMFKBBDHVJFGOUNQFOHTRXKQYR7', '044944c1-9739-42d8-8036-ddef92d1f9c6', '12345678911', 0, 0, NULL, 1, 0),
('81423145-47fc-4437-8593-7995ec0f8d0a', 1, 1, '2025-03-31 22:17:11.397058', '2000-01-01 00:00:00.000000', 'Admin', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestAdmin', 'TESTADMIN', 'admin@admin.admin', 'ADMIN@ADMIN.ADMIN', 0, 'AQAAAAIAAYagAAAAED+WgCWz2Q/6pVDBDFvlKVjzxzTDrbf9Ksvv7C8aWbI3XQ0pl8V7rDGbuERAzOdjSA==', 'XHSJZRNXRQPO2PVPDUFRY3M5HOQCNDCL', 'd410fe03-f1b1-40d0-9f55-d2223f6fa6ef', '12345678914', 0, 0, NULL, 1, 0),
('94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 1, 1, '2025-03-31 22:15:18.326871', '2000-01-01 00:00:00.000000', 'Author', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestAuthor2', 'TESTAUTHOR2', 'author2@author2.author2', 'AUTHOR2@AUTHOR2.AUTHOR2', 0, 'AQAAAAIAAYagAAAAEK2Xgw8k/ZNM6p6EG/4tQNj4JE/9vheJJAec2fEOseEvHb7nx2cL9EBGvN5kNOFVDw==', 'WLU673VTLLICAZ2ZXVLIKCBURAG65N3E', 'dbd568e8-b5dd-4baf-ae0e-64b177d3f476', '12345678913', 0, 0, NULL, 1, 0),
('ab797d0d-6b67-4945-9927-36dc33df4aef', 1, 1, '2025-03-31 22:21:17.301865', '2000-01-01 00:00:00.000000', 'Moderator', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestModerator', 'TESTMODERATOR', 'moderator@moderator.moderator', 'MODERATOR@MODERATOR.MODERATOR', 0, 'AQAAAAIAAYagAAAAEFr0arL0Ut+NF2cXIdjL5SOjd4AOXIxKIUOOhLfFM9oPW28xN9+Hs9LDVuwvVdNj1Q==', 'GSIB5XLGUW5IVHAISLIVFWN6GKJY3UDW', '98b8ef03-9df6-4751-b57e-7f6181a2b15e', '12345678915', 0, 0, NULL, 1, 0),
('ae98e37a-22ee-42a4-b361-312101a69563', 1, 1, '2025-03-31 21:50:21.908694', '2000-01-01 00:00:00.000000', 'User', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestUser1', 'TESTUSER1', 'user@user.user', 'USER@USER.USER', 0, 'AQAAAAIAAYagAAAAEP1U9VrfEjHSXKq8e+ugd7aW5JH4kPut519abqhoa48tTZTccOj003zqbjrC8GxpTQ==', '3KUJFLAK6A3PY5NKVQ3S4XMAD7YGGK4U', '4c683a2f-7c18-41d0-9a78-7f420237251e', '12345678910', 0, 0, NULL, 1, 0),
('af68748e-a603-4fe6-b169-c7abe6ad2c81', 1, 1, '2025-03-31 22:16:19.444516', '2000-01-01 00:00:00.000000', 'Author1', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestAuthor1', 'TESTAUTHOR1', 'author1@author1.author1', 'AUTHOR1@AUTHOR1.AUTHOR1', 0, 'AQAAAAIAAYagAAAAEPoQ3n0gVocLVKH/m4t8UIJKWLcDfcnV5egHFuaDSc28aC2pQ7/gdUBrDXb+q4N/ZQ==', '6UKNBGYPUIO2ZPOWMNL23FMBNBMN4F2C', 'decfae12-66ad-4c53-a4f2-7874868232d8', '12345678912', 0, 0, NULL, 1, 0),
('ddadb0e6-9a91-4bae-b4f5-73ed7db4a118', 1, 1, '2025-03-31 22:22:13.151816', '2000-01-01 00:00:00.000000', 'Critic', 0, 0.000000000000000000000000000000, 'dark', 1, 0, 0, 'TestCritic', 'TESTCRITIC', 'critic@critic.critic', 'CRITIC@CRITIC.CRITIC', 0, 'AQAAAAIAAYagAAAAEItvkBCLuHyAq12vYxaJXZ7Za0kF1b2WUr2hhJ1iQulliX0iCj/AC3PwsBR6KrNXrg==', 'IF2BW4J5DKJCNSEXNC2VZX6XCOIFFKGD', 'f693cfd2-a5ac-4192-a401-fec92cb3dd15', '12345678916', 0, 0, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `aspnetusertokens`
--

CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) NOT NULL,
  `LoginProvider` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Value` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `BookId` int(11) NOT NULL,
  `BookName` longtext DEFAULT NULL,
  `AuthorId` varchar(255) NOT NULL,
  `GenreId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `BookDescription` longtext DEFAULT NULL,
  `ApplicationUserId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`BookId`, `BookName`, `AuthorId`, `GenreId`, `CategoryId`, `BookDescription`, `ApplicationUserId`) VALUES
(1, 'Teszt1', '94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 22, 1, 'Teszt könyv 1', NULL),
(2, 'Teszt2', '94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 7, 2, 'Teszt könyv 2', NULL),
(3, 'Teszt3', '94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 4, 10, 'Teszt könyv 3', NULL),
(4, 'Teszt4', '94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 3, 15, 'Teszt könyv 4', NULL),
(5, 'Teszt5', '94c2b7dd-5870-47e9-9de3-c8d4e98a4e0b', 5, 17, 'Teszt könyv 5', NULL),
(6, 'Teszt6', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 4, 29, 'Teszt könyv 6', NULL),
(7, 'Teszt7', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 15, 28, 'Teszt könyv 7', NULL),
(8, 'Teszt8', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 26, 2, 'Teszt könyv 8', NULL),
(9, 'Teszt9', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 15, 16, 'Teszt könyv 9', NULL),
(10, 'Teszt10', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 10, 7, 'Teszt könyv 10', NULL),
(11, 'Teszt11', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 3, 14, 'Teszt könyv 11', NULL),
(12, 'Teszt12', 'af68748e-a603-4fe6-b169-c7abe6ad2c81', 11, 9, 'Teszt könyv 12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryId` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `IsAgeRestricted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryId`, `CategoryName`, `IsAgeRestricted`) VALUES
(1, 'Akció', 0),
(2, 'Kaland', 0),
(3, 'Vígjáték', 0),
(4, 'Dráma', 0),
(5, 'Fantasy', 0),
(6, 'Horror', 1),
(7, 'Misztikus', 0),
(8, 'Romantikus', 0),
(9, 'Sci-Fi', 0),
(10, 'Thriller', 0),
(11, 'Western', 0),
(12, 'Bűnügyi', 0),
(13, 'Dokumentumfilm', 0),
(14, 'Történelmi', 0),
(15, 'Zenei', 0),
(16, 'Musical', 0),
(17, 'Háborús', 0),
(18, 'Életrajzi', 0),
(19, 'Sport', 0),
(20, 'Családi', 0),
(21, 'Animációs', 0),
(22, 'Szuperhős', 0),
(23, 'Paródia', 0),
(24, 'Pszichológiai', 1),
(25, 'Harcművészeti', 0),
(26, 'Cyberpunk', 1),
(27, 'Steampunk', 0),
(28, 'Gótikus', 0),
(29, 'Noir', 0),
(30, 'Slasher', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `ChapterId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `ChapterNumber` int(11) NOT NULL,
  `ChapterTitle` longtext NOT NULL,
  `ChapterContent` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`ChapterId`, `BookId`, `ChapterNumber`, `ChapterTitle`, `ChapterContent`) VALUES
(1, 6, 1, 'Fejezet 1', '\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vestibulum, diam eu fringilla elementum, nibh mi dictum augue, eu efficitur metus turpis sed nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus pulvinar dapibus mauris, at ornare diam blandit quis. Sed quis arcu sit amet justo imperdiet sodales. Integer semper in risus quis pharetra. Etiam a sapien egestas, rutrum turpis id, rutrum ligula. Aliquam dignissim laoreet velit, at eleifend tellus semper vel. In quis volutpat lorem, ut pulvinar sapien. Vestibulum rutrum interdum dictum. Praesent vitae elementum orci. Proin lorem ipsum, pulvinar ac vestibulum vitae, ultrices nec massa. Vivamus venenatis neque leo, ut rutrum odio euismod quis.\n\nInteger euismod leo nulla. Nam sit amet varius eros, sodales maximus mi. Morbi ut turpis sodales dolor laoreet sagittis sit amet mattis tellus. Morbi lacinia dignissim eros, sed blandit est interdum a. Nullam vehicula lacinia odio quis laoreet. Etiam condimentum, massa vel pulvinar volutpat, nunc diam vehicula dui, vitae accumsan neque mauris vel risus. Vivamus faucibus cursus feugiat. Curabitur in odio libero. Donec vestibulum lacus in elementum venenatis. Fusce vitae massa blandit, gravida nunc eget, commodo enim.\n\nAenean mattis auctor dictum. Cras sit amet tellus blandit, feugiat odio at, tristique arcu. Suspendisse tincidunt facilisis urna nec scelerisque. Maecenas est enim, sodales ac fringilla a, pulvinar sit amet lectus. Duis sagittis velit porta commodo venenatis. Donec iaculis lectus vel risus congue finibus et sit amet ex. Suspendisse vel interdum sem. Nam ac eros eget risus accumsan vehicula. Nam id massa sem. Integer ac nisl a eros semper sagittis ultrices eu magna. Praesent egestas, risus sed venenatis condimentum, nibh quam elementum sapien, ac congue velit odio at massa. Phasellus lacinia enim ut sapien accumsan rhoncus. Phasellus egestas eros non consequat efficitur. Sed viverra ornare lobortis. Curabitur sed vehicula justo.\n\nPhasellus convallis purus vulputate, rhoncus sem ac, tristique diam. Nunc ut tellus ex. Proin porttitor, ligula ultrices commodo ultricies, nisi orci dictum sapien, id fermentum dolor orci eget ligula. Vestibulum sit amet risus eu turpis mollis efficitur. Donec eget mauris at sapien euismod viverra in in quam. Suspendisse luctus, magna vitae interdum blandit, dolor magna gravida ante, ac fringilla mi eros id odio. Nulla est purus, imperdiet quis metus ac, consequat euismod augue. Nam placerat luctus neque eu pellentesque. Aliquam vel neque quam. Duis nec arcu nibh.\n\nNulla faucibus aliquet justo tempus mattis. Sed vel sapien vestibulum, porta tellus ac, finibus eros. Pellentesque aliquet turpis sed justo consectetur, vitae bibendum est tristique. Phasellus bibendum libero id orci rutrum, ac efficitur felis ultricies. Maecenas varius elementum enim, vitae tincidunt massa mollis in. Donec tristique augue mollis consectetur pretium. Vivamus vel magna congue, elementum eros id, pellentesque ex. Donec aliquet tempor malesuada. Vivamus lectus enim, tempor vitae sapien eu, lobortis condimentum odio. Ut auctor dolor ac lectus dignissim iaculis. '),
(2, 6, 2, 'Fejezet 2', '\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vestibulum, diam eu fringilla elementum, nibh mi dictum augue, eu efficitur metus turpis sed nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus pulvinar dapibus mauris, at ornare diam blandit quis. Sed quis arcu sit amet justo imperdiet sodales. Integer semper in risus quis pharetra. Etiam a sapien egestas, rutrum turpis id, rutrum ligula. Aliquam dignissim laoreet velit, at eleifend tellus semper vel. In quis volutpat lorem, ut pulvinar sapien. Vestibulum rutrum interdum dictum. Praesent vitae elementum orci. Proin lorem ipsum, pulvinar ac vestibulum vitae, ultrices nec massa. Vivamus venenatis neque leo, ut rutrum odio euismod quis.\n\nInteger euismod leo nulla. Nam sit amet varius eros, sodales maximus mi. Morbi ut turpis sodales dolor laoreet sagittis sit amet mattis tellus. Morbi lacinia dignissim eros, sed blandit est interdum a. Nullam vehicula lacinia odio quis laoreet. Etiam condimentum, massa vel pulvinar volutpat, nunc diam vehicula dui, vitae accumsan neque mauris vel risus. Vivamus faucibus cursus feugiat. Curabitur in odio libero. Donec vestibulum lacus in elementum venenatis. Fusce vitae massa blandit, gravida nunc eget, commodo enim.\n\nAenean mattis auctor dictum. Cras sit amet tellus blandit, feugiat odio at, tristique arcu. Suspendisse tincidunt facilisis urna nec scelerisque. Maecenas est enim, sodales ac fringilla a, pulvinar sit amet lectus. Duis sagittis velit porta commodo venenatis. Donec iaculis lectus vel risus congue finibus et sit amet ex. Suspendisse vel interdum sem. Nam ac eros eget risus accumsan vehicula. Nam id massa sem. Integer ac nisl a eros semper sagittis ultrices eu magna. Praesent egestas, risus sed venenatis condimentum, nibh quam elementum sapien, ac congue velit odio at massa. Phasellus lacinia enim ut sapien accumsan rhoncus. Phasellus egestas eros non consequat efficitur. Sed viverra ornare lobortis. Curabitur sed vehicula justo.\n\nPhasellus convallis purus vulputate, rhoncus sem ac, tristique diam. Nunc ut tellus ex. Proin porttitor, ligula ultrices commodo ultricies, nisi orci dictum sapien, id fermentum dolor orci eget ligula. Vestibulum sit amet risus eu turpis mollis efficitur. Donec eget mauris at sapien euismod viverra in in quam. Suspendisse luctus, magna vitae interdum blandit, dolor magna gravida ante, ac fringilla mi eros id odio. Nulla est purus, imperdiet quis metus ac, consequat euismod augue. Nam placerat luctus neque eu pellentesque. Aliquam vel neque quam. Duis nec arcu nibh.\n\nNulla faucibus aliquet justo tempus mattis. Sed vel sapien vestibulum, porta tellus ac, finibus eros. Pellentesque aliquet turpis sed justo consectetur, vitae bibendum est tristique. Phasellus bibendum libero id orci rutrum, ac efficitur felis ultricies. Maecenas varius elementum enim, vitae tincidunt massa mollis in. Donec tristique augue mollis consectetur pretium. Vivamus vel magna congue, elementum eros id, pellentesque ex. Donec aliquet tempor malesuada. Vivamus lectus enim, tempor vitae sapien eu, lobortis condimentum odio. Ut auctor dolor ac lectus dignissim iaculis. '),
(3, 6, 3, 'Fejezet 3', '\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis felis quam, non finibus ex commodo at. Proin aliquet mattis urna a fringilla. Donec molestie non urna sit amet varius. Nam commodo dui eu laoreet rhoncus. Nullam nec tortor purus. Phasellus quis felis nec nibh facilisis faucibus. Morbi dolor sapien, consequat a nulla a, ullamcorper elementum metus. Quisque nulla velit, gravida non tempus quis, vulputate vitae enim. Nunc faucibus ullamcorper arcu eget volutpat. Nunc massa mauris, dictum et ullamcorper vitae, efficitur rutrum elit. Phasellus facilisis risus mi, at rutrum arcu molestie ut. Nullam interdum sem dui, ac scelerisque ligula mollis a.\n\nSed nec lorem ac neque iaculis tristique ut et velit. Nullam nec diam vitae neque laoreet ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque et quam eget sapien congue rutrum ac eget arcu. Mauris id est tellus. Cras leo nunc, suscipit ut consequat aliquet, venenatis in nisi. Pellentesque ipsum est, bibendum a quam quis, ultrices eleifend urna. Suspendisse mollis efficitur risus, a ultrices metus accumsan quis. Morbi purus odio, commodo eget ultrices ut, congue sit amet mauris. Fusce fringilla magna non pretium finibus.\n\nMorbi eu leo sed dui elementum sodales quis et odio. Aliquam euismod in nulla pharetra convallis. Nullam eros enim, vulputate vel odio eget, consectetur convallis nunc. Quisque sit amet elit suscipit, pharetra felis sed, ullamcorper nisl. Aenean et odio bibendum, sodales justo quis, tempus eros. Mauris in lectus vitae dui gravida venenatis. Nullam eu placerat mi.\n\nNulla sit amet fringilla felis. Vestibulum scelerisque tincidunt tristique. Maecenas vitae consectetur turpis. In consequat metus augue, sed tempus nisl ullamcorper non. Etiam vehicula facilisis dui vitae convallis. Curabitur sed iaculis neque. Maecenas pulvinar odio ac pretium egestas. Proin hendrerit purus ut felis interdum, a volutpat diam consectetur. Ut nec tellus aliquet, semper sapien in, auctor lorem.\n\nMorbi ornare tempor lacus, quis pharetra turpis aliquam nec. In hac habitasse platea dictumst. Morbi molestie fermentum sodales. Phasellus accumsan sapien eget dolor fringilla, id sodales enim venenatis. Aliquam erat volutpat. Pellentesque lectus dui, tempus maximus pharetra eget, vestibulum ac magna. Quisque suscipit posuere mi ut scelerisque. Duis scelerisque suscipit laoreet. ');

-- --------------------------------------------------------

--
-- Table structure for table `commentlikes`
--

CREATE TABLE `commentlikes` (
  `Id` int(11) NOT NULL,
  `CommentId` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `IsLike` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `CommentId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `CommentMessage` longtext NOT NULL,
  `CommenterId` varchar(255) NOT NULL,
  `Likes` int(11) NOT NULL,
  `Dislikes` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ModifiedAt` datetime(6) DEFAULT NULL,
  `ParentCommentId` int(11) DEFAULT NULL,
  `ThreadId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `completedachievements`
--

CREATE TABLE `completedachievements` (
  `Id` int(11) NOT NULL,
  `AchievementId` int(11) NOT NULL,
  `CompleterId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `criticratings`
--

CREATE TABLE `criticratings` (
  `RatingId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `RatingValue` int(11) NOT NULL,
  `RaterId` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ModifiedAt` datetime(6) DEFAULT NULL,
  `RatingDescription` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

CREATE TABLE `favourites` (
  `FavouriteId` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `BookId` int(11) NOT NULL,
  `ChapterNumber` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `GenreId` int(11) NOT NULL,
  `GenreName` longtext NOT NULL,
  `IsAgeRestricted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`GenreId`, `GenreName`, `IsAgeRestricted`) VALUES
(1, 'Rock', 0),
(2, 'Pop', 0),
(3, 'Jazz', 0),
(4, 'Blues', 0),
(5, 'Klasszikus', 0),
(6, 'Hip-Hop', 0),
(7, 'Elektronikus', 0),
(8, 'Reggae', 0),
(9, 'Country', 0),
(10, 'Népzene', 0),
(11, 'Metal', 1),
(12, 'Punk', 0),
(13, 'Diszkó', 0),
(14, 'Funk', 0),
(15, 'R&B', 0),
(16, 'Soul', 0),
(17, 'Gospel', 0),
(18, 'Latin', 0),
(19, 'Opera', 0),
(20, 'Indie', 0),
(21, 'Alternatív', 0),
(22, 'Techno', 0),
(23, 'Trance', 0),
(24, 'House', 0),
(25, 'Ambient', 0),
(26, 'New Age', 0),
(27, 'Dubstep', 0),
(28, 'Hardcore', 1),
(29, 'Grunge', 0),
(30, 'Indusztriális', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ranks`
--

CREATE TABLE `ranks` (
  `RankId` int(11) NOT NULL,
  `RankName` longtext NOT NULL,
  `PointsRequired` int(11) NOT NULL,
  `PointsDescription` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` (`RankId`, `RankName`, `PointsRequired`, `PointsDescription`) VALUES
(1, 'Beginner', 0, 'Minden kezdet nehéz, de ez az első lépés az úton.'),
(2, 'Novice', 100, 'Az alapokat már érted, de még hosszú az út.'),
(3, 'Apprentice', 250, 'Most már a tanulóidődet töltöd, és fejlődsz.'),
(4, 'Journeyman', 350, 'Haladó vagy, és egyre magabiztosabb.'),
(5, 'Adept', 480, 'Egy mester keze alatt sokat tanultál.'),
(6, 'Expert', 800, 'A tudásod mélyül, már szakértőként ismernek.'),
(7, 'Master', 1250, 'Mesterré váltál, és másokat is inspirálsz.'),
(8, 'GrandMaster', 2000, 'A mesterek mestere vagy, igazi legendává váltál.'),
(9, 'Sage', 3200, 'Bölcsességed határtalan, mindenki rád figyel.'),
(10, 'GreatSage', 6000, 'A legnagyobb bölcs, aki minden kérdésre választ tud.'),
(11, 'Epic', 8500, 'A történetekben megörökített hős, aki felülmúl mindenkit.'),
(12, 'Legend', 12000, 'A neved már legenda, generációk emlékeznek rád.'),
(13, 'Immortal', 20000, 'Az örökkévalóság urává váltál.'),
(14, 'Godly', 35000, 'Isteni erő, amelyet már csak a legnagyobbak birtokolhatnak.'),
(15, 'Unreal', 50000, 'Valóságtól független létezés, a határok megszűntek.'),
(16, 'Cosmic', 65000, 'A kozmikus erők mestere vagy.'),
(17, 'Outerversal', 80000, 'A létezés minden szintjét meghaladtad.'),
(18, 'Ascendant', 100000, 'A mindenség felett állsz, a végső uralom a tiéd.');

-- --------------------------------------------------------

--
-- Table structure for table `readerratings`
--

CREATE TABLE `readerratings` (
  `RatingId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `RatingValue` int(11) NOT NULL,
  `RaterId` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ModifiedAt` datetime(6) DEFAULT NULL,
  `RatingDescription` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `ReportId` int(11) NOT NULL,
  `ReporterId` varchar(255) NOT NULL,
  `ReportedPersonId` varchar(255) DEFAULT NULL,
  `ReportTypeId` int(11) NOT NULL,
  `ReportMessage` longtext DEFAULT NULL,
  `IsHandled` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reporttypes`
--

CREATE TABLE `reporttypes` (
  `ReportTypeId` int(11) NOT NULL,
  `ReportTypeName` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `RequestId` int(11) NOT NULL,
  `RequesterId` varchar(255) NOT NULL,
  `RequestMessage` longtext DEFAULT NULL,
  `RequestDate` datetime(6) NOT NULL,
  `IsApproved` tinyint(1) NOT NULL,
  `IsHandled` tinyint(1) NOT NULL,
  `RequestType` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `SubscriptionId` int(11) NOT NULL,
  `SubscriptionName` longtext DEFAULT NULL,
  `SubscriptionDescription` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`SubscriptionId`, `SubscriptionName`, `SubscriptionDescription`) VALUES
(1, 'Newborn', 'Az újjászületés pillanata, amikor minden lehetséges.'),
(2, 'Sloth', 'A lustaság bűvköre, ahol az idő lassan folyik.'),
(3, 'Envy', 'A zöld szemű szörny árnyékában, mindig többre vágysz.'),
(4, 'Greed', 'Az arany csillogása vakít, sosem elég, mindig többet akarsz.'),
(5, 'Lust', 'Az érzékek mámora, amely felemészt és elcsábít.'),
(6, 'Wrath', 'A düh tomboló viharja, amely mindent elsöpör.'),
(7, 'Pride', 'A büszkeség trónja, ahol a világ elismerése körbevesz.'),
(8, 'Gluttony', 'A torkosság megtestesitője, mindent és mindenkit elnyelsz.');

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20250331192704_initial', '8.0.12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`AchievementId`);

--
-- Indexes for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`);

--
-- Indexes for table `aspnetroles`
--
ALTER TABLE `aspnetroles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RoleNameIndex` (`NormalizedName`);

--
-- Indexes for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetUserClaims_UserId` (`UserId`);

--
-- Indexes for table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  ADD KEY `IX_AspNetUserLogins_UserId` (`UserId`);

--
-- Indexes for table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD PRIMARY KEY (`UserId`,`RoleId`),
  ADD KEY `IX_AspNetUserRoles_RoleId` (`RoleId`);

--
-- Indexes for table `aspnetusers`
--
ALTER TABLE `aspnetusers`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  ADD KEY `EmailIndex` (`NormalizedEmail`);

--
-- Indexes for table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD PRIMARY KEY (`UserId`,`LoginProvider`,`Name`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`BookId`),
  ADD KEY `IX_Books_ApplicationUserId` (`ApplicationUserId`),
  ADD KEY `IX_Books_AuthorId` (`AuthorId`),
  ADD KEY `IX_Books_CategoryId` (`CategoryId`),
  ADD KEY `IX_Books_GenreId` (`GenreId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryId`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`ChapterId`),
  ADD KEY `IX_Chapters_BookId` (`BookId`);

--
-- Indexes for table `commentlikes`
--
ALTER TABLE `commentlikes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_CommentLikes_CommentId` (`CommentId`),
  ADD KEY `IX_CommentLikes_UserId` (`UserId`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`CommentId`),
  ADD KEY `IX_Comments_BookId` (`BookId`),
  ADD KEY `IX_Comments_CommenterId` (`CommenterId`);

--
-- Indexes for table `completedachievements`
--
ALTER TABLE `completedachievements`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_CompletedAchievements_AchievementId` (`AchievementId`),
  ADD KEY `IX_CompletedAchievements_CompleterId` (`CompleterId`);

--
-- Indexes for table `criticratings`
--
ALTER TABLE `criticratings`
  ADD PRIMARY KEY (`RatingId`),
  ADD KEY `IX_CriticRatings_BookId` (`BookId`);

--
-- Indexes for table `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`FavouriteId`),
  ADD KEY `IX_Favourites_BookId` (`BookId`),
  ADD KEY `IX_Favourites_UserId` (`UserId`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`GenreId`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`RankId`);

--
-- Indexes for table `readerratings`
--
ALTER TABLE `readerratings`
  ADD PRIMARY KEY (`RatingId`),
  ADD KEY `IX_ReaderRatings_BookId` (`BookId`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`ReportId`),
  ADD KEY `IX_Reports_ReportedPersonId` (`ReportedPersonId`),
  ADD KEY `IX_Reports_ReporterId` (`ReporterId`),
  ADD KEY `IX_Reports_ReportTypeId` (`ReportTypeId`);

--
-- Indexes for table `reporttypes`
--
ALTER TABLE `reporttypes`
  ADD PRIMARY KEY (`ReportTypeId`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`RequestId`),
  ADD KEY `IX_Requests_RequesterId` (`RequesterId`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`SubscriptionId`);

--
-- Indexes for table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `AchievementId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `BookId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `ChapterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `commentlikes`
--
ALTER TABLE `commentlikes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `CommentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `completedachievements`
--
ALTER TABLE `completedachievements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criticratings`
--
ALTER TABLE `criticratings`
  MODIFY `RatingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favourites`
--
ALTER TABLE `favourites`
  MODIFY `FavouriteId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `GenreId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `RankId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `readerratings`
--
ALTER TABLE `readerratings`
  MODIFY `RatingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `ReportId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reporttypes`
--
ALTER TABLE `reporttypes`
  MODIFY `ReportTypeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `RequestId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `SubscriptionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `FK_Books_AspNetUsers_ApplicationUserId` FOREIGN KEY (`ApplicationUserId`) REFERENCES `aspnetusers` (`Id`),
  ADD CONSTRAINT `FK_Books_AspNetUsers_AuthorId` FOREIGN KEY (`AuthorId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Books_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`CategoryId`),
  ADD CONSTRAINT `FK_Books_Genre_GenreId` FOREIGN KEY (`GenreId`) REFERENCES `genre` (`GenreId`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `FK_Chapters_Books_BookId` FOREIGN KEY (`BookId`) REFERENCES `books` (`BookId`) ON DELETE CASCADE;

--
-- Constraints for table `commentlikes`
--
ALTER TABLE `commentlikes`
  ADD CONSTRAINT `FK_CommentLikes_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CommentLikes_Comments_CommentId` FOREIGN KEY (`CommentId`) REFERENCES `comments` (`CommentId`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK_Comments_AspNetUsers_CommenterId` FOREIGN KEY (`CommenterId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Comments_Books_BookId` FOREIGN KEY (`BookId`) REFERENCES `books` (`BookId`) ON DELETE CASCADE;

--
-- Constraints for table `completedachievements`
--
ALTER TABLE `completedachievements`
  ADD CONSTRAINT `FK_CompletedAchievements_Achievements_AchievementId` FOREIGN KEY (`AchievementId`) REFERENCES `achievements` (`AchievementId`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_CompletedAchievements_AspNetUsers_CompleterId` FOREIGN KEY (`CompleterId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `criticratings`
--
ALTER TABLE `criticratings`
  ADD CONSTRAINT `FK_CriticRatings_Books_BookId` FOREIGN KEY (`BookId`) REFERENCES `books` (`BookId`) ON DELETE CASCADE;

--
-- Constraints for table `favourites`
--
ALTER TABLE `favourites`
  ADD CONSTRAINT `FK_Favourites_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Favourites_Books_BookId` FOREIGN KEY (`BookId`) REFERENCES `books` (`BookId`) ON DELETE CASCADE;

--
-- Constraints for table `readerratings`
--
ALTER TABLE `readerratings`
  ADD CONSTRAINT `FK_ReaderRatings_Books_BookId` FOREIGN KEY (`BookId`) REFERENCES `books` (`BookId`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `FK_Reports_AspNetUsers_ReportedPersonId` FOREIGN KEY (`ReportedPersonId`) REFERENCES `aspnetusers` (`Id`),
  ADD CONSTRAINT `FK_Reports_AspNetUsers_ReporterId` FOREIGN KEY (`ReporterId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Reports_ReportTypes_ReportTypeId` FOREIGN KEY (`ReportTypeId`) REFERENCES `reporttypes` (`ReportTypeId`) ON DELETE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `FK_Requests_AspNetUsers_RequesterId` FOREIGN KEY (`RequesterId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
