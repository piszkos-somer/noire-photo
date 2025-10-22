-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2025. Okt 22. 10:33
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `noire`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
 
USE `noire`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `noire`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `image_id` int(10) UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `image_id`, `comment`, `upload_date`) VALUES
(16, 1, 1, 'Nagyon szép kép!', '2025-10-22 10:00:00'),
(17, 2, 1, 'Tetszik ez a kompozíció.', '2025-10-22 10:05:00'),
(18, 3, 2, 'Csodás színek!', '2025-10-22 11:00:00'),
(19, 4, 3, 'Ez a hely gyönyörű.', '2025-10-22 12:00:00'),
(20, 5, 1, 'Köszönöm, hogy megosztottad!', '2025-10-22 12:30:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `images`
--

CREATE TABLE `images` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `upload_date` datetime NOT NULL DEFAULT current_timestamp(),
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `images`
--

INSERT INTO `images` (`id`, `user_id`, `title`, `description`, `upload_date`, `url`) VALUES
(1, 1, 'Első kép', 'Ez az első kép leírása.', '2025-10-22 10:32:59', '/images/kep1.jpg'),
(2, 2, 'Második kép', 'Ez a második kép leírása.', '2025-10-22 10:32:59', '/images/kep2.jpg'),
(3, 3, 'Harmadik kép', 'Ez a harmadik kép leírása.', '2025-10-22 10:32:59', '/images/kep3.jpg'),
(4, 4, 'Negyedik kép', 'Ez a negyedik kép leírása.', '2025-10-22 10:32:59', '/images/kep4.jpg'),
(5, 5, 'Ötödik kép', 'Ez az ötödik kép leírása.', '2025-10-22 10:32:59', '/images/kep5.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image_reactions`
--

CREATE TABLE `image_reactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `image_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `reaction_id` int(10) UNSIGNED NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `image_reactions`
--

INSERT INTO `image_reactions` (`id`, `image_id`, `user_id`, `reaction_id`, `reacted_at`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 2, 3, 3),
(4, 3, 4, 4),
(5, 1, 5, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image_tags`
--

CREATE TABLE `image_tags` (
  `image_id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `image_tags`
--

INSERT INTO `image_tags` (`image_id`, `tag_id`) VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 4),
(4, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reactions`
--

CREATE TABLE `reactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `reaction_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `reactions`
--

INSERT INTO `reactions` (`id`, `reaction_type`) VALUES
(3, 'haha'),
(1, 'like'),
(2, 'love'),
(5, 'sad'),
(4, 'wow');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tags`
--

CREATE TABLE `tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `tag` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tags`
--

INSERT INTO `tags` (`id`, `tag`) VALUES
(5, 'absztrakt'),
(4, 'állatok'),
(3, 'portré'),
(1, 'természet'),
(2, 'város');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'alice', 'alice@example.com', 'hashed_password_1'),
(2, 'bob', 'bob@example.com', 'hashed_password_2'),
(3, 'carol', 'carol@example.com', 'hashed_password_3'),
(4, 'dave', 'dave@example.com', 'hashed_password_4'),
(5, 'eve', 'eve@example.com', 'hashed_password_5');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `image_id` (`image_id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `image_reactions`
--
ALTER TABLE `image_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_image` (`user_id`,`image_id`),
  ADD KEY `image_id` (`image_id`),
  ADD KEY `reaction_id` (`reaction_id`);

--
-- A tábla indexei `image_tags`
--
ALTER TABLE `image_tags`
  ADD PRIMARY KEY (`image_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- A tábla indexei `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reaction_type` (`reaction_type`);

--
-- A tábla indexei `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag` (`tag`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `image_reactions`
--
ALTER TABLE `image_reactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `image_reactions`
--
ALTER TABLE `image_reactions`
  ADD CONSTRAINT `image_reactions_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_reactions_ibfk_3` FOREIGN KEY (`reaction_id`) REFERENCES `reactions` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `image_tags`
--
ALTER TABLE `image_tags`
  ADD CONSTRAINT `image_tags_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
