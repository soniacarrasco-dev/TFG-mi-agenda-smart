const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db').pool;
const verificarToken = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión del perfil de usuario
 */

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener datos del perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: Juan
 *                 apellidos:
 *                   type: string
 *                   example: Pérez García
 *                 email:
 *                   type: string
 *                   example: juan@email.com
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/perfil', verificarToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT nombre, apellidos, email FROM usuarios WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los datos del servidor' });
    }
});

/**
 * @swagger
 * /api/usuarios/perfil:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - email
 *               - contraseñaActual
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellidos:
 *                 type: string
 *                 example: Pérez García
 *               email:
 *                 type: string
 *                 example: juan@email.com
 *               contraseñaActual:
 *                 type: string
 *                 example: 123456
 *               nuevaContraseña:
 *                 type: string
 *                 example: nueva123
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Perfil actualizado correctamente
 *       400:
 *         description: Contraseña incorrecta o faltante
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/perfil', verificarToken, async (req, res) => {
    const userId = req.user.id;
    const { nombre, apellidos, email, contraseñaActual, nuevaContraseña } = req.body;

    if (!contraseñaActual) {
        return res.status(400).json({ mensaje: 'Contraseña actual requerida' });
    }

    try {
        const [rows] = await pool.execute('SELECT password FROM usuarios WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const usuario = rows[0];

        const esValida = await bcrypt.compare(contraseñaActual, usuario.password);
        if (!esValida) return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });

        let hashedPassword = usuario.password;

        if (nuevaContraseña && nuevaContraseña.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(nuevaContraseña, salt);
        }

        await pool.execute(
            'UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, password = ? WHERE id = ?',
            [nombre, apellidos, email, hashedPassword, userId]
        );

        res.json({ mensaje: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;