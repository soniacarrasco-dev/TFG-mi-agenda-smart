const { pool, transporter } = require("../config/db");

// Buscar tareas
const checkTasksToNotify = async (userId) => {
    const [earlyTasks] = await pool.query(`
    SELECT *
    FROM eventos_academicos
    WHERE id_usuario = ?
      AND DATEDIFF(fecha_vencimiento, CURDATE()) BETWEEN 0 AND 7
      AND notifica_7_dias = FALSE
      AND completado = FALSE
  `, [userId]);

    const [lastDayTasks] = await pool.query(`
    SELECT *
    FROM eventos_academicos
    WHERE id_usuario = ?
      AND DATEDIFF(fecha_vencimiento, CURDATE()) = 0
      AND notifica_ultimo_dia = FALSE
      AND completado = FALSE
  `, [userId]);

    return { earlyTasks, lastDayTasks };
};

// Enviar email
const sendEmail = async (email, task, type) => {
    let subject, text;

    if (type === "early") {
        subject = "Evento próximo a su vencimiento";
        text = `El evento "${task.titulo}" vence el ${task.fecha_vencimiento}`;
    }

    if (type === "last_day") {
        subject = "¡Evento vence HOY!";
        text = `El evento "${task.titulo}" vence HOY`;
    }

    await transporter.sendMail({
        from: "notificaciones@gmail.com",
        to: email,
        subject,
        text
    });
};

module.exports = {
    checkTasksToNotify,
    sendEmail
};