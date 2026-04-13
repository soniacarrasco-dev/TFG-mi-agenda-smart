/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: Gestión de usuarios y autenticación
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, transporter } = require('../config/db');
const crypto = require("crypto");


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales incorrectas
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ mensaje: 'El usuario no existe' });

        const usuario = rows[0];
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        res.json({
            mensaje: '¡Bienvenido!', token, user: {
                id: usuario.id, nombre: usuario.nombre, apellidos: usuario.apellidos, email: usuario.email
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
});

/**
 * @swagger
 * /api/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 */
router.post('/registro', async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.execute(
            'INSERT INTO usuarios (nombre, apellidos, email, password) VALUES (?, ?, ?, ?)',
            [nombre, apellidos, email, hashedPassword]
        );
        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensaje: 'El correo ya existe' });
        res.status(500).json({ mensaje: 'Error al registrar' });
    }
});

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Enviar correo de recuperación
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado
 *       500:
 *         description: Error de envío
 */
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Correo no registrado' });
        }

        // Generar token seguro
        const token = crypto.randomBytes(32).toString("hex");

        // Expira en un día
        const hoy = new Date();
        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        const expiraLimpia = mañana.toISOString().split('T')[0];

        await pool.execute(
            'UPDATE usuarios SET reset_token = ?, reset_token_expira = ? WHERE email = ?',
            [token, expiraLimpia, email]
        );
        // Link
        const link = `http://localhost:3000/reset-password?token=${token}`;

        await transporter.sendMail({
            from: '"Mi Agenda SMART" <soporte@miagenda.com>',
            to: email,
            subject: 'Recuperar Contraseña',
            html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; text-align: center;">
    
    <h2 style="color: #000; margin-bottom: 20px;">
      ¿Olvidaste tu contraseña?
    </h2>

    <p style="color: #555; font-size: 14px; margin-bottom: 30px;">
      No te preocupes. Haz clic en el botón de abajo para restablecerla:
    </p>

    <a href="${link}" 
       style="
         display: inline-block;
         padding: 12px 20px;
         background-color: #1a73e8;
         color: #ffffff;
         text-decoration: none;
         border-radius: 6px;
         font-weight: bold;
       ">
       Cambiar contraseña
    </a>

  </div>
</div>
`
        });

        res.json({ mensaje: 'Correo enviado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al enviar' });
    }
});

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Actualizar contraseña olvidada
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       500:
 *         description: Error al actualizar
 */
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expira > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ mensaje: 'Token inválido o expirado' });
        }

        const usuario = rows[0];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.execute(
            `UPDATE usuarios 
             SET password = ?, reset_token = NULL, reset_token_expira = NULL 
             WHERE id = ?`,
            [hashedPassword, usuario.id]
        );

        res.json({ mensaje: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar' });
    }
});

module.exports = router;