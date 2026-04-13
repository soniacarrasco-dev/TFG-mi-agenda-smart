/**
 * @swagger
 * tags:
 *   - name: Asignaturas
 *     description: Gestión de las asignaturas del usuario
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

/**
 * @swagger
 * /api/asignaturas/{id_usuario}:
 *   get:
 *     summary: Obtener todas las asignaturas de un usuario
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario logueado
 *     responses:
 *       200:
 *         description: Lista de asignaturas con su profesor asociado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre_asignatura:
 *                     type: string
 *                   nombre_profesor:
 *                     type: string
 */
router.get('/:id_usuario', async (req, res) => {
    try {
        const query = `
            SELECT a.*, p.nombre_profesor 
            FROM asignaturas a
            LEFT JOIN profesores p ON a.id_profesor = p.id
            WHERE a.id_usuario = ?`;
        const [rows] = await pool.execute(query, [req.params.id_usuario]);
        res.json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        res.status(500).json([]);
    }
});

/**
 * @swagger
 * /api/asignaturas:
 *   post:
 *     summary: Crear una nueva asignatura
 *     tags: [Asignaturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_asignatura:
 *                 type: string
 *               id_usuario:
 *                 type: integer
 *               id_profesor:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Asignatura creada
 */
router.post('/', async (req, res) => {
    const { nombre_asignatura, id_profesor, id_usuario } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO asignaturas (nombre_asignatura, id_usuario, id_profesor) VALUES (?, ?, ?)',
            [nombre_asignatura, id_usuario, id_profesor || null]
        );
        res.status(201).json({ id: result.insertId, nombre_asignatura, id_profesor, id_usuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/asignaturas/{id}:
 *   put:
 *     summary: Actualizar una asignatura existente
 *     tags: [Asignaturas]
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
 *               nombre_asignatura:
 *                 type: string
 *               id_profesor:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Asignatura actualizada con éxito
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_asignatura, id_profesor } = req.body;

    try {
        const query = `
            UPDATE asignaturas 
            SET nombre_asignatura = ?, id_profesor = ? 
            WHERE id = ?`;

        const [result] = await pool.execute(query, [
            nombre_asignatura,
            id_profesor || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Asignatura no encontrada" });
        }

        res.json({ mensaje: "Asignatura actualizada correctamente" });
    } catch (error) {
        console.error("Error en PUT /api/asignaturas:", error);
        res.status(500).json({ mensaje: "Error al actualizar la asignatura" });
    }
});

/**
 * @swagger
 * /api/asignaturas/{id}:
 *   delete:
 *     summary: Eliminar una asignatura
 *     tags: [Asignaturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado con éxito
 */
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute("DELETE FROM asignaturas WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "La asignatura no existe" });
        }

        res.json({ mensaje: "Asignatura eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar la asignatura" });
    }
});

module.exports = router;