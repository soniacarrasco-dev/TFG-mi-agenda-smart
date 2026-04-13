# Mi Agenda Smart - Gestion Academica Intermodular

Proyecto full-stack desarrollado para el grado superior de Desarrollo de Aplicaciones Web (DAW). La aplicacion permite la gestion integral de asignaturas, profesorado y seguimiento de tareas con soporte para archivos adjuntos y calculo de calificaciones.

## Tecnologias utilizadas

* **Frontend:** React.js (Vite), React Router, React Icons.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL (Conexion directa mediante pool de conexiones).
* **Gestion de Archivos:** Multer (Almacenamiento en servidor local).
* **Documentacion:** Swagger UI (OpenAPI 3.0).

## Requisitos previos

Para ejecutar el proyecto en un entorno local es necesario:
1. Node.js (Version 18 o superior).
2. MySQL Server (Instalancia local activa).
3. MySQL Workbench o herramienta similar para la gestion de la base de datos.
4. Git.

## Instalacion y configuracion

## [Repositorio de GitHub](https://github.com/soniacarrasco-dev/mi-agenda-smart.git)

### 1. Base de Datos
1. Accede a tu instancia de MySQL mediante Workbench.
2. Ejecuta el script SQL ubicado en `/database/mi_agenda_smart.sql`.
3. Verifica que el servicio de MySQL este iniciado en tu sistema.

### 2. Configuracion del backend
1. Navega a la carpeta del servidor: `cd backend`.
2. Instala las dependencias necesarias: `npm install`.
3. Arranca el servidor: `node index.js`
4. Crea un archivo `.env` en la raiz de la carpeta `/backend` con las siguientes variables:
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=mi_agenda_smart
   PORT=3001

### 3. Configuración del frontend
1. Navega a la carpeta del frontend: `cd frontend`
2. Instala dependencias: `npm install`
3. Ejecuta la app: `npm start`
4. Accede en el navegador a `http://localhost:3000`

### Documentación de la API
Una vez que el backend esté corriendo (`npm start` en la carpeta `backend`), puedes acceder a la documentación Swagger en tu navegador en:

http://localhost:3001/api-docs