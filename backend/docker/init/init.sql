-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: mi_agenda_smart
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_asignatura` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_usuario` int NOT NULL,
  `id_profesor` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`id_usuario`),
  KEY `id_profesor` (`id_profesor`),
  CONSTRAINT `asignaturas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asignaturas_ibfk_2` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaturas`
--

LOCK TABLES `asignaturas` WRITE;
/*!40000 ALTER TABLE `asignaturas` DISABLE KEYS */;
INSERT INTO `asignaturas` VALUES (10,'DW Entorno Cliente',2,5),(11,'DWE Servidor',2,6),(12,'Despliegue de aplicaciones web',2,23),(13,'Diseño de interfaces web',2,6),(14,'Inglés',2,24),(15,'HLC (Blockchain)',2,25),(16,'Itinerario II',2,26),(21,'prueba',2,NULL),(22,'Dwe Cliente',3,36),(23,'Dwe Servidor',3,37),(24,'Despliegue de aplicaciones web',3,38),(25,'Diseño de interfaces',3,37),(26,'Inglés',3,39),(27,'HLC (Blockchain)',3,40),(28,'Itinerario II',3,41);
/*!40000 ALTER TABLE `asignaturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos_academicos`
--

DROP TABLE IF EXISTS `eventos_academicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos_academicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('Examen','Tarea','Videoconferencia','Otro') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Tarea',
  `fecha_vencimiento` date DEFAULT NULL,
  `nota` decimal(4,2) DEFAULT NULL,
  `completado` tinyint(1) DEFAULT '0',
  `id_asignatura` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `ruta_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asignatura_id` (`id_asignatura`),
  KEY `usuario_id` (`id_usuario`),
  CONSTRAINT `eventos_academicos_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `eventos_academicos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos_academicos`
--

LOCK TABLES `eventos_academicos` WRITE;
/*!40000 ALTER TABLE `eventos_academicos` DISABLE KEYS */;
INSERT INTO `eventos_academicos` VALUES (12,'UD1 Caso práctico','Tarea','2025-10-06',10.00,1,10,2,'','2025-10-11'),(13,'UD5 CASO PRACTICO','Tarea','2026-03-30',0.00,0,10,2,NULL,NULL),(14,'UD2 CASO PRACTICO','Tarea','2025-11-24',7.50,1,10,2,NULL,'2025-11-24'),(15,'Examen eliminatorio','Examen','2026-02-01',10.00,1,10,2,'','2026-02-04'),(16,'UD3 CASO PRACTICO','Tarea','2024-12-17',NULL,1,10,2,'','2025-12-11'),(17,'UD4 CASO PRACTICO','Tarea','2026-02-09',NULL,1,10,2,'','2026-02-04'),(18,'UD5 CASO PRACTICO','Tarea','2026-04-18',NULL,0,12,2,NULL,NULL),(19,'UD7 CASO PRACTICO','Tarea','2026-04-17',NULL,0,11,2,NULL,NULL),(20,'UD6 CASO PRACTICO','Tarea','2026-05-29',NULL,0,12,2,NULL,NULL),(21,'UD5 CASO PRACTICO','Tarea','2026-03-31',NULL,0,13,2,NULL,NULL),(22,'UD4 CASO PRACTICO','Tarea','2026-04-19',NULL,0,16,2,NULL,NULL),(27,'Video presentación editado','Videoconferencia','2026-04-08',0.00,0,14,2,'uploads\\1775826318914.png',NULL),(32,'prueba 16','Examen','2026-04-14',NULL,1,10,2,'','2026-04-11'),(38,'UD1 CASO PRACTICO','Tarea','2025-10-13',10.00,1,22,3,'','2025-10-14'),(39,'UD2 CASO PRACTICO','Tarea','2025-11-29',7.50,1,22,3,'','2025-11-24'),(40,'UD3 CASO PRACTICO','Tarea','2026-01-06',NULL,1,22,3,'','2026-01-07'),(41,'UD4 CASO PRACTICO','Tarea','2026-02-22',NULL,1,22,3,'','2026-02-17'),(42,'UD5 CASO PRACTICO','Tarea','2026-03-29',NULL,1,22,3,'','2026-03-23'),(43,'UD6 CASO PRACTICO','Tarea','2026-05-04',NULL,0,22,3,'',NULL),(44,'UD1 CASO PRACTICO','Tarea','2025-10-12',10.00,1,23,3,'','2026-04-13'),(45,'UD2 CASO PRACTICO','Tarea','2025-11-26',10.00,1,23,3,'','2025-11-24'),(46,'UD3 CASO PRACTICO','Tarea','2025-12-29',10.00,1,23,3,'','2025-12-17'),(47,'UD4 CASO PRACTICO','Tarea','2026-01-29',10.00,1,23,3,'','2026-01-24'),(48,'UD5 CASO PRACTICO','Tarea','2026-02-26',10.00,1,23,3,'','2026-02-06'),(49,'UD6 CASO PRACTICO','Tarea','2026-03-29',10.00,1,23,3,'','2026-03-12'),(50,'UD7 CASO PRACTICO','Tarea','2026-04-16',NULL,1,23,3,'','2026-04-09'),(51,'UD8 CASO PRACTICO','Tarea','2026-04-30',NULL,0,23,3,'',NULL),(52,'UD1 CASO PRACTICO','Tarea','2025-10-17',10.00,1,24,3,'','2025-10-18'),(53,'UD2 CASO PRACTICO','Tarea','2025-11-13',10.00,1,24,3,'','2025-11-14'),(54,'UD3 CASO PRACTICO','Tarea','2026-01-23',10.00,1,24,3,'','2026-01-19'),(55,'UD4 CASO PRACTICO','Tarea','2026-03-13',9.75,1,24,3,'','2026-03-03'),(56,'UD5 CASO PRACTICO','Tarea','2026-04-18',NULL,0,24,3,'',NULL),(57,'UD6 CASO PRACTICO','Tarea','2026-05-29',NULL,0,24,3,'',NULL),(58,'UD1 CASO PRACTICO','Tarea','2025-10-12',10.00,1,25,3,'','2025-10-13'),(59,'UD2 CASO PRACTICO','Tarea','2025-11-02',10.00,1,25,3,'','2025-11-03'),(60,'UD3 CASO PRACTICO','Tarea','2025-12-29',10.00,1,25,3,'','2025-12-19'),(61,'UD4 CASO PRACTICO','Tarea','2026-02-26',10.00,1,25,3,'','2026-02-16'),(62,'UD5 CASO PRACTICO','Tarea','2026-03-29',10.00,1,25,3,'','2026-03-24'),(63,'UD6 CASO PRACTICO','Tarea','2026-04-30',NULL,0,25,3,'',NULL),(64,'UD1 CASO PRACTICO','Tarea','2025-10-05',9.66,1,26,3,'','2025-10-06'),(65,'UD2 CASO PRACTICO','Tarea','2025-11-09',9.60,1,26,3,'','2025-11-10'),(66,'UD3 CASO PRACTICO','Tarea','2026-01-16',10.00,1,26,3,'','2025-12-27'),(67,'UD4 CASO PRACTICO','Tarea','2026-02-20',10.00,1,26,3,'','2026-02-06'),(68,'UD5 CASO PRACTICO','Tarea','2026-03-28',10.00,1,26,3,'','2026-03-07'),(69,'UD6 CASO PRACTICO','Tarea','2026-05-04',NULL,0,26,3,'',NULL),(70,'UD1 CASO PRACTICO','Tarea','2025-10-24',10.00,1,27,3,'','2025-10-25'),(71,'UD2 CASO PRACTICO','Tarea','2025-11-29',10.00,1,27,3,'','2025-11-24'),(72,'UD3 CASO PRACTICO','Tarea','2025-12-17',10.00,1,27,3,'','2025-12-08'),(73,'UD4 CASO PRACTICO','Tarea','2026-01-13',9.50,1,27,3,'','2025-12-29'),(74,'UD5 CASO PRACTICO','Tarea','2026-02-06',9.75,1,27,3,'','2026-01-26'),(75,'UD6 CASO PRACTICO','Tarea','2026-03-13',10.00,1,27,3,'','2026-03-04'),(76,'UD8 CASO PRACTICO','Tarea','2026-04-30',NULL,0,27,3,'',NULL),(77,'UD1 CASO PRACTICO','Tarea','2025-10-05',10.00,1,28,3,'','2025-10-06'),(78,'UD2 CASO PRACTICO','Tarea','2026-01-09',10.00,1,28,3,'','2025-12-27'),(79,'UD3 CASO PRACTICO','Tarea','2026-02-27',9.00,1,28,3,'','2026-02-23'),(80,'UD4 CASO PRACTICO','Tarea','2026-04-17',10.00,1,28,3,'','2026-03-25'),(81,'prueba evento ingles','Videoconferencia','2026-04-22',NULL,0,26,3,'',NULL);
/*!40000 ALTER TABLE `eventos_academicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_profesor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_contacto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `horario_tutorias` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `profesores_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (5,'Maria Jesus Rodríguez Sanchez','maria@gmail.com','Lunes de 8:00 a 10:00 h',2),(6,'Alejandro Romero Morales','alejandroromero@cesurformacion.com','Martes de 10:00 a 12:00 h',2),(23,'Carlos Pastor Paz','carlos@gmail.com','Miercoles de 10:00 a 12:00 h',2),(24,'Laura Torres Jiménez','',NULL,2),(25,'Daniel de la Torre Bolos','',NULL,2),(26,'Paloma Ales Hermosa','',NULL,2),(36,'María Jesús Rodríguez Sánchez','maria@gmail.com',NULL,3),(37,'Alejandro Romero Morales','alejandro@gmail.com',NULL,3),(38,'Carlos Pastor Paz','carlos@gmail.com',NULL,3),(39,'Laura Torres Jimenez','laura@gmail.com',NULL,3),(40,'Daniel de la Torre Bolós','daniel@gmail.com',NULL,3),(41,'Paloma Ales Hermosa','paloma@gmail.com',NULL,3);
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellidos` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-17 11:39:20
