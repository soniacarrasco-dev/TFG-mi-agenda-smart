const { pool, transporter } = require("../config/db");

// Buscar tareas
const checkTasksToNotify = async (userId) => {
    const [earlyTasks] = await pool.query(`
    SELECT *
    FROM eventos_academicos
    WHERE id_usuario = ?
      AND DATEDIFF(fecha_vencimiento, CURDATE()) BETWEEN 1 AND 7
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

    const fechaFormateada = new Date(task.fecha_vencimiento).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let subject, html;

    if (type === "early") {
        subject = "Evento próximo";
        html = `
            <div style="font-family: Arial; padding: 20px;">
                <h2 style="color:#333;">Recordatorio de evento</h2>
                <p>El evento <strong>${task.titulo}</strong> está próximo a vencer.</p>
                <p style="font-size:16px;">
                    <strong>${fechaFormateada}</strong>
                </p>
            </div>
        `;
    }

    if (type === "last_day") {
        subject = "Evento vence HOY";
        html = `
            <div style="font-family: Arial; padding: 20px;">
                <h2 style="color:#d9534f;">¡Atención!</h2>
                <p>El evento <strong>${task.titulo}</strong> vence <strong>HOY</strong>.</p>
                <p style="font-size:16px;">
                    <strong>${fechaFormateada}</strong>
                </p>
            </div>
        `;
    }

    await transporter.sendMail({
        from: "notificaciones@gmail.com",
        to: email,
        subject,
        html
    });
};

module.exports = {
    checkTasksToNotify,
    sendEmail
};