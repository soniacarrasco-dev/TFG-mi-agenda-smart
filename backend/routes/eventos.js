/**
 * @swagger
 * tags:
 *   - name: Eventos
 *     description: Gestión de eventos académicos y tareas
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const limpiarFecha = (fecha) => {
    if (!fecha || fecha === 'null' || fecha === '') return null;
    return fecha.split('T')[0];
};

/**
 * @swagger
 * /api/eventos/{id_usuario}:
 *   get:
 *     summary: Obtener todos los eventos de un usuario
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de eventos del usuario
 */
router.get('/:id_usuario', async (req, res) => {
    try {
        const query = `
            SELECT e.*, a.nombre_asignatura 
            FROM eventos_academicos e 
            JOIN asignaturas a ON e.id_asignatura = a.id 
            WHERE e.id_usuario = ? 
            ORDER BY e.fecha_vencimiento ASC
        `;
        const [rows] = await pool.execute(query, [req.params.id_usuario]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/eventos/proximos/{id_usuario}:
 *   get:
 *     summary: Obtener eventos próximos no completados
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de eventos próximos no completados
 */
router.get('/proximos/:id_usuario', async (req, res) => {
    try {
        const query = `
            SELECT e.*, a.nombre_asignatura 
            FROM eventos_academicos e
            JOIN asignaturas a ON e.id_asignatura = a.id
            WHERE e.id_usuario = ? 
              AND e.completado = FALSE
              AND e.fecha_vencimiento >= CURDATE() -- Quitamos el límite de 7 días
            ORDER BY e.fecha_vencimiento ASC
            LIMIT 10 -- Traemos suficientes para que React elija
        `;
        const [rows] = await pool.execute(query, [req.params.id_usuario]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/eventos:
 *   post:
 *     summary: Crear un nuevo evento con archivo
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 example: Tarea
 *               fecha:
 *                 type: string
 *                 format: date
 *               id_asignatura:
 *                 type: integer
 *               id_usuario:
 *                 type: integer
 *               archivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Permite subir hasta 5 archivos adjuntos
 *     responses:
 *       201:
 *         description: Evento creado con éxito
 */
router.post('/', upload.array('archivos', 5), async (req, res) => {
    const { titulo, tipo, fecha, fecha_vencimiento, id_asignatura, id_usuario } = req.body;

    const fechaFinal = limpiarFecha(fecha || fecha_vencimiento);
    const rutas = req.files ? req.files.map(f => f.path).join(',') : null;

    if (!id_asignatura || !id_usuario || !fechaFinal) {
        return res.status(400).json({
            error: "Faltan campos obligatorios: id_asignatura, id_usuario o fecha."
        });
    }

    try {
        const query = `
            INSERT INTO eventos_academicos 
            (titulo, tipo, fecha_vencimiento, id_asignatura, id_usuario, ruta_archivo, completado, nota) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            titulo || 'Sin título',
            tipo || 'Tarea',
            fechaFinal,
            id_asignatura,
            id_usuario,
            rutas,
            false, // completado por defecto
            null   // nota por defecto
        ]);

        res.status(201).json({ id: result.insertId, mensaje: "Creado ok" });
    } catch (error) {
        console.error("ERROR EN POST EVENTOS:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/eventos/{id}:
 *   put:
 *     summary: Actualizar evento, fecha de vencimiento y/o subir archivo
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Nuevo título del evento
 *               nota:
 *                 type: number
 *                 description: Nueva nota del evento
 *               completado:
 *                 type: boolean
 *                 description: Indica si el evento está completado
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de vencimiento del evento
 *               archivos:
 *                 type: array
 *                 items:
 *                    type: string
 *                    format: binary
 *                 description: Hasta 5 archivos adjuntos
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       500:
 *         description: Error al actualizar el evento
 */
router.put('/:id', upload.array('archivos', 5), async (req, res) => {
    const { titulo, nota, completado, fecha_vencimiento, fecha_entrega, ruta_archivo_existente } = req.body;

    const rutasNuevas = req.files && req.files.length > 0
        ? req.files.map(f => f.path).join(',')
        : '';

    let rutasFinales = ruta_archivo_existente || '';
    if (rutasNuevas) {
        rutasFinales = rutasFinales ? `${rutasFinales},${rutasNuevas}` : rutasNuevas;
    }

    try {
        const notaParaSQL = (nota === null || nota === 'null' || nota === '' || nota === undefined)
            ? null
            : nota;

        let sql = "UPDATE eventos_academicos SET titulo = ?, nota = ?, completado = ?, ruta_archivo = ?";

        let params = [
            titulo,
            notaParaSQL,
            completado === true || completado === 'true',
            rutasFinales
        ];

        if (fecha_vencimiento) {
            sql += ", fecha_vencimiento = ?";
            params.push(limpiarFecha(fecha_vencimiento));
        }
        if (fecha_entrega) {
            sql += ", fecha_entrega = ?";
            params.push(limpiarFecha(fecha_entrega));
        }

        sql += " WHERE id = ?";
        params.push(req.params.id);

        const [result] = await pool.execute(sql, params);
        res.json({ mensaje: "Actualizado correctamente" });
    } catch (error) {
        console.error("Error en Backend:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado correctamente
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error al eliminar el evento
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute("DELETE FROM eventos_academicos WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Evento no encontrado" });
        res.json({ mensaje: "Evento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el evento" });
    }
});

module.exports = router;