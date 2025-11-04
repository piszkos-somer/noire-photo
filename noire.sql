-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2025. Nov 04. 09:34
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
(2, 2, 3, 'Az igen! Kezdőnek nem is rossz, bár egy kicsit feljebb vettem volna a szaturációt, mert illene az ilyen fényekkel dolgoz képnél. Ha leírod a kamerád típusát, szívesen segítek ebben.', '2025-10-28 15:49:22'),
(3, 1, 5, 'Tényleg nagyon jó!', '2025-10-29 17:28:44'),
(4, 3, 6, 'Azta ez nagyon király lett.', '2025-11-02 15:04:27'),
(5, 3, 2, 'Én láttam már szebbett. De amugy nem rossz kép. Meg tudnád mondani milyen fényképezővel csináltad és milyen beállításokkal?', '2025-11-02 15:05:41'),
(6, 3, 4, 'Elég menő. Talán egy kicsi utómunkával lehetne javítani rajta. Ha segítség kéne bátran írj.', '2025-11-02 15:17:52'),
(7, 4, 1, 'Nagyon aranyos. Hol készítetted ezt a képet. Kint a természetben vagy állatkertben?', '2025-11-02 15:42:22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `comment_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comment_likes`
--

INSERT INTO `comment_likes` (`id`, `user_id`, `comment_id`) VALUES
(45, 1, 1),
(46, 1, 2),
(39, 2, 1),
(51, 4, 1);

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
  `url` varchar(255) NOT NULL,
  `likes` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `images`
--

INSERT INTO `images` (`id`, `user_id`, `title`, `description`, `upload_date`, `url`, `likes`) VALUES
(1, 1, 'tigriske', 'ez egy szép tigris petzd', '2025-10-27 17:17:15', '/images/1761578235052.jpg', 1),
(2, 1, 'Mercedes', 'A legszebb merci amit valaha láttam!', '2025-10-27 17:43:22', '/images/1761579802620.jpg', 1),
(3, 1, 'Tájkép', 'Ezt a képet egy másik országban készítettem, lenyűgöző volt a látvány!', '2025-10-27 19:02:33', '/images/1761584553646.jpg', 2),
(4, 1, 'Bringás kép', 'Itt egy bringás kép rólam. Szerintetek jó szögből készült a kép? Vélemények?', '2025-10-27 19:03:49', '/images/1761584629316.jpg', 2),
(5, 2, 'Tó az erdőben', 'Ezt a képet Kanadában készítettem, lenyűgöző látvánnyal.\r\n\r\nZáridő: kb. 10–30 másodperc\r\nRekesz: f/8 – f/1\r\nISO: 100\r\nGyújtótávolság: 18–24 mm ', '2025-10-27 19:13:21', '/images/1761585201828.jpg', 2),
(6, 2, 'Izlandi hegység', 'Záridő: kb. 1/60 – 1/125 mp\r\nRekeszérték: f/8 – f/11\r\nISO érzékenység: 100 – 200\r\nGyújtótávolság: kb. 24–35 mm (nagylátószög)\r\nFehéregyensúly: napfény (kb. 5500 K)', '2025-10-27 19:41:21', '/images/1761586881317.jpg', 3),
(7, 3, 'Nissan GTR R35', 'Szerintetek megpályázhatok egy versenyt ezzel a képpel?\r\nFényképezőgép: Sony A7R IV (Full Frame)\r\nObjektív: Sony FE 24–70mm f/2.8 GM\r\nGyújtótávolság: 35 mm\r\nRekesz (Aperture): f/5.6 — hogy az autó teljes élességben maradjon, de a háttér enyhén elmosódjon\r\nZáridő: 1/125 s — épp elég ahhoz, hogy kézből is éles legyen, miközben megőrzi a természetes fényeket\r\nISO: 200 — alacsony zaj, tiszta tónusok érdekében\r\nFehéregyensúly: Naplemente előbeállítás (kb. 6000K), hogy melegebb árnyalatokat kapjak\r\nUtómunka:\r\nEnyhe kontrasztnövelés és szaturáció az autó kiemelésére\r\nÁrnyékok világosítása, hogy a részletek ne vesszenek el\r\nÉgbolt enyhe színkiemelése a naplemente hangulatának fokozására', '2025-11-02 15:13:48', '/images/1762092828512.jpg', 2),
(8, 3, 'Görögország', 'Telefonnal csináltam Görög nyaraláson során. Semmi extra beállítás csak egy jól elkapott pillanat.\nTelefonom: Samsung Galaxy S25', '2025-11-02 15:25:26', '/images/1762093526424.jpg', 2),
(9, 4, 'Naplementés Balaton', 'Tavaly nyáron készítettem ezt a naplementés képet a Balatonról a telefonommal.\r\nTelefon: Samsung Galaxy S22', '2025-11-02 15:40:36', '/images/1762094436028.jpg', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image_likes`
--

CREATE TABLE `image_likes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `image_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `image_likes`
--

INSERT INTO `image_likes` (`id`, `user_id`, `image_id`) VALUES
(78, 1, 1),
(140, 1, 3),
(129, 1, 4),
(171, 1, 5),
(72, 2, 3),
(103, 2, 4),
(158, 2, 5),
(157, 2, 6),
(173, 3, 2),
(172, 3, 6),
(174, 3, 7),
(175, 3, 8),
(177, 4, 6),
(178, 4, 7),
(179, 4, 8),
(176, 4, 9);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image_reactions`
--

CREATE TABLE `image_reactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `image_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `reaction_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 2),
(2, 4),
(2, 5),
(3, 11),
(3, 15),
(3, 16),
(4, 12),
(4, 13),
(4, 14),
(5, 15),
(5, 16),
(6, 11),
(6, 17),
(7, 5),
(8, 11),
(9, 11),
(9, 16);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reactions`
--

CREATE TABLE `reactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `reaction_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(12, 'Bike'),
(14, 'Bringa'),
(5, 'Car'),
(15, 'Erdő'),
(17, 'Hegység'),
(13, 'Kerékpár'),
(4, 'Mercedes'),
(11, 'Természet'),
(2, 'tigris'),
(16, 'Tó');

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
(3, 'Dávid', 'kabzso820@hengersor.hu', '$2b$10$77rO1/wis8plfrsb8ooWhuFVRhr3D8oH34ZRF13qH/plHpzArhft.', 'Sziasztok Dávid vagyok. Mizu? Tapasztalt, de egyáltalán nem profi fotós vagyok. Csak egy átlagos srác aki a fotózás szerelmese.', '/profile-pictures/1762092187007.png'),
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
-- A tábla indexei `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_like` (`user_id`,`comment_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `image_likes`
--
ALTER TABLE `image_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`image_id`),
  ADD UNIQUE KEY `unique_user_image_like` (`user_id`,`image_id`),
  ADD KEY `image_id` (`image_id`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `image_likes`
--
ALTER TABLE `image_likes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT a táblához `image_reactions`
--
ALTER TABLE `image_reactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
-- Megkötések a táblához `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `image_likes`
--
ALTER TABLE `image_likes`
  ADD CONSTRAINT `image_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `image_likes_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE;

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
