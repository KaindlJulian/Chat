-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 02. Feb 2018 um 21:02
-- Server-Version: 10.1.29-MariaDB
-- PHP-Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `testlogin`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chat`
--

CREATE TABLE `chat` (
  `id` varchar(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `creator_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `chat`
--

INSERT INTO `chat` (`id`, `name`, `creator_id`) VALUES
('169f0504-2dc6-46f0-93b8-4f9d4bcb2729', 'Its me', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` varchar(40) DEFAULT NULL,
  `msg` text,
  `sendTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `message`
--

INSERT INTO `message` (`id`, `sender_id`, `receiver_id`, `msg`, `sendTime`) VALUES
(3, 1, '169f0504-2dc6-46f0-93b8-4f9d4bcb2729', 'Hello World', '2018-01-29 11:57:07'),
(4, 1, '169f0504-2dc6-46f0-93b8-4f9d4bcb2729', ' ', '2018-02-02 17:18:31');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `registration`
--

CREATE TABLE `registration` (
  `chat_id` varchar(40) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `registration`
--

INSERT INTO `registration` (`chat_id`, `user_id`) VALUES
('169f0504-2dc6-46f0-93b8-4f9d4bcb2729', 3),
('169f0504-2dc6-46f0-93b8-4f9d4bcb2729', 1),
('169f0504-2dc6-46f0-93b8-4f9d4bcb2729', 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `lastSeen` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`email`, `id`, `lastSeen`, `name`, `PASSWORD`, `status`, `username`) VALUES
('example@gmail.com', 1, '2018-02-02 17:20:45', 'John Doe', '$2a$10$lRtO0Z0JIzUKBfmLO3S6TuRqfBwubbS68.6EOE6ew3lS9PAkr4dPG', 'online', 'John'),
('adfasdf@gmail.com', 2, '2018-01-31 09:35:59', 'adsf', '$2a$10$hcdE2Wub6he9.xvug8bEY.wUP4n/psv5VgFTUb2As79k.NQl9r6Qq', 'online', 'dff'),
('schalkspieler@gmail.com', 3, '2018-01-24 11:56:24', 'Elias Schaechl', '$2a$10$PfHpNfSd3FpVgKVQwY0aQuiozGT4Jx3F4o4.mVH6q0zW1EyPdnZtS', 'online', 'SchalkSpieler');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Sender` (`sender_id`),
  ADD KEY `FK_Receiver` (`receiver_id`);

--
-- Indizes für die Tabelle `registration`
--
ALTER TABLE `registration`
  ADD KEY `FK_User` (`user_id`),
  ADD KEY `FK_chat` (`chat_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_Receiver` FOREIGN KEY (`receiver_id`) REFERENCES `chat` (`id`),
  ADD CONSTRAINT `FK_Sender` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `registration`
--
ALTER TABLE `registration`
  ADD CONSTRAINT `FK_User` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_chat` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
