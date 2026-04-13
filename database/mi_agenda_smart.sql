CREATE DATABASE  IF NOT EXISTS `mi_agenda_smart` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `mi_agenda_smart`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mi_agenda_smart
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
-- Table structure for table `asignaturas`
--

DROP TABLE IF EXISTS `asignaturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaturas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_asignatura` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_profesor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`id_usuario`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `asignaturas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaturas_ibfk_2` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaturas`
--

LOCK TABLES `asignaturas` WRITE;
/*!40000 ALTER TABLE `asignaturas` DISABLE KEYS */;
INSERT INTO `asignaturas` VALUES (10,'DW Entorno Cliente',2,5),(11,'DWE Servidor',2,6),(12,'Despliegue de aplicaciones web',2,23),(13,'Diseño de interfaces web',2,6),(14,'Inglés',2,24),(15,'HLC (Blockchain)',2,25),(16,'Itinerario II',2,26),(21,'prueba',2,NULL);
/*!40000 ALTER TABLE `asignaturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos_academicos`
--

DROP TABLE IF EXISTS `eventos_academicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos_academicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `tipo` enum('Examen','Tarea','Videoconferencia','Otro') DEFAULT 'Tarea',
  `fecha_vencimiento` date DEFAULT NULL,
  `nota` decimal(4,2) DEFAULT NULL,
  `completado` tinyint(1) DEFAULT 0,
  `id_asignatura` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asignatura_id` (`id_asignatura`),
  KEY `usuario_id` (`id_usuario`),
  CONSTRAINT `eventos_academicos_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `eventos_academicos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos_academicos`
--

LOCK TABLES `eventos_academicos` WRITE;
/*!40000 ALTER TABLE `eventos_academicos` DISABLE KEYS */;
INSERT INTO `eventos_academicos` VALUES (12,'UD1 Caso práctico','Tarea','2025-10-06',10.00,1,10,2,'','2025-10-11'),(13,'UD5 CASO PRACTICO','Tarea','2026-03-30',0.00,0,10,2,NULL,NULL),(14,'UD2 CASO PRACTICO','Tarea','2025-11-24',7.50,1,10,2,NULL,'2025-11-24'),(15,'Examen eliminatorio','Examen','2026-02-01',10.00,1,10,2,'','2026-02-04'),(16,'UD3 CASO PRACTICO','Tarea','2024-12-17',NULL,1,10,2,'','2025-12-11'),(17,'UD4 CASO PRACTICO','Tarea','2026-02-09',NULL,1,10,2,'','2026-02-04'),(18,'UD5 CASO PRACTICO','Tarea','2026-04-18',NULL,0,12,2,NULL,NULL),(19,'UD7 CASO PRACTICO','Tarea','2026-04-17',NULL,0,11,2,NULL,NULL),(20,'UD6 CASO PRACTICO','Tarea','2026-05-29',NULL,0,12,2,NULL,NULL),(21,'UD5 CASO PRACTICO','Tarea','2026-03-31',NULL,0,13,2,NULL,NULL),(22,'UD4 CASO PRACTICO','Tarea','2026-04-19',NULL,0,16,2,NULL,NULL),(27,'Video presentación editado','Videoconferencia','2026-04-08',0.00,0,14,2,'uploads\\1775826318914.png',NULL),(32,'prueba 16','Examen','2026-04-14',NULL,1,10,2,'','2026-04-11');
/*!40000 ALTER TABLE `eventos_academicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_profesor` varchar(100) NOT NULL,
  `email_contacto` varchar(255) DEFAULT NULL,
  `horario_tutorias` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `profesores_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (5,'Maria Jesus Rodríguez Sanchez','maria@gmail.com','Lunes de 8:00 a 10:00 h',2),(6,'Alejandro Romero Morales','alejandroromero@cesurformacion.com','Martes de 10:00 a 12:00 h',2),(23,'Carlos Pastor Paz','carlos@gmail.com','Miercoles de 10:00 a 12:00 h',2),(24,'Laura Torres Jiménez','',NULL,2),(25,'Daniel de la Torre Bolos','',NULL,2),(26,'Paloma Ales Hermosa','',NULL,2);
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expira` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,'Sonike','sonia@gmail.com','$2b$10$Fvo7oUF3o9QfNj9ZmrC3muk1e17DNmUztYeZhTo8DxTTvybQ3HTVi','Carrasco',NULL,NULL),(3,'Sonia','aorajake@gmail.com','$2b$10$eYyopUJNzb9JoYBmRN9nkuHcH38WOCAr.z8PzKePEvWxpWos.HSGa','Carrasco',NULL,NULL),(5,'Rocío','rocio@gmail.com','$2b$10$ik.X0ImIt2LwRvI8TMbfcO.GsCRRXBp..g4TpOBuqEr16Q9R9eG5q','Fernández Payán',NULL,NULL),(6,'Marina','marina@gmail.com','$2b$10$axhgi7GJ53dKMvOs9dQLKe4rolF4gI7.XwuQbEjXwFCTKoQsVqo7W','Ramos',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'mi_agenda_smart'
--

--
-- Dumping routines for database 'mi_agenda_smart'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 19:19:14
