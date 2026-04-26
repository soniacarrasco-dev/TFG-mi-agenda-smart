const request = require('supertest');
const express = require('express');

process.env.JWT_SECRET = 'testsecret';

jest.mock('bcryptjs', () => ({
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue('hashfake'),
    genSalt: jest.fn().mockResolvedValue('saltfake')
}));

jest.mock('../config/db', () => ({
    pool: {
        execute: jest.fn()
    }
}));

const { pool } = require('../config/db');
const loginRouter = require('../routes/login');

const app = express();
app.use(express.json());
app.use('/api', loginRouter);

describe('Login API', () => {

    test('login correcto', async () => {

        pool.execute.mockResolvedValue([
            [{
                id: 1,
                email: 'test@test.com',
                password: 'hashfake'
            }]
        ]);

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@test.com', password: '1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('usuario no existe', async () => {
        pool.execute.mockResolvedValue([[]]);

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'no@existe.com', password: '1234' });

        expect(res.statusCode).toBe(400);
    });

    test('login falla con contraseña incorrecta', async () => {
        const bcrypt = require('bcryptjs');
        // Forzamos que la comparación de bcrypt devuelva false
        bcrypt.compare.mockResolvedValue(false);

        pool.execute.mockResolvedValue([
            [{ id: 1, email: 'test@test.com', password: 'hash_real' }]
        ]);

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@test.com', password: 'password_equivocada' });

        expect(res.statusCode).toBe(400); // O 401 según tu lógica
        expect(res.body.mensaje).toBe('Contraseña incorrecta');
    });

});