const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "aorajake@gmail.com",
        pass: "vgsw mpzd elig ceol"
    }
});

module.exports = { pool, transporter };