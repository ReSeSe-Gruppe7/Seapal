-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Jun 2013 um 18:27
-- Server Version: 5.5.27
-- PHP-Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `seapal`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--

CREATE TABLE IF NOT EXISTS `benutzer` (
  `bnr` int(11) NOT NULL AUTO_INCREMENT,
  `benutzername` varchar(20) NOT NULL,
  `passwort` varchar(10) NOT NULL,
  `vorname` varchar(20) NOT NULL,
  `nachname` varchar(20) NOT NULL,
  `mail` varchar(30) NOT NULL,
  `geburtsdatum` date NOT NULL,
  `registrierung` date NOT NULL,
  PRIMARY KEY (`bnr`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Daten für Tabelle `benutzer`
--

INSERT INTO `benutzer` (`bnr`, `benutzername`, `passwort`, `vorname`, `nachname`, `mail`, `geburtsdatum`, `registrierung`) VALUES
(1, 'dominic', 'pwd', 'Dominic', 'Eschbach', 'doeschba@htwg-konstanz.de', '2012-07-04', '2012-10-03'),
(2, 'timo', 'pwd', 'Timo', 'Partl', 'tipartl@htwg-konstanz.de', '2012-07-02', '2012-10-03');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bootinfo`
--

CREATE TABLE IF NOT EXISTS `bootinfo` (
  `bnr` int(11) NOT NULL AUTO_INCREMENT,
  `bootname` varchar(30) NOT NULL,
  `registernummer` int(11) NOT NULL,
  `segelzeichen` varchar(5) NOT NULL,
  `heimathafen` varchar(30) DEFAULT NULL,
  `yachtclub` varchar(30) DEFAULT NULL,
  `eigner` varchar(30) NOT NULL,
  `versicherung` varchar(30) NOT NULL,
  `rufzeichen` varchar(5) DEFAULT NULL,
  `typ` varchar(10) NOT NULL,
  `konstrukteur` varchar(30) DEFAULT NULL,
  `laenge` float NOT NULL,
  `breite` float NOT NULL,
  `tiefgang` float NOT NULL,
  `masthoehe` float NOT NULL,
  `verdraengung` float NOT NULL,
  `rigart` varchar(10) DEFAULT NULL,
  `baujahr` int(11) NOT NULL,
  `motor` varchar(30) DEFAULT NULL,
  `tankgroesse` float DEFAULT NULL,
  `wassertankgroesse` float DEFAULT NULL,
  `abwassertankgroesse` float DEFAULT NULL,
  `grosssegelgroesse` float DEFAULT NULL,
  `genuagroesse` float DEFAULT NULL,
  `spigroesse` float DEFAULT NULL,
  PRIMARY KEY (`bnr`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `bootinfo`
--

INSERT INTO `bootinfo` (`bnr`, `bootname`, `registernummer`, `segelzeichen`, `heimathafen`, `yachtclub`, `eigner`, `versicherung`, `rufzeichen`, `typ`, `konstrukteur`, `laenge`, `breite`, `tiefgang`, `masthoehe`, `verdraengung`, `rigart`, `baujahr`, `motor`, `tankgroesse`, `wassertankgroesse`, `abwassertankgroesse`, `grosssegelgroesse`, `genuagroesse`, `spigroesse`) VALUES
(1, 'Titanic', 101, 'TI101', 'New York', 'New York Yacht Club', 'George Boat', 'Württembergische', 'TI', 'Schiff', 'Peter Schiff', 200, 50, 7, 10, 1000, 'T34', 1993, 'Duotec 100', 500, 50, 30, 10, 25, 13),
(2, 'Queen Mary 2', 80, 'QM80', 'Dover', 'Dover Yacht Club', 'Hans Ebert', 'Wüstenrot', 'QM', 'Schiff', 'Rainer Berger', 200, 50, 7, 10, 1000, 'T20', 1993, 'Duotec 100', 500, 50, 30, 10, 25, 13),
(3, 'MS Deutschland', 150, 'MSD15', 'Hamburg', 'Hamburg Yacht Club', 'Peter Miller', 'Allianz', 'MSD', 'Schiff', 'Emil Klaus', 200, 50, 7, 10, 1000, 'T27', 1993, 'Duotec 100', 500, 50, 30, 10, 25, 13);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `play_evolutions`
--

CREATE TABLE IF NOT EXISTS `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `apply_script` text,
  `revert_script` text,
  `state` varchar(255) DEFAULT NULL,
  `last_problem` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tripinfo`
--

CREATE TABLE IF NOT EXISTS `tripinfo` (
  `tnr` int(11) NOT NULL AUTO_INCREMENT,
  `titel` varchar(30) NOT NULL,
  `von` varchar(30) NOT NULL,
  `nach` varchar(30) NOT NULL,
  `skipper` varchar(30) NOT NULL,
  `crew` varchar(100) DEFAULT NULL,
  `tstart` date NOT NULL,
  `tende` date NOT NULL,
  `tdauer` float NOT NULL,
  `motor` float DEFAULT NULL,
  `tank` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`tnr`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `tripinfo`
--

INSERT INTO `tripinfo` (`tnr`, `titel`, `von`, `nach`, `skipper`, `crew`, `tstart`, `tende`, `tdauer`, `motor`, `tank`) VALUES
(1, 'Langer Trip nach England', 'Hamburg', 'Dover', 'Hr. Hein', 'Martin Felix Manuel', '2012-07-02', '2012-07-02', 300, 1241, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `weatherinfo`
--

CREATE TABLE IF NOT EXISTS `weatherinfo` (
  `windstrength` varchar(30) NOT NULL,
  `winddirection` varchar(30) NOT NULL,
  `airpressure` varchar(30) NOT NULL,
  `temperature` varchar(30) NOT NULL,
  `clouds` tinyint(1) DEFAULT '0',
  `rain` tinyint(1) DEFAULT '0',
  `wavehight` varchar(30) NOT NULL,
  `wavedirection` varchar(30) NOT NULL,
  `date` date DEFAULT NULL,
  `inr` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`inr`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Daten für Tabelle `weatherinfo`
--

INSERT INTO `weatherinfo` (`windstrength`, `winddirection`, `airpressure`, `temperature`, `clouds`, `rain`, `wavehight`, `wavedirection`, `date`, `inr`) VALUES
('20', '20', '23', '23', 0, 0, '20', 'null', '2013-06-07', 3),
('20', '200', '25', '26', 0, 0, '20', '20', '2013-06-14', 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `wegpunkte`
--

CREATE TABLE IF NOT EXISTS `wegpunkte` (
  `wnr` int(11) NOT NULL AUTO_INCREMENT,
  `tnr` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `btm` varchar(30) NOT NULL,
  `dtm` varchar(30) NOT NULL,
  `lat` varchar(30) NOT NULL,
  `lng` varchar(30) NOT NULL,
  `sog` varchar(30) NOT NULL,
  `cog` varchar(30) NOT NULL,
  `manoever` varchar(30) DEFAULT NULL,
  `vorsegel` varchar(30) DEFAULT NULL,
  `wdate` varchar(30) DEFAULT NULL,
  `wtime` varchar(30) DEFAULT NULL,
  `marker` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`wnr`),
  KEY `tnr` (`tnr`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Daten für Tabelle `wegpunkte`
--

INSERT INTO `wegpunkte` (`wnr`, `tnr`, `name`, `btm`, `dtm`, `lat`, `lng`, `sog`, `cog`, `manoever`, `vorsegel`, `wdate`, `wtime`, `marker`) VALUES
(1, 1, 'Marker 1', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 2'),
(2, 1, 'Marker 2', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 3'),
(3, 1, 'Marker 3', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 4'),
(4, 1, 'Marker 4', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 5'),
(5, 1, 'Marker 5', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 6'),
(6, 1, 'Marker 6', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 7'),
(7, 1, 'Marker 7', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 8'),
(8, 1, 'Marker 8', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 9'),
(9, 1, 'Marker 9', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Marker 10'),
(10, 1, 'Marker 10', 'btm', 'dtm', 'lat', 'lng', 'sog', 'cog', 'manoever', 'vorsegel', 'Date', 'Time', 'Ziel');

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `wegpunkte`
--
ALTER TABLE `wegpunkte`
  ADD CONSTRAINT `wegpunkte_ibfk_1` FOREIGN KEY (`tnr`) REFERENCES `tripinfo` (`tnr`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
