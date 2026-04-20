# Mi Agenda Smart - Gestion Academica Intermodular

Proyecto full-stack desarrollado para el grado superior de Desarrollo de Aplicaciones Web (DAW). La aplicacion permite la gestion integral de asignaturas, profesorado y seguimiento de tareas con soporte para archivos adjuntos y calculo de calificaciones.

## Tecnologias utilizadas

* **Frontend:** React.js (Vite), React Router, React Icons.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL (Dockerizado)
* **Contenedorización** Docker, Docker Compose (backend y base de datos)
* **Gestion de Archivos:** Multer (Almacenamiento en servidor local).
* **Documentacion:** Swagger UI (OpenAPI 3.0).
* **Testing:**
  - Jest (pruebas unitarias)
  - Cypress (pruebas end-to-end)

## Requisitos previos

Para ejecutar el proyecto en un entorno local es necesario:
1. Docker y Docker Compose.
2. Git.

## [Repositorio de GitHub](https://github.com/soniacarrasco-dev/TFG-mi-agenda-smart.git)

## Instalacion y ejecución

### 1. Clonar el repositorio
1. git clone https://github.com/soniacarrasco-dev/TFG-mi-agenda-smart.git 
2. cd mi-agenda-smart

### 2. Configurar variables de entorno
Crear archivo .env en la raíz del proyecto

DB_HOST=db 
DB_USER=tu_usuario 
DB_PASSWORD=tu_contraseña 
DB_NAME=mi_agenda_smart 
PORT=3001

### 3. Levantar el proyecto con Docker
1. Navega a la carpeta del servidor: `cd backend`.
2. Levanta el contenedor: `docker-compose up --build`.
Esto levantará: 
- Backend (Node.js)
- Base de datos MySQL
3. Abre otra terminal nueva y navega a la carpeta del cliente: `cd frontend`.
- Ejecuta la app: `npm start`.
4. Accede en el navegador a `http://localhost:3000/`

### 4. Acceso a la aplicación
 - Frontend: http://localhost:3000
 - Backend API: http://localhost:3001
 - Swagger: http://localhost:3001/api-docs

### 5. Testing
* **Pruebas unitarias (Jest)**
Ejecutar desde /backend: `npm test`

Estas pruebas validan: 
 - Lógica de negocio
 - Controladores
 - Funciones internas

* **Pruebas end-to-end (Cypress)**
Ejecutar desde /frontend: `npx cypress open` o en modo consola `npx cypress run`

> Es necesario que el frontend y el backend estén en ejecución.

### 6. Documentación de la API
Disponible mediante Swagger en: `http://localhost:3001/api-docs`