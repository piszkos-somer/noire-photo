-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2026. Feb 04. 10:29
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
(39, 1, 42, 'Nagyon király hangulata van a képnek, kifejezetten találó.', '2026-01-22 08:18:10'),
(40, 1, 41, 'Ezzel a fekete fehér fileterrel vagány lett', '2026-01-22 08:18:48'),
(41, 1, 30, 'Fantörpisztikus!', '2026-01-22 08:21:43'),
(42, 4, 39, 'Majd írok papi😎', '2026-02-02 11:04:18');

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
(63, 6, 14, 1, '2026-01-21 21:08:44');

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
(31, 1, 10),
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
(43, 10, 'Festmények ', 'Legutóbbi munkám. Kontrasztos háttérrel és finom silhouettettel. Profi setup: Canon EOS R5, 135mm f/2L objektív (f/4, ISO 100, 1/160s), Profoto D2 vaku + grid spot (háttér 1/8 power, rim light 1/32), Capture One utómunka: színkorrekció (split toning: árnyékok kék -5, highlights narancs +8), textúra kiemelés Clarity +20, lokális vignette -15%, élesség Output Sharpening 150%, Radius 1.1px.', '2026-01-21 23:31:31', '/images/1769034691609.jpg');

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
(43, 92);

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
(182, 1, 6, 1, '2025-12-02 12:54:44'),
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
(285, 4, 41, 1, '2026-02-02 10:05:05');

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
(62, 'autó'),
(67, 'budapest'),
(54, 'Busz'),
(38, 'Cat'),
(37, 'Cica'),
(71, 'color'),
(85, 'csésze'),
(19, 'Cuki'),
(80, 'Dér'),
(88, 'divat'),
(52, 'Domb'),
(68, 'Duna'),
(66, 'Éjszaka'),
(15, 'Erdő'),
(86, 'étel'),
(40, 'Fa'),
(79, 'Fagy'),
(57, 'fehér'),
(56, 'fekete'),
(91, 'fekete-fehér'),
(92, 'Festmény'),
(70, 'flag'),
(77, 'Fű'),
(31, 'Görögország'),
(32, 'Hajó'),
(17, 'Hegység'),
(21, 'Hold'),
(78, 'Jég'),
(83, 'kávé'),
(60, 'kutya'),
(65, 'Lánchíd'),
(51, 'Lomb'),
(39, 'Mátra'),
(48, 'mező'),
(47, 'moha'),
(81, 'Molylepke'),
(41, 'Nap'),
(42, 'Napfelkelte'),
(58, 'old'),
(63, 'opel'),
(45, 'Ösvény'),
(75, 'Oxford'),
(59, 'portré'),
(64, 'Prága'),
(90, 'profi'),
(84, 'reggel'),
(49, 'repülő'),
(76, 'Spanyolország'),
(89, 'stúdió'),
(72, 'szín'),
(44, 'Tábortűz'),
(55, 'Tasnád'),
(18, 'Teknős'),
(20, 'Tenger'),
(11, 'Természet'),
(16, 'Tó'),
(43, 'Tűz'),
(46, 'út'),
(50, 'város'),
(69, 'Vietnam'),
(82, 'virág'),
(53, 'Völgy'),
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
(1, 'somer fatera', 'perakattis@gmail.com', '$2b$10$vBS.xhlLasGMI3DPjjr6r.8MlEsnH5wFVAr/V64MXllFI4gaMS76O', 'Sziasztok! Kezdő fotós vagyok, és szeretnék ügyesebb lenni a szakmában. Köszönök minden építő kritikát! aa', '/profile-pictures/1761583927591.jpg', 0),
(2, 'Papp Sándor', 'pappsanyi@gmail.com', '$2b$10$9/iX2OKNISqPmBo13Svi/OtdCjPTxgSYNoZ7MUcLP0NwLZ7YlTrr2', 'Sziasztok! Sanyi vagyok és 4 éve foglalkozom fotózással. Szívesen megosztom veletek a munkáimat és bármikor fordulhattok hozzám segítségért. Versenyre való felkészítést is vállalok!', '/profile-pictures/1761584967721.jpg', 0),
(3, 'Dávid', 'kabzso820@hengersor.hu', '$2b$10$77rO1/wis8plfrsb8ooWhuFVRhr3D8oH34ZRF13qH/plHpzArhft.', 'Sziasztok Dávid vagyok. Mizu? Tapasztalt, de egyáltalán nem profi fotós vagyok. Csak egy átlagos srác aki a fotózás szerelmese.', '/profile-pictures/1768215912073.jfif', 0),
(4, 'Kabai Zsombor', 'kabai.zsombi@gmail.com', '$2b$10$3NiUroXsfKSnwSa6SxQ6Pu9fJhX/9dNH9r/DYTjDq9e4VNW4hjYVq', 'Sziasztok az én nevem Zsombor. Kezdő fotósnak tartom magam. A telefonommal szoktam fotózni és abból próbálom kihozni a legtöbbett.', '/profile-pictures/1762093987308.jpg', 0),
(5, 'Nagy Ernő', 'habtam963@hengersor.hu', '$2b$10$xMtP8sNLogakmRQ4cfSr/uqJT3TUOTwvbEOpk5SfqAfEYBpSX0Toa', 'Sziasztok, Ernő vagyok. Kezdőként most vettem egy Nikon D3500-at. Nagyon szeretek fotózni, és várom, hogy fejlődjek benne.', '/profile-pictures/1762245188727.jpg', 0),
(6, 'Anna Kovács', 'annakovacsfoto@gmail.com', '$2b$10$lN7ktCWhr48SQjTqYVJmEOGIB4xYh9Qyh/0Mmq3Zed.PcUNXhJKGm', 'Kezdő tájképfotós Budapesten, szeretek kora reggeli fényekkel kísérletezni. Keresek tippeket a kompozícióra.', '/profile-pictures/1769028224562.jpg', 0),
(7, 'PixelHunter87', 'pixelhunter87@gmail.com', '$2b$10$9JF3W/njYh2DLa0VtnpG0uN9tvIDllnMCnBW6He6drchgd2VbWALG', 'Hobbi portréfotós, 5 éve kattintgatok. Érdekel a természetes fény használata, szívesen tanulok profiktól.', '/profile-pictures/1769030450665.jpg', 0),
(8, 'László Nagy', 'laszlonagyphoto@gmail.com', '$2b$10$hOIshDmevNp1sPX0Si8d1Os2b0gDgCln//Vin48DI9PE60sqZA7V6', 'Haladó utazó fotós, főleg utcai pillanatokat örökítek meg. Megosztom tapasztalataimat kezdőkkel.', '/profile-pictures/1769031583605.jpg', 0),
(9, 'ShutterQueen', 'shutterqueen.hu@gmail.com', '$2b$10$HV0kebpDM5TgyYg6WwVKUeCOwLTbxCjFjGkbpVJE5qdPYUxWnIEPy', 'Nőként fotózom a mindennapi életet, makróval és portréval. Csatlakoztam a közösséghez inspirációért.', '/profile-pictures/1769032960645.jpg', 0),
(10, 'Tamás Szabó', 'tamasszabo.shoot@gmail.com', '$2b$10$E03GBrEMSOSLmQIZEsoUsO9aLxZMbTbLFj3ZNTic49DCDysp7e6WC', 'Profi stúdiófotós 10+ éves gyakorlattal, szívesen adok tanácsot világításról és utómunkáról.', '/profile-pictures/1769033678059.jpg', 0),
(11, 'Admin', 'info.sfl.technologies@gmail.com', '$2b$10$rHaKVG.APJTmDU3NhwZsg.uF7uhou441fnwUD4oLPN159bofieTwC', NULL, NULL, 1);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT a táblához `comment_votes`
--
ALTER TABLE `comment_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT a táblához `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT a táblához `image_votes`
--
ALTER TABLE `image_votes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=287;

--
-- AUTO_INCREMENT a táblához `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
