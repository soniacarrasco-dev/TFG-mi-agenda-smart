const db = require("../config/db");

const getDashboard = async (req, res) => {
    const userId = req.user.id;

    const [eventos] = await pool.query(
        "SELECT * FROM eventos_academicos WHERE id_usuario = ?",
        [userId]
    );

    res.json(eventos);
};

module.exports = { getDashboard };