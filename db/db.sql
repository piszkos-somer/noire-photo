-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Feb 13. 21:49
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

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
(4, 3, 6, 'Azta ez nagyon király lett.', '2025-11-02 15:04:27'),
(8, 1, 11, 'Nagyon szép, de ha a Holdat akarod kiemelni, akkor legközelebb zoomolj rá jobban!', '2025-11-10 11:58:30'),
(10, 4, 8, 'Uhhh. De komoly kép lett.', '2025-11-13 12:00:17'),
(11, 3, 10, 'Nagyon aranyos😍', '2025-11-13 12:01:34'),
(12, 3, 9, 'Kezdőként nagyon jó kép. Így tovább. Remélem láthatunk még tőled képeket.', '2025-11-13 12:02:44'),
(14, 4, 15, 'Nagyon jó lett. Érdekelnek a beállítások le tudnád írni légyszi?', '2026-01-12 12:07:16'),
(15, 4, 17, 'Jézus, ez egy nagyon komoly kép lett. Szerintem simán megpályázhatnál ezzel egy versenyt.', '2026-01-12 12:10:01'),
(16, 1, 16, 'Az igen! Milyen rekeszértéket és expozíció beállításokat használtál? Üdv, Shomer', '2026-01-20 14:00:17'),
(20, 3, 11, 'Szia. Szeretnék neked adni egy építő kritikát. Nagyon jó kezdésnek, de probáld meg használni az éjszakai beállítások amikor este készítesz képeket. Írj ha segítsek benne.', '2026-01-20 16:51:35'),
(21, 6, 8, 'Gyönyörű kép lett, bakancs listás hely az biztos! ', '2026-01-21 22:06:52'),
(22, 6, 16, 'Az a nap olyan szeeep!', '2026-01-21 22:07:33'),
(23, 6, 15, 'awwww :3', '2026-01-21 22:09:58'),
(24, 6, 17, 'hat ez sem az én stílusom az is biztos', '2026-01-21 22:10:36'),
(25, 6, 10, 'De aranyoos', '2026-01-21 22:11:05'),
(26, 6, 9, 'kicsit élesebb is lehetne, biztos fellehet javítani ', '2026-01-21 22:11:45'),
(27, 7, 17, 'Nagyon extra lett!', '2026-01-21 22:34:49'),
(28, 8, 24, 'Nem vagyok oda a buszutakért :P', '2026-01-21 22:55:20'),
(29, 8, 22, 'Ezt tuti nem te fotóztad!', '2026-01-21 22:55:47'),
(30, 8, 15, 'A macskának nem az ágyban a helye!!!', '2026-01-21 22:57:06'),
(31, 9, 33, 'Én is szívesen utaznék', '2026-01-21 23:10:45'),
(32, 9, 31, 'Szerintem még így is eléggé fakó', '2026-01-21 23:11:12'),
(33, 9, 30, 'Pont tegnap jártam itt!', '2026-01-21 23:11:27'),
(34, 9, 28, 'Eszméletlen cuki!', '2026-01-21 23:11:43'),
(35, 9, 10, 'Félek a teknősöktől :(', '2026-01-21 23:12:08'),
(36, 9, 8, 'Ugyan itt voltam. Nagyon szép!', '2026-01-21 23:13:03'),
(37, 10, 36, 'Szerintem nagyon feltűnően be van állítva minden ez kicsit fantáziaromboló.', '2026-01-21 23:33:14'),
(38, 10, 10, 'Egy kevés utómunka és tökéletes.', '2026-01-21 23:34:19'),
(40, 1, 41, 'Ezzel a fekete fehér fileterrel vagány lett', '2026-01-22 08:18:48'),
(41, 1, 30, 'Fantörpisztikus!', '2026-01-22 08:21:43'),
(42, 4, 39, 'Majd írok papi😎', '2026-02-02 11:04:18'),
(45, 1, 6, 'kopi', '2026-02-10 11:12:45'),
(46, 18, 40, 'Milyen jóképű ❤️❤️❤️', '2026-02-13 20:53:06'),
(47, 18, 9, 'mesés👌', '2026-02-13 20:53:21'),
(48, 18, 32, 'Egy barátom erre fele él :D', '2026-02-13 20:54:10'),
(49, 18, 42, 'elég komor....', '2026-02-13 20:54:30'),
(50, 18, 16, 'Szép a napsütés', '2026-02-13 20:54:44'),
(51, 18, 27, 'Kit érdekel?', '2026-02-13 20:54:57'),
(52, 18, 25, 'Nem túl szimpi :P', '2026-02-13 20:55:17'),
(53, 18, 50, 'Minden mennyiségben jöhet 😂', '2026-02-13 20:55:36'),
(54, 19, 9, 'irigy vagyoook😒', '2026-02-13 21:05:15'),
(55, 19, 6, 'ez tuti ai', '2026-02-13 21:05:43'),
(56, 19, 10, 'aa nagyon cuki', '2026-02-13 21:06:00'),
(57, 19, 19, 'Hasonlít az erdőhöz ahova én szoktam járni, ez hol van pontosan?', '2026-02-13 21:06:45'),
(58, 19, 21, 'Inkább maradok az autóknál.', '2026-02-13 21:07:12'),
(59, 19, 20, 'Mid', '2026-02-13 21:07:20'),
(60, 19, 25, 'Szegény :(', '2026-02-13 21:07:38'),
(61, 19, 23, 'Nice', '2026-02-13 21:07:46'),
(62, 19, 26, 'Ilyen kutyust akarok, milyen fajta?', '2026-02-13 21:08:08'),
(63, 19, 31, 'Ez hol van Vietnamon belül?', '2026-02-13 21:08:50'),
(64, 19, 36, 'Jóreggelt', '2026-02-13 21:09:08'),
(65, 19, 37, 'Jól esne most nekem is!', '2026-02-13 21:09:22'),
(66, 19, 35, 'Látványos az biztos', '2026-02-13 21:09:36'),
(67, 19, 40, 'Ne itt keress pasit magadnak...', '2026-02-13 21:10:02'),
(68, 19, 47, 'Na ez ám a buli!', '2026-02-13 21:10:24'),
(69, 19, 49, 'Egy komoly férfi.', '2026-02-13 21:10:41'),
(70, 19, 51, 'Tetszik ez a sok szín!', '2026-02-13 21:11:15'),
(71, 20, 58, 'Nagyon jó lett!', '2026-02-13 21:22:32'),
(72, 20, 57, 'Nem vagyok benne biztos hogy észrevette :D', '2026-02-13 21:22:54'),
(73, 20, 55, 'Aranyos hogy ilyeneket csinálsz', '2026-02-13 21:23:11'),
(74, 20, 53, 'Nem látni sokat a képen', '2026-02-13 21:23:45'),
(75, 20, 49, 'Úgylátom nem csak nekem jutott eszembe az ilyen kép készítés👍', '2026-02-13 21:25:13'),
(76, 20, 43, 'Jó, és a rajzokról még nem is beszéltünk.', '2026-02-13 21:25:51'),
(77, 20, 39, 'Elmennék egy ilyen fotózásra. írok!', '2026-02-13 21:26:21'),
(78, 21, 6, 'Szerintem akár ai akár nem csodaszép!', '2026-02-13 21:40:14'),
(79, 21, 8, 'Fullos!', '2026-02-13 21:40:33'),
(80, 21, 15, 'Szerintem inkább Sanyis feje van mint Félix', '2026-02-13 21:41:08'),
(81, 21, 20, 'Kicsit fakó a szaruráció állításával szebb lehet a kép, de amúgy ügyes vagy!', '2026-02-13 21:41:55'),
(82, 21, 23, 'Hibátlan', '2026-02-13 21:42:14'),
(83, 21, 22, 'Csodás színek!', '2026-02-13 21:42:25'),
(84, 21, 27, 'Szép autó, és a háttér is gyönyörű!', '2026-02-13 21:43:03'),
(85, 21, 29, 'Ide egyszer el kell jutnom!', '2026-02-13 21:43:22'),
(86, 21, 38, 'Nagyon szép letisztult kép! Gratulálok és jó étvágyat!', '2026-02-13 21:44:06'),
(87, 21, 54, 'Nyugalmat kelt a kép!', '2026-02-13 21:44:32'),
(88, 21, 56, 'Igen ismerős, minden nap használatba veszem😂', '2026-02-13 21:45:08'),
(89, 21, 59, 'Szép kép, hiányzik a nyár!', '2026-02-13 21:45:39');

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
(55, 4, 11, 1, '2026-01-12 11:07:22'),
(58, 3, 16, 1, '2026-01-20 13:34:05'),
(60, 3, 20, 1, '2026-01-20 15:51:39'),
(61, 3, 8, 1, '2026-01-20 15:51:42'),
(62, 3, 15, 1, '2026-01-20 15:52:09'),
(63, 6, 14, 1, '2026-01-21 21:08:44'),
(66, 1, 31, 1, '2026-02-04 09:56:56'),
(67, 1, 11, 1, '2026-02-10 10:11:48'),
(68, 1, 34, -1, '2026-02-10 10:12:32'),
(69, 19, 47, 1, '2026-02-13 20:05:19'),
(70, 19, 26, 1, '2026-02-13 20:05:23'),
(71, 19, 12, 1, '2026-02-13 20:05:23'),
(72, 19, 45, 1, '2026-02-13 20:05:39'),
(73, 19, 4, -1, '2026-02-13 20:05:41'),
(74, 19, 35, -1, '2026-02-13 20:06:02'),
(75, 19, 38, 1, '2026-02-13 20:06:03'),
(76, 19, 25, 1, '2026-02-13 20:06:07'),
(77, 19, 11, 1, '2026-02-13 20:06:08'),
(78, 19, 32, 1, '2026-02-13 20:08:52'),
(79, 19, 37, 1, '2026-02-13 20:09:10'),
(80, 19, 46, -1, '2026-02-13 20:09:41'),
(81, 20, 69, 1, '2026-02-13 20:24:12'),
(82, 21, 55, -1, '2026-02-13 20:40:16'),
(83, 21, 45, -1, '2026-02-13 20:40:17'),
(84, 21, 4, 1, '2026-02-13 20:40:19'),
(85, 21, 59, -1, '2026-02-13 20:41:57'),
(86, 21, 29, -1, '2026-02-13 20:42:27'),
(87, 21, 51, -1, '2026-02-13 20:43:05');

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
(37, 1, 10),
(24, 3, 2),
(33, 4, 9),
(32, 4, 10),
(28, 7, 3),
(25, 7, 4),
(29, 9, 1),
(30, 10, 3);

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
(6, 2, 'Izlandi hegység', 'Záridő: kb. 1/60 – 1/125 mp\r\nRekeszérték: f/8 – f/11\r\nISO érzékenység: 100 – 200\r\nGyújtótávolság: kb. 24–35 mm (nagylátószög)\r\nFehéregyensúly: napfény (kb. 5500 K)', '2025-10-27 19:41:21', '/images/1761586881317.jpg'),
(8, 3, 'Görögország', 'Telefonnal csináltam Görög nyaraláson során. Semmi extra beállítás csak egy jól elkapott pillanat.😎\nTelefonom: Samsung Galaxy S25', '2025-11-02 15:25:26', '/images/1762093526424.jpg'),
(9, 4, 'Naplementés Balaton', 'Tavaly nyáron készítettem ezt a naplementés képet a Balatonról a telefonommal.\r\nTelefon: Samsung Galaxy S22', '2025-11-02 15:40:36', '/images/1762094436028.jpg'),
(10, 4, 'Teknős', 'Egyik nyaraláson csináltam ezt a képet erről az aranyos teknősről. Remélem tetszik nektek. A Samsung Galaxy S22-es telefonnal készítettem ezt a képet.', '2025-11-10 11:09:03', '/images/1762769343370.jfif'),
(11, 4, 'Vérhold', '2025 szeptember 7-én látható volt Magyarországon vérhold és ezt próbáltam lencse végre kapni, kisebb nagyobb sikerrel. Ezt a képet egy Iphone 14-el csináltam.', '2025-11-10 11:13:33', '/images/1762769613542.jfif'),
(15, 3, 'Cicám Félix', 'Nem rég tök jól elkaptam a cicámat Félixet miközben feküdt az ágyamon a délutáni alvását végezve. A telefonommal készítettem. (iPhone 12 Pro Max) A hátteret kicsit elhalványítottam, hogy a macska legyen a fókuszba. Írjatok, ha érdekel a beállítások.', '2025-12-16 12:05:35', '/images/1765883135303.jpg'),
(16, 3, 'Túra a Mátrában', '1 hete voltam túrázni a barátaimmal a Mátrában ahol ezt a képet lőttem. Fényképezőgép: Full-frame DSLR, Objektív: 24–70 mm f/2.8, Gyújtótávolság: 35 mm', '2025-12-16 12:10:43', '/images/1765883443941.jpg'),
(17, 3, 'Tábortűz', 'Amikor voltunk a Mátrába túrázni, akkor tettünk egy tábortüzet. Sikerült elkapni egy jó pillanatot.Fényképezőgép: Full-frame DSLR, Objektív: 24–70 mm f/2.8, Gyújtótávolság: 35–50 mm, Záridő: 1/60 s, Rekesz: f/2.8', '2025-12-16 12:14:20', '/images/1765883660781.jpg'),
(19, 6, 'Erdő ösvény', 'Sötét fás ösvény közelről, párás lombokkal. Canon EOS 200D kit objektívvel (18-55mm, f/5.6, ISO 800, 1/100s), kicsit zajos, csak fényerőt emeltem Lightroomban – kezdő hiba a magas ISO-val.\r\n\r\n', '2026-01-21 21:55:30', '/images/1769028930001.jpg'),
(20, 6, 'Mező és erdő', 'Zöld mező távoli erdős háttérrel, kora reggeli fényben. Sony A6000 50mm-rel (f/8, ISO 200, 1/250s), alap tájkép mód, cropoltam csak, nincs utómunka.\r\n\r\n', '2026-01-21 21:56:58', '/images/1769029017995.jpg'),
(21, 6, 'Város repülőből', 'Felhők felett város sziluett. iPhone 13-mal (f/1.6, ISO 64, 1/2000s), mobil appal, Snapseedben csak élességet állítottam.\r\n\r\n', '2026-01-21 21:58:30', '/images/1769029110027.jpg'),
(22, 6, 'Erdő napfényben', 'Napfényben úszó lombos erdő. Nikon D3500 35mm-mel (f/11, ISO 100, 1/125s), tripod nélkül készült, GIMP-ben kis kontrasztot javítottam.\r\n\r\n', '2026-01-21 22:02:47', '/images/1769029367967.jpg'),
(23, 6, 'Út a hegyre', 'Kanyargós út a hegyre. Canon Rebel T7 18-55mm-mel (f/10, ISO 400, 1/160s), kis remegés, Photoshop Expressben szaturációt növeltem.\r\n\r\n', '2026-01-21 22:04:05', '/images/1769029445685.jpg'),
(24, 7, 'Úton Tasnádra', 'Éppen buszúton voltam Tasnádra jó barátom a buszvezető nagyon megbízható :D', '2026-01-21 22:22:33', '/images/1769030553027.jpg'),
(25, 7, 'Fekete-fehérbe is szép az élet!', 'Ismerősömről készítettem fényképet, némi szerkesztéssel. Kérdésed lenne tedd fel hozzászólásba. ', '2026-01-21 22:24:54', '/images/1769030694619.jpg'),
(26, 7, 'Hófehérke', 'Szomszédom enni való kutyusa, kár lett volna kihagyni.', '2026-01-21 22:26:04', '/images/1769030764100.jpg'),
(27, 7, 'Munkás autó', 'Gondoltam készítek erről a szépségről is már egy komolyabb képet. ', '2026-01-21 22:28:31', '/images/1769030911036.jpg'),
(28, 7, 'Cica és napfény', 'Egyik kedvenc képem, gyönyörű a nap sugara a képen, használtam egy kevés szerkesztést.', '2026-01-21 22:33:22', '/images/1769031202923.jpg'),
(29, 8, 'Prága', 'Helyszín: Prague, Czech Republic \r\nKérdésed lenne tedd fel bátran!', '2026-01-21 22:41:47', '/images/1769031707965.jpg'),
(30, 8, 'Lánchíd', 'Éjszakai kilátás a budapesti lánchídról a Dunán', '2026-01-21 22:43:59', '/images/1769031839671.jpg'),
(31, 8, 'Vietnam', 'Nagyon megtetszett, ahogy a zászlókkal színt vittek az épületbe.', '2026-01-21 22:46:29', '/images/1769031989300.jpg'),
(32, 8, 'Oxford, Anglia', 'Különösen szeretem ezt a képet nagyon sok jó emlékem van ebből a városból.', '2026-01-21 22:49:50', '/images/1769032190797.jpg'),
(33, 8, 'Repülőút Spanyolországba', 'Ez a következő utam, ha szeretnétek még onnan is képeket vagy kérdésed lenne írj hozzászólást.', '2026-01-21 22:54:22', '/images/1769032462344.jpg'),
(34, 9, 'Fagy', 'Közeli kép fűről kicsit fagyos, jeges. Canon EOS 800D 50mm makróval (f/4, ISO 400, 1/200s), természetes fényben készült, Lightroomban csak élességet és hideg tónust javítottam.\r\n\r\n', '2026-01-21 23:06:21', '/images/1769033181916.jpg'),
(35, 9, 'Molylepke virágon', 'Molylepke pihenő virágon, finom részletekkel. Sony A6400 85mm-rel (f/5.6, ISO 200, 1/320s), makró mód, minimális kontraszt növelés GIMP-ben, tripod nélkül.\r\n\r\n', '2026-01-21 23:07:33', '/images/1769033253640.jpg'),
(36, 9, 'Kávé', 'Kávéscsésze táblán. Nikon Z50 35mm-mel (f/3.5, ISO 100, 1/60s), természetes ablakfény, Snapseedben a fényerőt állítottam.\n\n', '2026-01-21 23:08:02', '/images/1769033282879.jpg'),
(37, 9, 'Kis crema kávé', 'Apró crema rétegű kávé közelről, textúrával. Fujifilm X-T30 56mm-rel (f/4, ISO 250, 1/125s), konyhai fény, kis szaturáció boost Photoshop Expressben.\r\n\r\n', '2026-01-21 23:09:33', '/images/1769033373679.jpg'),
(38, 9, 'Reggeli ágyban', 'Narancslé és croassant ágyban két személyre. Canon EOS M50 24mm-rel (f/3.2, ISO 160, 1/80s), természetes reggeli fény, crop és enyhe melegítés Lightroomban.\r\n\r\n', '2026-01-21 23:10:23', '/images/1769033423076.jpg'),
(39, 10, 'Divat fotózás', 'Munkám nagyrészt divat, egyéb stúdió fotókat készítek mint például ez, ha érdekel a munkásságom elérhetőségem: tamasszabo.shoot@gmail.com', '2026-01-21 23:19:41', '/images/1769033981885.jpg'),
(40, 10, 'Elgondolkodó portré', 'Fiatal férfi elgondolkodva pózol minimalista környezetben, lágy megvilágítással. Profi setup: Canon EOS R5, 85mm f/1.4L objektív (f/2.8, ISO 100, 1/200s), két Profoto B10 stúdiólámpa (kulcsfény 4300K, kitöltő 5600K), Capture One utómunka: Dodge & Burn, frekvencia alapú szeparáció, bőrtextúra megőrzése, +12% élesség Radius 1.2px.\r\n\r\n', '2026-01-21 23:21:46', '/images/1769034106981.jpg'),
(41, 10, 'Fekete-fehér portré', 'Fekete-fehér portré: drámai kontraszttal és árnyékjátékkal. Profi setup: Canon EOS R6, 50mm f/1.2L objektív (f/4, ISO 100, 1/160s), Profoto A10 vaku + softbox (kulcsfény 1/4 power, háttérlámpa 1/8), Lightroom + Photoshop utómunka: fekete-fehér konverzió (N&B mix: Red +20, Yellow +15), lokális dodge & burn, textúra finomhangolás, élesség Unsharp Mask 120%, Radius 0.8px.', '2026-01-21 23:24:20', '/images/1769034260356.jpg'),
(42, 10, 'Árnyékos alak', 'Fekete-fehér portré: férfi kicsit távolabbról pózol minimalista háttér előtt, ahol látható az árnyéka. Profi setup: Canon EOS R6, 70mm f/2.8L makró objektív (f/5.6, ISO 100, 1/125s), Profoto B1X vaku + octabox (kulcsfény 1/2 power, háttér rim light 1/16), Capture One utómunka: fekete-fehér konverzió (Orange +25, Blue -10), árnyék kiemelés Curves-szal, lokális kontraszt +15%, textúra élesítés High Pass filter 80%, Radius 1.0px.\r\n\r\n', '2026-01-21 23:28:15', '/images/1769034495873.jpg'),
(43, 10, 'Festmények ', 'Legutóbbi munkám. Kontrasztos háttérrel és finom silhouettettel. Profi setup: Canon EOS R5, 135mm f/2L objektív (f/4, ISO 100, 1/160s), Profoto D2 vaku + grid spot (háttér 1/8 power, rim light 1/32), Capture One utómunka: színkorrekció (split toning: árnyékok kék -5, highlights narancs +8), textúra kiemelés Clarity +20, lokális vignette -15%, élesség Output Sharpening 150%, Radius 1.1px.', '2026-01-21 23:31:31', '/images/1769034691609.jpg'),
(47, 1, 'Parti jelenet', 'nagy buli volt moknál tegnap este', '2026-02-12 11:08:15', '/images/1770890895654.jpg'),
(48, 1, 'Hétfő Moknál meló után', 'Meló után leültünk a haverokkal és megkértem hogy csináljon rólam egy fotót. Beauty filter van rajta de szerintem kivételesen jól áll ennek a képnek. (Mindet nekem hozza a csapos)', '2026-02-12 11:11:09', '/images/1770891069670.jpg'),
(49, 1, 'Serbán bár', 'Delikvensünk szemrebbenés nélkül szívta el az utolsó szál malbimat. A kis pimasz!', '2026-02-12 11:14:56', '/images/1770891296248.jpg'),
(50, 1, 'Jim Beam cocktail', 'Megkavarja Mok nekem a Jim Beamet Absinthal, nem kellett volna meginnom!', '2026-02-12 11:18:37', '/images/1770891517494.jpg'),
(51, 1, 'Dance party', 'Sony Alpha 7 IV-el készítettem, f/2.8–f/4', '2026-02-12 11:21:55', '/images/1770891715828.jpg'),
(52, 18, 'Napfelkelte a szobámból ', 'Ezt kora reggel készítettem, ezert érdemes volt felkeli. Így kezdődik egy jó nap :)', '2026-02-13 20:43:41', '/images/1771011821800.jpg'),
(53, 18, 'Vízcseppek az ablakomon', 'Szerintem nagyon szép és nyugtató látvány. Muszáj volt megörökítenem. Mit gondoltok? ', '2026-02-13 20:46:15', '/images/1771011975632.jpg'),
(54, 18, 'Pára rajz part 1', 'Több ilyen képem van szeretek rajzolgatni a párás ablakra.', '2026-02-13 20:49:08', '/images/1771012148362.jpg'),
(55, 18, 'Pára rajz part 2', 'Itt van az előzőhöz hasonlóan még egy rajzom <3', '2026-02-13 20:50:45', '/images/1771012245034.jpg'),
(56, 19, 'Villamos', 'Budapest, Hungary', '2026-02-13 20:59:49', '/images/1771012789632.jpg'),
(57, 19, 'Békés Taxi', 'Szép élénk színek, imádom. Természetesen az urat nem zavarta a fotó. 😁', '2026-02-13 21:01:43', '/images/1771012903713.jpg'),
(58, 19, 'Budapest Télen', 'Egyik kedvenc téli képem.', '2026-02-13 21:02:53', '/images/1771012973151.jpg'),
(59, 20, 'Hajótúra', 'Vakáción készítettem, volt hajókázás, buli minden!', '2026-02-13 21:16:15', '/images/1771013775576.jpg'),
(60, 20, 'Donáld a kacsa', 'Irtó aranyos. Mint kitalálható Donáldnak neveztem el :3', '2026-02-13 21:18:43', '/images/1771013923544.jpg'),
(61, 20, 'Egy laza pöfékelés.', 'Barátom megkért hogy csináljak róla képeket, hát ilyen lett. Valami tanács?', '2026-02-13 21:20:51', '/images/1771014051450.jpg'),
(62, 21, 'Fehér foltos pillangó', 'Ezt a képet egy kora délelőtti sétán fotóztam, amikor a fény már szép lágy volt, de még nem túl kemény. A rovar teljesen nyugodtan pihent a kis fehér virágon, így volt időm pontosan beállítani a fókuszt.\r\nCanon EOS 90D + 100mm f/2.8 makró objektív\r\nRekesz: f/8 (hogy a szárny mintázata végig éles maradjon)\r\nZáridő: 1/250\r\nISO: 200\r\nKézből fotóztam, könyököt a térdemhez támasztva a stabilitásért', '2026-02-13 21:31:31', '/images/1771014691843.jpg'),
(63, 21, 'Szemközt a türelemmel', 'Ez a makró egy egészen közeli, szinte intim pillanat volt, a rovar szó szerint rám nézett. Természetes fényben fotóztam, 100mm makró objektívvel, f/5.6 rekeszen, hogy a szemek élesek maradjanak, de a háttér szépen mosódjon. Manuális fókuszt használtam, finoman előre-hátra mozdulva kerestem az élességet. Ilyenkor minden milliméter számít.', '2026-02-13 21:34:11', '/images/1771014851976.jpg'),
(64, 21, 'Reggeli pihenő', 'Egy nyugodt reggelen kaptam el ezt a pillanatot, amikor egy rovar megpihent a sárga virág közepén. Természetes fényben fotóztam, 100mm makróval, f/8 rekeszen, hogy a rovar és a szárnyak részletei szépen kirajzolódjanak. Kézből készült, lassú, kontrollált mozdulatokkal állítottam be a fókuszt.', '2026-02-13 21:35:45', '/images/1771014945267.jpg'),
(65, 21, 'Ketten a réten', 'Ez a két apró százszorszép szinte egymás felé hajolva állt a fűben. Természetes, szórt fényben fotóztam, 100mm makró objektívvel, f/4 rekeszen, hogy a virágok élesek maradjanak, a háttér pedig lágyan mosódjon. Alacsony nézőpontból, a földhöz közel készítettem, kézből, nyugodt légzéssel stabilizálva a mozdulatot.', '2026-02-13 21:37:08', '/images/1771015028570.jpg'),
(66, 21, 'A csend belseje', 'Ezúttal egészen közel mentem a virág szívéhez, hogy a porzók részletei és a lágy rózsaszín szirmok textúrája domináljon. Természetes, szórt fényben fotóztam, 100mm makróval, f/5.6 rekeszen a finom mélységélességért. Manuális fókuszt használtam, milliméteres pontossággal a középpontra állítva az élességet.', '2026-02-13 21:38:32', '/images/1771015112718.jpg');

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
(19, 11),
(19, 15),
(19, 45),
(19, 46),
(19, 47),
(20, 15),
(20, 48),
(21, 49),
(21, 50),
(22, 15),
(22, 51),
(23, 11),
(23, 17),
(23, 52),
(23, 53),
(24, 46),
(24, 54),
(24, 55),
(25, 56),
(25, 57),
(25, 58),
(25, 59),
(26, 57),
(26, 60),
(26, 61),
(27, 11),
(27, 62),
(27, 63),
(28, 11),
(28, 37),
(28, 41),
(29, 50),
(29, 64),
(30, 65),
(30, 66),
(30, 67),
(30, 68),
(31, 69),
(31, 70),
(31, 71),
(31, 72),
(31, 73),
(32, 50),
(32, 74),
(32, 75),
(33, 46),
(33, 49),
(33, 76),
(34, 11),
(34, 77),
(34, 78),
(34, 79),
(34, 80),
(35, 11),
(35, 81),
(35, 82),
(36, 83),
(36, 84),
(37, 83),
(37, 85),
(38, 84),
(38, 86),
(38, 87),
(39, 88),
(39, 89),
(40, 59),
(40, 89),
(41, 56),
(41, 57),
(41, 59),
(41, 89),
(42, 59),
(42, 89),
(42, 90),
(42, 91),
(43, 59),
(43, 89),
(43, 92),
(47, 55),
(47, 96),
(47, 97),
(47, 98),
(48, 55),
(48, 97),
(48, 99),
(48, 100),
(48, 101),
(49, 104),
(49, 105),
(49, 106),
(49, 107),
(50, 97),
(50, 108),
(50, 109),
(51, 110),
(51, 111),
(52, 41),
(52, 42),
(52, 84),
(52, 112),
(53, 113),
(53, 114),
(53, 115),
(53, 116),
(54, 113),
(54, 117),
(54, 118),
(54, 119),
(54, 120),
(55, 113),
(55, 117),
(55, 119),
(56, 67),
(56, 121),
(56, 122),
(57, 67),
(57, 123),
(58, 67),
(58, 121),
(58, 124),
(59, 20),
(59, 32),
(59, 114),
(59, 125),
(59, 126),
(59, 127),
(59, 128),
(60, 11),
(60, 19),
(60, 129),
(60, 130),
(60, 131),
(61, 59),
(61, 132),
(62, 82),
(62, 133),
(62, 134),
(63, 135),
(63, 136),
(63, 137),
(63, 138),
(63, 139),
(63, 140),
(63, 141),
(63, 142),
(63, 143),
(63, 144),
(63, 145),
(63, 146),
(64, 82),
(64, 135),
(64, 136),
(64, 137),
(64, 138),
(64, 147),
(65, 82),
(65, 135),
(65, 136),
(65, 138),
(65, 148),
(65, 149),
(65, 150),
(66, 82),
(66, 135),
(66, 136),
(66, 146),
(66, 151),
(66, 152);

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
(175, 3, 8, 1, '2025-12-02 12:54:44'),
(176, 4, 9, 1, '2025-12-02 12:54:44'),
(177, 4, 6, 1, '2025-12-02 12:54:44'),
(179, 4, 8, 1, '2025-12-02 12:54:44'),
(180, 4, 11, 1, '2025-12-02 12:54:44'),
(181, 4, 10, 1, '2025-12-02 12:54:44'),
(182, 1, 6, -1, '2025-12-02 12:54:44'),
(183, 1, 10, 1, '2025-12-02 12:54:44'),
(186, 1, 11, 1, '2025-12-02 12:54:44'),
(190, 3, 9, 1, '2025-12-02 12:54:44'),
(193, 3, 10, 1, '2025-12-02 12:54:44'),
(196, 3, 17, 1, '2026-01-12 11:05:19'),
(198, 3, 15, 1, '2026-01-12 11:05:22'),
(199, 3, 11, 1, '2026-01-12 11:05:44'),
(201, 4, 17, 1, '2026-01-12 11:06:38'),
(204, 4, 16, -1, '2026-01-12 11:09:14'),
(205, 1, 15, 1, '2026-01-20 12:09:41'),
(207, 1, 8, 1, '2026-01-20 12:13:28'),
(208, 1, 9, 1, '2026-01-20 12:13:29'),
(209, 1, 16, 1, '2026-01-20 12:21:44'),
(210, 1, 17, 1, '2026-01-20 12:57:57'),
(214, 3, 6, -1, '2026-01-20 15:42:20'),
(216, 3, 16, 1, '2026-01-20 15:43:17'),
(218, 6, 17, -1, '2026-01-21 21:04:32'),
(219, 6, 16, 1, '2026-01-21 21:04:35'),
(220, 6, 15, 1, '2026-01-21 21:04:38'),
(221, 6, 11, -1, '2026-01-21 21:04:41'),
(222, 6, 10, 1, '2026-01-21 21:04:45'),
(223, 6, 9, 1, '2026-01-21 21:04:48'),
(224, 6, 8, 1, '2026-01-21 21:04:51'),
(227, 7, 21, 1, '2026-01-21 21:34:30'),
(228, 7, 17, 1, '2026-01-21 21:34:38'),
(229, 7, 10, 1, '2026-01-21 21:36:33'),
(230, 7, 11, 1, '2026-01-21 21:36:34'),
(231, 8, 28, 1, '2026-01-21 21:54:36'),
(232, 8, 27, -1, '2026-01-21 21:54:37'),
(233, 8, 26, 1, '2026-01-21 21:54:43'),
(234, 8, 25, 1, '2026-01-21 21:54:45'),
(235, 8, 24, -1, '2026-01-21 21:54:46'),
(236, 8, 22, -1, '2026-01-21 21:55:49'),
(237, 8, 23, 1, '2026-01-21 21:55:50'),
(238, 8, 10, 1, '2026-01-21 21:56:15'),
(239, 8, 9, -1, '2026-01-21 21:56:17'),
(240, 8, 17, 1, '2026-01-21 21:56:38'),
(241, 8, 15, -1, '2026-01-21 21:56:46'),
(242, 8, 8, 1, '2026-01-21 21:57:15'),
(243, 8, 16, 1, '2026-01-21 21:57:17'),
(244, 9, 33, 1, '2026-01-21 22:10:32'),
(245, 9, 31, -1, '2026-01-21 22:10:51'),
(246, 9, 30, 1, '2026-01-21 22:11:15'),
(247, 9, 28, 1, '2026-01-21 22:11:29'),
(248, 9, 10, -1, '2026-01-21 22:11:52'),
(249, 9, 9, 1, '2026-01-21 22:12:14'),
(250, 9, 11, -1, '2026-01-21 22:12:16'),
(251, 9, 15, 1, '2026-01-21 22:12:35'),
(252, 9, 17, 1, '2026-01-21 22:12:40'),
(253, 9, 8, 1, '2026-01-21 22:13:04'),
(254, 10, 38, 1, '2026-01-21 22:31:47'),
(255, 10, 37, -1, '2026-01-21 22:31:48'),
(256, 10, 36, -1, '2026-01-21 22:33:15'),
(258, 10, 34, 1, '2026-01-21 22:33:21'),
(259, 10, 32, 1, '2026-01-21 22:33:24'),
(260, 10, 10, 1, '2026-01-21 22:33:39'),
(261, 10, 6, 1, '2026-01-21 22:34:23'),
(262, 10, 16, 1, '2026-01-21 22:34:37'),
(265, 10, 35, 1, '2026-01-21 22:35:12'),
(266, 1, 43, 1, '2026-01-22 07:17:29'),
(267, 1, 42, 1, '2026-01-22 07:17:30'),
(268, 1, 41, -1, '2026-01-22 07:17:32'),
(269, 1, 39, 1, '2026-01-22 07:17:33'),
(270, 1, 38, -1, '2026-01-22 07:17:35'),
(271, 1, 35, 1, '2026-01-22 07:17:37'),
(272, 1, 36, 1, '2026-01-22 07:17:38'),
(273, 1, 37, 1, '2026-01-22 07:17:39'),
(274, 1, 33, -1, '2026-01-22 07:17:41'),
(275, 1, 34, 1, '2026-01-22 07:17:42'),
(276, 1, 32, 1, '2026-01-22 07:17:44'),
(277, 1, 31, 1, '2026-01-22 07:21:19'),
(278, 1, 30, 1, '2026-01-22 07:21:21'),
(279, 4, 36, 1, '2026-02-02 10:03:35'),
(280, 4, 37, 1, '2026-02-02 10:03:36'),
(281, 4, 39, 1, '2026-02-02 10:03:39'),
(282, 4, 40, 1, '2026-02-02 10:03:42'),
(283, 4, 32, 1, '2026-02-02 10:04:55'),
(284, 4, 19, 1, '2026-02-02 10:04:57'),
(285, 4, 41, 1, '2026-02-02 10:05:05'),
(288, 1, 28, 1, '2026-02-10 10:12:35'),
(289, 18, 39, -1, '2026-02-13 19:50:55'),
(290, 18, 35, -1, '2026-02-13 19:50:56'),
(291, 18, 34, 1, '2026-02-13 19:50:57'),
(292, 18, 9, 1, '2026-02-13 19:50:58'),
(293, 18, 40, 1, '2026-02-13 19:50:59'),
(294, 18, 6, -1, '2026-02-13 19:51:00'),
(296, 18, 30, -1, '2026-02-13 19:51:02'),
(297, 18, 41, -1, '2026-02-13 19:51:03'),
(298, 18, 51, 1, '2026-02-13 19:51:05'),
(299, 18, 49, -1, '2026-02-13 19:51:05'),
(300, 18, 11, -1, '2026-02-13 19:51:06'),
(302, 18, 50, 1, '2026-02-13 19:51:21'),
(303, 18, 48, 1, '2026-02-13 19:51:23'),
(304, 18, 47, -1, '2026-02-13 19:51:24'),
(305, 18, 43, -1, '2026-02-13 19:51:26'),
(306, 18, 42, -1, '2026-02-13 19:51:27'),
(307, 18, 38, 1, '2026-02-13 19:51:32'),
(308, 18, 37, 1, '2026-02-13 19:51:35'),
(309, 18, 36, 1, '2026-02-13 19:51:36'),
(310, 18, 33, -1, '2026-02-13 19:51:39'),
(311, 18, 32, -1, '2026-02-13 19:51:40'),
(312, 18, 31, 1, '2026-02-13 19:51:42'),
(313, 18, 29, 1, '2026-02-13 19:51:44'),
(314, 18, 28, 1, '2026-02-13 19:51:45'),
(315, 18, 27, -1, '2026-02-13 19:51:46'),
(316, 18, 25, -1, '2026-02-13 19:51:50'),
(317, 18, 24, 1, '2026-02-13 19:51:53'),
(318, 18, 23, 1, '2026-02-13 19:51:55'),
(319, 18, 22, 1, '2026-02-13 19:51:56'),
(320, 18, 21, 1, '2026-02-13 19:51:57'),
(321, 18, 20, 1, '2026-02-13 19:51:58'),
(322, 18, 19, 1, '2026-02-13 19:52:00'),
(323, 18, 17, 1, '2026-02-13 19:52:01'),
(324, 18, 16, 1, '2026-02-13 19:52:02'),
(325, 18, 15, 1, '2026-02-13 19:52:03'),
(326, 18, 10, 1, '2026-02-13 19:52:05'),
(327, 18, 8, -1, '2026-02-13 19:52:13'),
(328, 19, 55, 1, '2026-02-13 20:03:20'),
(329, 19, 54, 1, '2026-02-13 20:03:21'),
(330, 19, 53, -1, '2026-02-13 20:03:22'),
(331, 19, 52, -1, '2026-02-13 20:03:25'),
(332, 19, 51, 1, '2026-02-13 20:03:26'),
(333, 19, 50, -1, '2026-02-13 20:03:27'),
(334, 19, 49, 1, '2026-02-13 20:03:29'),
(335, 19, 48, -1, '2026-02-13 20:03:30'),
(336, 19, 47, 1, '2026-02-13 20:03:31'),
(337, 19, 43, -1, '2026-02-13 20:03:32'),
(338, 19, 42, 1, '2026-02-13 20:03:33'),
(339, 19, 41, 1, '2026-02-13 20:03:34'),
(340, 19, 40, -1, '2026-02-13 20:03:37'),
(341, 19, 39, 1, '2026-02-13 20:03:39'),
(342, 19, 38, -1, '2026-02-13 20:03:42'),
(343, 19, 37, -1, '2026-02-13 20:03:43'),
(344, 19, 36, 1, '2026-02-13 20:03:44'),
(345, 19, 35, 1, '2026-02-13 20:03:45'),
(346, 19, 34, 1, '2026-02-13 20:03:47'),
(347, 19, 33, 1, '2026-02-13 20:03:48'),
(348, 19, 32, -1, '2026-02-13 20:03:50'),
(349, 19, 31, -1, '2026-02-13 20:03:54'),
(350, 19, 30, 1, '2026-02-13 20:03:54'),
(351, 19, 29, 1, '2026-02-13 20:03:56'),
(352, 19, 28, -1, '2026-02-13 20:03:58'),
(353, 19, 27, 1, '2026-02-13 20:03:59'),
(354, 19, 26, -1, '2026-02-13 20:04:01'),
(355, 19, 25, 1, '2026-02-13 20:04:03'),
(356, 19, 24, 1, '2026-02-13 20:04:04'),
(357, 19, 23, -1, '2026-02-13 20:04:04'),
(358, 19, 22, -1, '2026-02-13 20:04:09'),
(359, 19, 21, -1, '2026-02-13 20:04:09'),
(360, 19, 20, -1, '2026-02-13 20:04:10'),
(361, 19, 19, -1, '2026-02-13 20:04:12'),
(362, 19, 17, -1, '2026-02-13 20:04:13'),
(363, 19, 16, -1, '2026-02-13 20:04:14'),
(364, 19, 11, 1, '2026-02-13 20:04:17'),
(365, 19, 8, -1, '2026-02-13 20:04:21'),
(366, 19, 9, -1, '2026-02-13 20:04:22'),
(367, 19, 6, -1, '2026-02-13 20:04:23'),
(368, 20, 58, 1, '2026-02-13 20:21:10'),
(369, 20, 57, -1, '2026-02-13 20:21:11'),
(370, 20, 56, 1, '2026-02-13 20:21:11'),
(371, 20, 55, -1, '2026-02-13 20:21:16'),
(372, 20, 54, 1, '2026-02-13 20:21:17'),
(373, 20, 53, 1, '2026-02-13 20:21:18'),
(374, 20, 52, 1, '2026-02-13 20:21:19'),
(375, 20, 51, -1, '2026-02-13 20:21:20'),
(376, 20, 50, 1, '2026-02-13 20:21:22'),
(377, 20, 49, 1, '2026-02-13 20:21:24'),
(378, 20, 48, 1, '2026-02-13 20:21:25'),
(379, 20, 47, 1, '2026-02-13 20:21:28'),
(380, 20, 43, 1, '2026-02-13 20:21:30'),
(381, 20, 42, 1, '2026-02-13 20:21:31'),
(382, 20, 41, 1, '2026-02-13 20:21:32'),
(383, 20, 40, 1, '2026-02-13 20:21:34'),
(384, 20, 39, 1, '2026-02-13 20:21:34'),
(385, 20, 38, 1, '2026-02-13 20:21:36'),
(386, 20, 37, 1, '2026-02-13 20:21:37'),
(387, 20, 36, 1, '2026-02-13 20:21:39'),
(388, 20, 35, 1, '2026-02-13 20:21:40'),
(389, 20, 34, -1, '2026-02-13 20:21:42'),
(390, 20, 33, 1, '2026-02-13 20:21:43'),
(391, 20, 32, 1, '2026-02-13 20:21:44'),
(392, 20, 31, 1, '2026-02-13 20:21:45'),
(393, 20, 30, 1, '2026-02-13 20:21:46'),
(394, 20, 29, 1, '2026-02-13 20:21:46'),
(395, 20, 28, 1, '2026-02-13 20:21:48'),
(396, 20, 27, 1, '2026-02-13 20:21:50'),
(397, 20, 26, 1, '2026-02-13 20:21:51'),
(398, 20, 25, 1, '2026-02-13 20:21:52'),
(399, 20, 24, 1, '2026-02-13 20:21:54'),
(400, 20, 23, 1, '2026-02-13 20:21:55'),
(401, 20, 22, 1, '2026-02-13 20:21:57'),
(402, 20, 21, 1, '2026-02-13 20:21:58'),
(403, 20, 20, 1, '2026-02-13 20:21:59'),
(404, 20, 19, 1, '2026-02-13 20:22:00'),
(405, 20, 17, 1, '2026-02-13 20:22:01'),
(407, 20, 16, 1, '2026-02-13 20:22:03'),
(408, 20, 15, 1, '2026-02-13 20:22:05'),
(409, 20, 11, 1, '2026-02-13 20:22:05'),
(410, 20, 10, 1, '2026-02-13 20:22:06'),
(411, 20, 9, 1, '2026-02-13 20:22:08'),
(412, 20, 8, 1, '2026-02-13 20:22:08'),
(413, 20, 6, 1, '2026-02-13 20:22:09'),
(414, 21, 61, 1, '2026-02-13 20:38:51'),
(415, 21, 60, 1, '2026-02-13 20:38:52'),
(416, 21, 59, 1, '2026-02-13 20:38:54'),
(417, 21, 58, -1, '2026-02-13 20:38:54'),
(418, 21, 57, 1, '2026-02-13 20:38:56'),
(419, 21, 56, -1, '2026-02-13 20:38:57'),
(420, 21, 55, 1, '2026-02-13 20:39:01'),
(421, 21, 54, 1, '2026-02-13 20:39:02'),
(422, 21, 53, 1, '2026-02-13 20:39:03'),
(423, 21, 52, 1, '2026-02-13 20:39:04'),
(424, 21, 51, 1, '2026-02-13 20:39:06'),
(425, 21, 50, 1, '2026-02-13 20:39:06'),
(426, 21, 49, 1, '2026-02-13 20:39:07'),
(427, 21, 48, -1, '2026-02-13 20:39:09'),
(428, 21, 47, -1, '2026-02-13 20:39:10'),
(429, 21, 43, -1, '2026-02-13 20:39:10'),
(430, 21, 42, 1, '2026-02-13 20:39:12'),
(431, 21, 41, 1, '2026-02-13 20:39:12'),
(432, 21, 40, 1, '2026-02-13 20:39:13'),
(433, 21, 39, -1, '2026-02-13 20:39:15'),
(434, 21, 38, 1, '2026-02-13 20:39:15'),
(435, 21, 37, 1, '2026-02-13 20:39:17'),
(436, 21, 36, 1, '2026-02-13 20:39:18'),
(437, 21, 35, 1, '2026-02-13 20:39:19'),
(438, 21, 34, 1, '2026-02-13 20:39:20'),
(439, 21, 33, -1, '2026-02-13 20:39:23'),
(440, 21, 32, 1, '2026-02-13 20:39:23'),
(441, 21, 31, 1, '2026-02-13 20:39:24'),
(442, 21, 30, -1, '2026-02-13 20:39:26'),
(443, 21, 29, 1, '2026-02-13 20:39:26'),
(444, 21, 28, 1, '2026-02-13 20:39:27'),
(445, 21, 27, 1, '2026-02-13 20:39:30'),
(446, 21, 26, 1, '2026-02-13 20:39:31'),
(447, 21, 25, 1, '2026-02-13 20:39:32'),
(448, 21, 24, 1, '2026-02-13 20:39:33'),
(449, 21, 23, 1, '2026-02-13 20:39:34'),
(450, 21, 22, 1, '2026-02-13 20:39:35'),
(451, 21, 21, 1, '2026-02-13 20:39:37'),
(452, 21, 20, 1, '2026-02-13 20:39:38'),
(453, 21, 19, 1, '2026-02-13 20:39:39'),
(454, 21, 17, 1, '2026-02-13 20:39:40'),
(455, 21, 16, -1, '2026-02-13 20:39:41'),
(456, 21, 15, 1, '2026-02-13 20:39:42'),
(457, 21, 11, 1, '2026-02-13 20:39:46'),
(458, 21, 10, 1, '2026-02-13 20:39:47'),
(459, 21, 9, 1, '2026-02-13 20:39:47'),
(460, 21, 8, 1, '2026-02-13 20:39:50'),
(461, 21, 6, 1, '2026-02-13 20:39:53');

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
(87, 'ágy'),
(61, 'állat'),
(74, 'Anglia'),
(130, 'aranyos'),
(62, 'autó'),
(105, 'Bago'),
(100, 'Beauty'),
(101, 'Beer'),
(142, 'bokeh'),
(67, 'budapest'),
(126, 'Buli'),
(54, 'Busz'),
(38, 'Cat'),
(37, 'Cica'),
(139, 'closeup'),
(108, 'Cocktail'),
(71, 'color'),
(115, 'Csepp'),
(85, 'csésze'),
(19, 'Cuki'),
(149, 'daisy'),
(110, 'Dance'),
(80, 'Dér'),
(88, 'divat'),
(52, 'Domb'),
(131, 'donáld a kacsa'),
(68, 'Duna'),
(66, 'Éjszaka'),
(15, 'Erdő'),
(99, 'Este'),
(86, 'étel'),
(40, 'Fa'),
(79, 'Fagy'),
(57, 'fehér'),
(56, 'fekete'),
(91, 'fekete-fehér'),
(92, 'Festmény'),
(70, 'flag'),
(151, 'flowerdetails'),
(146, 'fokusz'),
(77, 'Fű'),
(128, 'fürdés'),
(119, 'Fyp'),
(31, 'Görögország'),
(32, 'Hajó'),
(17, 'Hegység'),
(21, 'Hold'),
(122, 'Hungary'),
(140, 'insectphotography'),
(78, 'Jég'),
(109, 'Jim Beam'),
(129, 'kacsa'),
(83, 'kávé'),
(145, 'kézből'),
(60, 'kutya'),
(65, 'Lánchíd'),
(51, 'Lomb'),
(104, 'Lopik'),
(134, 'macro'),
(143, 'macrolover'),
(136, 'macrophoto'),
(135, 'makró'),
(106, 'Malbi'),
(39, 'Mátra'),
(48, 'mező'),
(152, 'minimal'),
(47, 'moha'),
(97, 'Mok'),
(81, 'Molylepke'),
(41, 'Nap'),
(42, 'Napfelkelte'),
(98, 'Newmarkt'),
(116, 'Nyugodt'),
(58, 'old'),
(63, 'opel'),
(45, 'Ösvény'),
(75, 'Oxford'),
(113, 'Pára'),
(96, 'Parti'),
(111, 'Party'),
(133, 'pillango'),
(59, 'portré'),
(132, 'póz'),
(64, 'Prága'),
(90, 'profi'),
(117, 'rajz'),
(84, 'reggel'),
(49, 'repülő'),
(137, 'rovar'),
(107, 'Serbán'),
(76, 'Spanyolország'),
(127, 'Strand'),
(89, 'stúdió'),
(148, 'százszorszép'),
(118, 'Szép'),
(72, 'szín'),
(44, 'Tábortűz'),
(112, 'Táj'),
(55, 'Tasnád'),
(150, 'tavasz'),
(123, 'taxi'),
(18, 'Teknős'),
(124, 'tél'),
(20, 'Tenger'),
(11, 'Természet'),
(141, 'természetesfény'),
(138, 'természetfotó'),
(16, 'Tó'),
(144, 'türelem'),
(43, 'Tűz'),
(46, 'út'),
(125, 'Vakáció'),
(50, 'város'),
(69, 'Vietnam'),
(121, 'Villamos'),
(82, 'virág'),
(120, 'viral'),
(114, 'Víz'),
(53, 'Völgy'),
(147, 'yellowflower'),
(73, 'zászló');

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
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `bio`, `profile_picture`, `is_admin`) VALUES
(1, 'Frittyes', 'perakattis@gmail.com', '$2b$10$vBS.xhlLasGMI3DPjjr6r.8MlEsnH5wFVAr/V64MXllFI4gaMS76O', 'Sziasztok! Kezdő fotós vagyok, és szeretnék ügyesebb lenni a szakmában. Köszönök minden építő kritikát! aa', '/profile-pictures/1761583927591.jpg', 0),
(2, 'Papp Sándor', 'pappsanyi@gmail.com', '$2b$10$9/iX2OKNISqPmBo13Svi/OtdCjPTxgSYNoZ7MUcLP0NwLZ7YlTrr2', 'Sziasztok! Sanyi vagyok és 4 éve foglalkozom fotózással. Szívesen megosztom veletek a munkáimat és bármikor fordulhattok hozzám segítségért. Versenyre való felkészítést is vállalok!', '/profile-pictures/1761584967721.jpg', 0),
(3, 'Dávid', 'kabzso820@hengersor.hu', '$2b$10$77rO1/wis8plfrsb8ooWhuFVRhr3D8oH34ZRF13qH/plHpzArhft.', 'Sziasztok Dávid vagyok. Mizu? Tapasztalt, de egyáltalán nem profi fotós vagyok. Csak egy átlagos srác aki a fotózás szerelmese.', '/profile-pictures/1768215912073.jfif', 0),
(4, 'Kabai Zsombor', 'kabai.zsombi@gmail.com', '$2b$10$3NiUroXsfKSnwSa6SxQ6Pu9fJhX/9dNH9r/DYTjDq9e4VNW4hjYVq', 'Sziasztok az én nevem Zsombor. Kezdő fotósnak tartom magam. A telefonommal szoktam fotózni és abból próbálom kihozni a legtöbbett.', '/profile-pictures/1762093987308.jpg', 0),
(6, 'Anna Kovács', 'annakovacsfoto@gmail.com', '$2b$10$lN7ktCWhr48SQjTqYVJmEOGIB4xYh9Qyh/0Mmq3Zed.PcUNXhJKGm', 'Kezdő tájképfotós Budapesten, szeretek kora reggeli fényekkel kísérletezni. Keresek tippeket a kompozícióra.', '/profile-pictures/1769028224562.jpg', 0),
(7, 'PixelHunter87', 'pixelhunter87@gmail.com', '$2b$10$9JF3W/njYh2DLa0VtnpG0uN9tvIDllnMCnBW6He6drchgd2VbWALG', 'Hobbi portréfotós, 5 éve kattintgatok. Érdekel a természetes fény használata, szívesen tanulok profiktól.', '/profile-pictures/1769030450665.jpg', 0),
(8, 'László Nagy', 'laszlonagyphoto@gmail.com', '$2b$10$hOIshDmevNp1sPX0Si8d1Os2b0gDgCln//Vin48DI9PE60sqZA7V6', 'Haladó utazó fotós, főleg utcai pillanatokat örökítek meg. Megosztom tapasztalataimat kezdőkkel.', '/profile-pictures/1769031583605.jpg', 0),
(9, 'ShutterQueen', 'shutterqueen.hu@gmail.com', '$2b$10$HV0kebpDM5TgyYg6WwVKUeCOwLTbxCjFjGkbpVJE5qdPYUxWnIEPy', 'Nőként fotózom a mindennapi életet, makróval és portréval. Csatlakoztam a közösséghez inspirációért.', '/profile-pictures/1769032960645.jpg', 0),
(10, 'Tamás Szabó', 'tamasszabo.shoot@gmail.com', '$2b$10$E03GBrEMSOSLmQIZEsoUsO9aLxZMbTbLFj3ZNTic49DCDysp7e6WC', 'Profi stúdiófotós 10+ éves gyakorlattal, szívesen adok tanácsot világításról és utómunkáról.', '/profile-pictures/1769033678059.jpg', 0),
(11, 'Admin', 'info.sfl.technologies@gmail.com', '$2b$10$rHaKVG.APJTmDU3NhwZsg.uF7uhou441fnwUD4oLPN159bofieTwC', NULL, NULL, 1),
(18, 'DawnSeeker', 'dawnseeker.photo@gmail.com', '$2b$10$nWAWodWWB/kCLtleegKvp.uZyZJFIgJMSJqEOehYPcw4A34D9Tui.', 'Kezdő tájképfotós, imádom a párás napkeltéket. Kompozíciós kritikát szívesen fogadok.', '/profile-pictures/1771011650818.png', 0),
(19, 'BpStreetFrame', 'bpstreetframe@gmail.com', '$2b$10$Nk4pLnBEqOcNSMs2qKFTnuycnBxqHaPFyxaYM6pV9x6ihPE/YXghq', 'Budapesti street fotós, gyors pillanatokat vadászok. Tippeket keresek zónás fókuszhoz és fényhez.', '/profile-pictures/1771012704858.png', 0),
(20, 'LensLili', 'lenslili.photo@gmail.com', '$2b$10$pjI3RxfKk6wfQUazSuiDQekQToKTW.9tGevbTxf8onB3aBHDwanLy', 'Portréval barátkozom, természetes fényben fotózok. Szeretnék jobb póz- és helyszínötleteket', '/profile-pictures/1771013964289.png', 0),
(21, 'MacroMiki', 'macromiki@gmail.com', '$2b$10$IwwR83INMDySxk/pka4tz.LDugKBXNxvllGpMZOk5j2..WjPNhkna', 'Makró-hobbi, rovarok és virágok. Keresem a türelmes fókusz-trükköket és a stabil kéztartást. ', '/profile-pictures/1771014512195.png', 0);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT a táblához `comment_votes`
--
ALTER TABLE `comment_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT a táblához `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT a táblához `image_votes`
--
ALTER TABLE `image_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=462;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
