-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2026. Jan 20. 14:39
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


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
(1, 1, 5, 'Nagyon szép, és tetszik, hogy pont elkaptad benne a villámot!! 10/11', '2025-10-28 14:25:55'),
(3, 1, 5, 'Tényleg nagyon jó!', '2025-10-29 17:28:44'),
(4, 3, 6, 'Azta ez nagyon király lett.', '2025-11-02 15:04:27'),
(8, 1, 11, 'Nagyon szép, de ha a Holdat akarod kiemelni, akkor legközelebb zoomolj rá jobban!', '2025-11-10 11:58:30'),
(10, 4, 8, 'Uhhh. De komoly kép lett.', '2025-11-13 12:00:17'),
(11, 3, 10, 'Nagyon aranyos😍', '2025-11-13 12:01:34'),
(12, 3, 9, 'Kezdőként nagyon jó kép. Így tovább. Remélem láthatunk még tőled képeket.', '2025-11-13 12:02:44'),
(14, 4, 15, 'Nagyon jó lett. Érdekelnek a beállítások le tudnád írni légyszi?', '2026-01-12 12:07:16'),
(15, 4, 17, 'Jézus, ez egy nagyon komoly kép lett. Szerintem simán megpályázhatnál ezzel egy versenyt.', '2026-01-12 12:10:01'),
(16, 1, 16, 'Az igen! Milyen rekeszértéket és expozíció beállításokat használtál? Üdv, Shomer', '2026-01-20 14:00:17'),
(17, 3, 16, 'Cum', '2026-01-20 14:34:03'),
(18, 3, 18, 'EZARTZ', '2026-01-20 14:36:05');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comment_votes`
--

CREATE TABLE `comment_votes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `comment_id` int(10) UNSIGNED NOT NULL,
  `vote` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comment_votes`
--

INSERT INTO `comment_votes` (`id`, `user_id`, `comment_id`, `vote`, `created_at`) VALUES
(39, 2, 1, 1, '2025-12-02 12:54:44'),
(45, 1, 1, 1, '2025-12-02 12:54:44'),
(51, 4, 1, 1, '2025-12-02 12:54:44'),
(52, 4, 3, 1, '2025-12-02 12:54:44'),
(55, 4, 11, 1, '2026-01-12 11:07:22'),
(58, 3, 16, 1, '2026-01-20 13:34:05'),
(59, 3, 18, 1, '2026-01-20 13:36:07');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `follows`
--

CREATE TABLE `follows` (
  `id` int(10) UNSIGNED NOT NULL,
  `follower_id` int(10) UNSIGNED NOT NULL,
  `following_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `follows`
--

INSERT INTO `follows` (`id`, `follower_id`, `following_id`) VALUES
(23, 1, 3),
(20, 1, 4),
(24, 3, 2);

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
(5, 2, 'Tó az erdőben', 'Ezt a képet Kanadában készítettem, lenyűgöző látvánnyal.\r\n\r\nZáridő: kb. 10–30 másodperc\r\nRekesz: f/8 – f/1\r\nISO: 100\r\nGyújtótávolság: 18–24 mm ', '2025-10-27 19:13:21', '/images/1761585201828.jpg'),
(6, 2, 'Izlandi hegység', 'Záridő: kb. 1/60 – 1/125 mp\r\nRekeszérték: f/8 – f/11\r\nISO érzékenység: 100 – 200\r\nGyújtótávolság: kb. 24–35 mm (nagylátószög)\r\nFehéregyensúly: napfény (kb. 5500 K)', '2025-10-27 19:41:21', '/images/1761586881317.jpg'),
(8, 3, 'Görögország', 'Telefonnal csináltam Görög nyaraláson során. Semmi extra beállítás csak egy jól elkapott pillanat.😎\nTelefonom: Samsung Galaxy S25', '2025-11-02 15:25:26', '/images/1762093526424.jpg'),
(9, 4, 'Naplementés Balaton', 'Tavaly nyáron készítettem ezt a naplementés képet a Balatonról a telefonommal.\r\nTelefon: Samsung Galaxy S22', '2025-11-02 15:40:36', '/images/1762094436028.jpg'),
(10, 4, 'Teknős', 'Egyik nyaraláson csináltam ezt a képet erről az aranyos teknősről. Remélem tetszik nektek. A Samsung Galaxy S22-es telefonnal készítettem ezt a képet.', '2025-11-10 11:09:03', '/images/1762769343370.jfif'),
(11, 4, 'Vérhold', '2025 szeptember 7-én látható volt Magyarországon vérhold és ezt próbáltam lencse végre kapni, kisebb nagyobb sikerrel. Ezt a képet egy Iphone 14-el csináltam.', '2025-11-10 11:13:33', '/images/1762769613542.jfif'),
(15, 3, 'Cicám Félix', 'Nem rég tök jól elkaptam a cicámat Félixet miközben feküdt az ágyamon a délutáni alvását végezve. A telefonommal készítettem. (iPhone 12 Pro Max) A hátteret kicsit elhalványítottam, hogy a macska legyen a fókuszba. Írjatok, ha érdekel a beállítások.', '2025-12-16 12:05:35', '/images/1765883135303.jpg'),
(16, 3, 'Túra a Mátrában', '1 hete voltam túrázni a barátaimmal a Mátrában ahol ezt a képet lőttem. Fényképezőgép: Full-frame DSLR, Objektív: 24–70 mm f/2.8, Gyújtótávolság: 35 mm', '2025-12-16 12:10:43', '/images/1765883443941.jpg'),
(17, 3, 'Tábortűz', 'Amikor voltunk a Mátrába túrázni, akkor tettünk egy tábortüzet. Sikerült elkapni egy jó pillanatot.Fényképezőgép: Full-frame DSLR, Objektív: 24–70 mm f/2.8, Gyújtótávolság: 35–50 mm, Záridő: 1/60 s, Rekesz: f/2.8', '2025-12-16 12:14:20', '/images/1765883660781.jpg'),
(18, 3, 'asd', 'asd', '2026-01-20 14:35:50', '/images/1768916150264.jpg');

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
(5, 15),
(5, 16),
(6, 11),
(6, 17),
(8, 11),
(8, 20),
(8, 31),
(8, 32),
(9, 11),
(9, 16),
(10, 11),
(10, 18),
(10, 19),
(10, 20),
(11, 21),
(15, 19),
(15, 37),
(15, 38),
(16, 15),
(16, 39),
(16, 40),
(16, 41),
(16, 42),
(17, 43),
(17, 44),
(18, 15),
(18, 20),
(18, 31);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image_votes`
--

CREATE TABLE `image_votes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `image_id` int(10) UNSIGNED NOT NULL,
  `vote` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `image_votes`
--

INSERT INTO `image_votes` (`id`, `user_id`, `image_id`, `vote`, `created_at`) VALUES
(157, 2, 6, 1, '2025-12-02 12:54:44'),
(158, 2, 5, 1, '2025-12-02 12:54:44'),
(171, 1, 5, 1, '2025-12-02 12:54:44'),
(172, 3, 6, -1, '2025-12-02 12:54:44'),
(175, 3, 8, 1, '2025-12-02 12:54:44'),
(176, 4, 9, 1, '2025-12-02 12:54:44'),
(177, 4, 6, 1, '2025-12-02 12:54:44'),
(179, 4, 8, 1, '2025-12-02 12:54:44'),
(180, 4, 11, 1, '2025-12-02 12:54:44'),
(181, 4, 10, 1, '2025-12-02 12:54:44'),
(182, 1, 6, 1, '2025-12-02 12:54:44'),
(183, 1, 10, 1, '2025-12-02 12:54:44'),
(186, 1, 11, 1, '2025-12-02 12:54:44'),
(190, 3, 9, 1, '2025-12-02 12:54:44'),
(193, 3, 10, 1, '2025-12-02 12:54:44'),
(196, 3, 17, 1, '2026-01-12 11:05:19'),
(197, 3, 16, -1, '2026-01-12 11:05:20'),
(198, 3, 15, 1, '2026-01-12 11:05:22'),
(199, 3, 11, 1, '2026-01-12 11:05:44'),
(200, 3, 5, -1, '2026-01-12 11:05:47'),
(201, 4, 17, 1, '2026-01-12 11:06:38'),
(202, 4, 5, 1, '2026-01-12 11:07:42'),
(204, 4, 16, -1, '2026-01-12 11:09:14'),
(205, 1, 15, 1, '2026-01-20 12:09:41'),
(207, 1, 8, 1, '2026-01-20 12:13:28'),
(208, 1, 9, 1, '2026-01-20 12:13:29'),
(209, 1, 16, 1, '2026-01-20 12:21:44'),
(210, 1, 17, 1, '2026-01-20 12:57:57'),
(211, 3, 18, 1, '2026-01-20 13:35:57');

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
(38, 'Cat'),
(37, 'Cica'),
(19, 'Cuki'),
(15, 'Erdő'),
(40, 'Fa'),
(31, 'Görögország'),
(32, 'Hajó'),
(17, 'Hegység'),
(21, 'Hold'),
(39, 'Mátra'),
(41, 'Nap'),
(42, 'Napfelkelte'),
(44, 'Tábortűz'),
(18, 'Teknős'),
(20, 'Tenger'),
(11, 'Természet'),
(16, 'Tó'),
(43, 'Tűz');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `bio`, `profile_picture`) VALUES
(1, 'somer fatera', 'perakattis@gmail.com', '$2b$10$vBS.xhlLasGMI3DPjjr6r.8MlEsnH5wFVAr/V64MXllFI4gaMS76O', 'Sziasztok! Kezdő fotós vagyok, és szeretnék ügyesebb lenni a szakmában. Köszönök minden építő kritikát! aa', '/profile-pictures/1761583927591.jpg'),
(2, 'Papp Sándor', 'pappsanyi@gmail.com', '$2b$10$9/iX2OKNISqPmBo13Svi/OtdCjPTxgSYNoZ7MUcLP0NwLZ7YlTrr2', 'Sziasztok! Sanyi vagyok és 4 éve foglalkozom fotózással. Szívesen megosztom veletek a munkáimat és bármikor fordulhattok hozzám segítségért. Versenyre való felkészítést is vállalok!', '/profile-pictures/1761584967721.jpg'),
(3, 'Dávid', 'kabzso820@hengersor.hu', '$2b$10$77rO1/wis8plfrsb8ooWhuFVRhr3D8oH34ZRF13qH/plHpzArhft.', 'Sziasztok Dávid vagyok. Mizu? Tapasztalt, de egyáltalán nem profi fotós vagyok. Csak egy átlagos srác aki a fotózás szerelmese.', '/profile-pictures/1768215912073.jfif'),
(4, 'Kabai Zsombor', 'kabai.zsombi@gmail.com', '$2b$10$3NiUroXsfKSnwSa6SxQ6Pu9fJhX/9dNH9r/DYTjDq9e4VNW4hjYVq', 'Sziasztok az én nevem Zsombor. Kezdő fotósnak tartom magam. A telefonommal szoktam fotózni és abból próbálom kihozni a legtöbbett.', '/profile-pictures/1762093987308.jpg'),
(5, 'Nagy Ernő', 'habtam963@hengersor.hu', '$2b$10$xMtP8sNLogakmRQ4cfSr/uqJT3TUOTwvbEOpk5SfqAfEYBpSX0Toa', 'Sziasztok, Ernő vagyok. Kezdőként most vettem egy Nikon D3500-at. Nagyon szeretek fotózni, és várom, hogy fejlődjek benne.', '/profile-pictures/1762245188727.jpg');

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
-- A tábla indexei `comment_votes`
--
ALTER TABLE `comment_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_like` (`user_id`,`comment_id`),
  ADD UNIQUE KEY `unique_comment_vote` (`user_id`,`comment_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- A tábla indexei `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follow` (`follower_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `image_tags`
--
ALTER TABLE `image_tags`
  ADD PRIMARY KEY (`image_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- A tábla indexei `image_votes`
--
ALTER TABLE `image_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`image_id`),
  ADD UNIQUE KEY `unique_user_image_like` (`user_id`,`image_id`),
  ADD UNIQUE KEY `unique_image_vote` (`user_id`,`image_id`),
  ADD KEY `image_id` (`image_id`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `comment_votes`
--
ALTER TABLE `comment_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT a táblához `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `image_votes`
--
ALTER TABLE `image_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Megkötések a táblához `comment_votes`
--
ALTER TABLE `comment_votes`
  ADD CONSTRAINT `comment_votes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `image_tags`
--
ALTER TABLE `image_tags`
  ADD CONSTRAINT `image_tags_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `image_votes`
--
ALTER TABLE `image_votes`
  ADD CONSTRAINT `image_votes_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
