/**
 * @swagger
 * tags:
 *   - name: Profesores
 *     description: Directorio de contactos de profesores
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

/**
 * @swagger
 * /api/profesores/{id_usuario}:
 *   get:
 *     summary: Listar profesores creados por el usuario
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de profesores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre_profesor:
 *                     type: string
 *                   email_contacto:
 *                     type: string
 *                   horario_tutorias:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/:id_usuario', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, nombre_profesor, email_contacto, horario_tutorias FROM profesores WHERE id_usuario = ?',
            [req.params.id_usuario]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
});

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Registrar un nuevo profesor
 *     tags: [Profesores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_profesor
 *               - id_usuario
 *             properties:
 *               nombre_profesor:
 *                 type: string
 *                 example: Juan Pérez
 *               email_contacto:
 *                 type: string
 *                 example: profesor@email.com
 *               horario_tutorias:
 *                 type: string
 *                 example: Lunes 10:00-12:00
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Profesor creado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
    const { nombre_profesor, email_contacto, horario_tutorias, id_usuario } = req.body;

    // ✅ Validación básica
    if (!nombre_profesor || !id_usuario) {
        return res.status(400).json({ error: "Nombre e id_usuario son obligatorios" });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO profesores (nombre_profesor, email_contacto, horario_tutorias, id_usuario) VALUES (?, ?, ?, ?)',
            [nombre_profesor, email_contacto || null, horario_tutorias || null, id_usuario]
        );

        return res.status(201).json({
            id: result.insertId,
            mensaje: 'Profesor añadido',
            nombre_profesor,
            email_contacto,
            horario_tutorias,
            id_usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualizar datos de un profesor
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_profesor:
 *                 type: string
 *               email_contacto:
 *                 type: string
 *               horario_tutorias:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profesor actualizado correctamente
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_profesor, email_contacto, horario_tutorias } = req.body;

    try {
        await pool.execute(
            'UPDATE profesores SET nombre_profesor = ?, email_contacto = ?, horario_tutorias = ? WHERE id = ?',
            [nombre_profesor, email_contacto, horario_tutorias, id]
        );

        res.json({ mensaje: "Profesor actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Eliminar un profesor
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profesor eliminado correctamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.execute(
            'UPDATE asignaturas SET id_profesor = NULL WHERE id_profesor = ?',
            [id]
        );

        await pool.execute(
            'DELETE FROM profesores WHERE id = ?',
            [id]
        );

        res.json({ mensaje: "Profesor eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;