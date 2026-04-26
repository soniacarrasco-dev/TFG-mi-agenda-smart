const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    console.log('📩 AUTH HEADER:', req.headers.authorization); // 👈 AQUÍ
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    console.log('🔑 TOKEN EXTRAIDO:', token); // 👈 AQUÍ
    if (!token) return res.status(401).json({ mensaje: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
console.log('🔐 JWT_SECRET EN VERIFY:', process.env.JWT_SECRET);            return res.status(403).json({ mensaje: 'Token inválido' });
        }

        console.log('✅ TOKEN OK:', usuario); // 👈 AQUÍ
        req.user = usuario;
        next();
    }); 
}

module.exports = verificarToken;