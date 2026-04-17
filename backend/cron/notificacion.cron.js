const cron = require("node-cron");
const { pool } = require("../config/db");
const { checkTasksToNotify, sendEmail } = require("../services/notificacion.service");

// Ejecutar una vez al día (a las 09:00 por ejemplo)
/* cron.schedule("0 9 * * *", async () => { */
cron.schedule("0 9 * * *", async () => {
    console.log("Ejecutando verificación de eventos...");

    try {
        // Obtener todos los usuarios
        const [users] = await pool.query("SELECT id, email FROM usuarios");

        for (const user of users) {
            const { earlyTasks, lastDayTasks } = await checkTasksToNotify(user.id);

            // Notificación 7 días antes
            for (const task of earlyTasks) {
                try {
                    await sendEmail(user.email, task, "early");

                    await pool.query(
                        "UPDATE eventos_academicos SET notifica_7_dias = TRUE WHERE id = ?",
                        [task.id]
                    );

                    console.log(`Email 7 días enviado: ${task.titulo}`);
                } catch (err) {
                    console.error("Error enviando email early:", err);
                }
            }

            // Notificación último día
            for (const task of lastDayTasks) {
                try {
                    await sendEmail(user.email, task, "last_day");

                    await pool.query(
                        "UPDATE eventos_academicos SET notifica_ultimo_dia = TRUE WHERE id = ?",
                        [task.id]
                    );

                    console.log(`Email último día enviado: ${task.titulo}`);
                } catch (err) {
                    console.error("Error enviando email last day:", err);
                }
            }
        }

    } catch (error) {
        console.error("Error en cron:", error);
    }
});

module.exports = {};