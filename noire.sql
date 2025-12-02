-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2025. Dec 02. 13:56
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
(8, 1, 11, 'Nagyon szép, de ha a Holdat akarod kiemelni, akkor legközelebb zoomolj rá jobban!', '2025-11-10 11:58:30'),
(9, 4, 12, 'Nagyon szép ügyes vagy!!', '2025-11-13 11:57:32'),
(10, 4, 8, 'Uhhh. De komoly kép lett.', '2025-11-13 12:00:17'),
(11, 3, 10, 'Nagyon aranyos😍', '2025-11-13 12:01:34'),
(12, 3, 9, 'Kezdőként nagyon jó kép. Így tovább. Remélem láthatunk még tőled képeket.', '2025-11-13 12:02:44');

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
(46, 1, 2, 1, '2025-12-02 12:54:44'),
(51, 4, 1, 1, '2025-12-02 12:54:44'),
(52, 4, 3, 1, '2025-12-02 12:54:44'),
(53, 4, 5, 1, '2025-12-02 12:54:44'),
(54, 3, 5, 1, '2025-12-02 12:54:44');

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
(19, 1, 3);

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
(2, 1, 'Mercedes', 'A legszebb merci amit valaha láttam!', '2025-10-27 17:43:22', '/images/1761579802620.jpg'),
(3, 1, 'Tájkép', 'Ezt a képet egy másik országban készítettem, lenyűgöző volt a látvány!', '2025-10-27 19:02:33', '/images/1761584553646.jpg'),
(4, 1, 'Bringás kép', 'Itt egy bringás kép rólam. Szerintetek jó szögből készült a kép? Vélemények?', '2025-10-27 19:03:49', '/images/1761584629316.jpg'),
(5, 2, 'Tó az erdőben', 'Ezt a képet Kanadában készítettem, lenyűgöző látvánnyal.\r\n\r\nZáridő: kb. 10–30 másodperc\r\nRekesz: f/8 – f/1\r\nISO: 100\r\nGyújtótávolság: 18–24 mm ', '2025-10-27 19:13:21', '/images/1761585201828.jpg'),
(6, 2, 'Izlandi hegység', 'Záridő: kb. 1/60 – 1/125 mp\r\nRekeszérték: f/8 – f/11\r\nISO érzékenység: 100 – 200\r\nGyújtótávolság: kb. 24–35 mm (nagylátószög)\r\nFehéregyensúly: napfény (kb. 5500 K)', '2025-10-27 19:41:21', '/images/1761586881317.jpg'),
(7, 3, 'Nissan GTR R35', 'Szerintetek megpályázhatok egy versenyt ezzel a képpel?\r\nFényképezőgép: Sony A7R IV (Full Frame)\r\nObjektív: Sony FE 24–70mm f/2.8 GM\r\nGyújtótávolság: 35 mm\r\nRekesz (Aperture): f/5.6 — hogy az autó teljes élességben maradjon, de a háttér enyhén elmosódjon\r\nZáridő: 1/125 s — épp elég ahhoz, hogy kézből is éles legyen, miközben megőrzi a természetes fényeket\r\nISO: 200 — alacsony zaj, tiszta tónusok érdekében\r\nFehéregyensúly: Naplemente előbeállítás (kb. 6000K), hogy melegebb árnyalatokat kapjak\r\nUtómunka:\r\nEnyhe kontrasztnövelés és szaturáció az autó kiemelésére\r\nÁrnyékok világosítása, hogy a részletek ne vesszenek el\r\nÉgbolt enyhe színkiemelése a naplemente hangulatának fokozására', '2025-11-02 15:13:48', '/images/1762092828512.jpg'),
(8, 3, 'Görögország', 'Telefonnal csináltam Görög nyaraláson során. Semmi extra beállítás csak egy jól elkapott pillanat.😎\nTelefonom: Samsung Galaxy S25', '2025-11-02 15:25:26', '/images/1762093526424.jpg'),
(9, 4, 'Naplementés Balaton', 'Tavaly nyáron készítettem ezt a naplementés képet a Balatonról a telefonommal.\r\nTelefon: Samsung Galaxy S22', '2025-11-02 15:40:36', '/images/1762094436028.jpg'),
(10, 4, 'Teknős', 'Egyik nyaraláson csináltam ezt a képet erről az aranyos teknősről. Remélem tetszik nektek. A Samsung Galaxy S22-es telefonnal készítettem ezt a képet.', '2025-11-10 11:09:03', '/images/1762769343370.jfif'),
(11, 4, 'Vérhold', '2025 szeptember 7-én látható volt Magyarországon vérhold és ezt próbáltam lencse végre kapni, kisebb nagyobb sikerrel. Ezt a képet egy Iphone 14-el csináltam.', '2025-11-10 11:13:33', '/images/1762769613542.jfif'),
(12, 1, 'Lánchíd', 'Ezt a képet tegnap este készítettem, hosszú expozícióval az Iphone 13 telefonommal :)', '2025-11-10 12:07:48', '/images/1762772868073.jpg'),
(13, 3, 'Kékes', 'Smash or Pass?\nBeállítások:\nFényképezőgép: Canon EOS R6.\nObjektív: RF 24–105mm f/4 L IS USM.\nGyújtótávolság: 35 mm.\nRekesz: f/8 – részletgazdag, mély élességtartomány.\nZáridő: 1/100 s.\nISO: 200.\nFehéregyensúly: Árnyék / Naplemente mód (~6000K).\nUtómunka:\nMeleg színtónus kiemelése a naplemente hangulatához.', '2025-11-13 12:09:02', '/images/1763032142632.webp'),
(14, 3, 'Vaddisznó', 'Nem rég egy barátommal vadászni jártam. Ő vadász én pedig egy fotós és ez lett a legjobb kép. Beállítások:\r\nFényképezőgép: Nikon D750.\r\nObjektív: Nikkor 70–200mm f/2.8.\r\nGyújtótávolság: 150 mm.\r\nRekesz: f/3.5 — sekély mélységélesség, hogy az állat kiemelkedjen a háttérből.\r\nZáridő: 1/500 s — az esetleges mozgás befagyasztásához. Fókusz: állat szemein.', '2025-11-13 12:14:38', '/images/1763032478390.webp');

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
(7, 33),
(7, 34),
(7, 35),
(7, 36),
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
(12, 22),
(12, 23),
(12, 24),
(12, 25),
(13, 26),
(13, 27),
(14, 11),
(14, 15),
(14, 28),
(14, 29),
(14, 30);

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
(72, 2, 3, 1, '2025-12-02 12:54:44'),
(103, 2, 4, 1, '2025-12-02 12:54:44'),
(129, 1, 4, 1, '2025-12-02 12:54:44'),
(140, 1, 3, 1, '2025-12-02 12:54:44'),
(157, 2, 6, 1, '2025-12-02 12:54:44'),
(158, 2, 5, 1, '2025-12-02 12:54:44'),
(171, 1, 5, 1, '2025-12-02 12:54:44'),
(172, 3, 6, 1, '2025-12-02 12:54:44'),
(173, 3, 2, 1, '2025-12-02 12:54:44'),
(174, 3, 7, 1, '2025-12-02 12:54:44'),
(175, 3, 8, 1, '2025-12-02 12:54:44'),
(176, 4, 9, 1, '2025-12-02 12:54:44'),
(177, 4, 6, 1, '2025-12-02 12:54:44'),
(178, 4, 7, 1, '2025-12-02 12:54:44'),
(179, 4, 8, 1, '2025-12-02 12:54:44'),
(180, 4, 11, 1, '2025-12-02 12:54:44'),
(181, 4, 10, 1, '2025-12-02 12:54:44'),
(182, 1, 6, 1, '2025-12-02 12:54:44'),
(183, 1, 10, 1, '2025-12-02 12:54:44'),
(186, 1, 11, 1, '2025-12-02 12:54:44'),
(187, 4, 12, 1, '2025-12-02 12:54:44'),
(188, 3, 12, 1, '2025-12-02 12:54:44'),
(190, 3, 9, 1, '2025-12-02 12:54:44'),
(191, 3, 13, 1, '2025-12-02 12:54:44'),
(192, 3, 14, 1, '2025-12-02 12:54:44'),
(193, 3, 10, 1, '2025-12-02 12:54:44');

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
(33, 'Autó'),
(12, 'Bike'),
(14, 'Bringa'),
(22, 'Budapest'),
(5, 'Car'),
(19, 'Cuki'),
(24, 'Éjszaka'),
(15, 'Erdő'),
(31, 'Görögország'),
(35, 'GTR'),
(32, 'Hajó'),
(27, 'Hegy'),
(17, 'Hegység'),
(21, 'Hold'),
(26, 'Kékes'),
(13, 'Kerékpár'),
(23, 'Lánchíd'),
(29, 'Malac'),
(4, 'Mercedes'),
(34, 'Nissan'),
(36, 'R35'),
(18, 'Teknős'),
(20, 'Tenger'),
(11, 'Természet'),
(16, 'Tó'),
(30, 'Vadászat'),
(28, 'Vaddisznó'),
(25, 'Város');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `comment_votes`
--
ALTER TABLE `comment_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT a táblához `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `image_votes`
--
ALTER TABLE `image_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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
