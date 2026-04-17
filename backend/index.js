const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();
const path = require('path');

require('./cron/notificacion.cron');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas modulares
const loginRoutes = require('./routes/login');
const asignaturaRoutes = require('./routes/asignaturas');
const eventoRoutes = require('./routes/eventos');
const profesorRoutes = require('./routes/profesores');
const perfilRoutes = require('./routes/perfil');
const dashboardRoutes = require('./routes/dashboard');

// Registrar rutas en la app
app.use('/api', loginRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api', perfilRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get('/', (req, res) => res.send('API de Mi Agenda Smart funcionando'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});