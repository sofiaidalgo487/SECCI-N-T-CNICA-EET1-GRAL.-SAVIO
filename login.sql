-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: login
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(120) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('alumno','docente') NOT NULL DEFAULT 'alumno',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (7,'chavez@eet1saviopalpala.edu.ar','$2y$10$6pYCaNzY.fxBLcGjKr8ws.rw5LJ5c5LlWm1NF0J6CpFk5Lvk0lnvW','docente'),(8,'gabriel@eet1saviopalpala.edu.ar','$2y$10$PNkWwZ/M/Cuk2kdeUP.TH.F0qmXGcET1jW7RA4KVu3eTI/gfrYxiu','alumno'),(9,'juan@eet1saviopalpala.edu.ar','$2y$10$j25/tcs/x5bpTk7I5pndbOXDPTR2Xk2KBU7gEcYkc3AjfMmMCtk0O','alumno'),(10,'sofia@eet1saviopalpala.edu.ar','$2y$10$DtW9U1qV4hJ9Ci2nPboGbeOKXaJWngu.D6FV6OPyuMV5efSchauL6','docente'),(11,'kevin@eet1saviopalpala.edu.ar','$2y$10$wJz3UpggAqY5OQ4FxbufFOWOMpqUMcu43KqcWvHmPi6dHmN.sLB1m','alumno'),(12,'fernando@eet1saviopalpala.edu.ar','$2y$10$tGx.pcNxsJGXzDZSpIqtz.fX3u0LrBZfxkj6Zwi6GrCUbjZ7N/0ge','docente');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-27 20:19:43
