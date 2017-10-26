-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.5.20-log - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para test
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `test`;

-- Volcando estructura para tabla test.gestordescargas
CREATE TABLE IF NOT EXISTS `gestordescargas` (
  `nombreArchivo` varchar(50) DEFAULT NULL,
  `Index` varchar(50) DEFAULT NULL,
  `maxIndex` varchar(50) DEFAULT NULL,
  `fechaSubida` datetime DEFAULT NULL,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  KEY `Índice 1` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla test.gestordescargas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `gestordescargas` DISABLE KEYS */;
/*!40000 ALTER TABLE `gestordescargas` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
