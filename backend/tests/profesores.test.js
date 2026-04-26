const request = require('supertest');
const express = require('express');

jest.mock('../config/db', () => ({
    pool: { execute: jest.fn() }
}));

const { pool } = require('../config/db');
const profesoresRouter = require('../routes/profesores');

const app = express();
app.use(express.json());
app.use('/api/profesores', profesoresRouter);

describe('API Profesores', () => {
    afterEach(() => jest.clearAllMocks());

    test('GET /api/profesores/:id_usuario devuelve la lista de docentes', async () => {
        pool.execute.mockResolvedValue([
            [{ id: 10, nombre_profesor: 'Alejandro García', email_contacto: 'alejandro@test.com' }]
        ]);

        const res = await request(app).get('/api/profesores/1');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].nombre_profesor).toBe('Alejandro García');
    });

    test('POST /api/profesores crea un profesor con éxito', async () => {
        pool.execute.mockResolvedValue([{ insertId: 50 }]);

        const res = await request(app)
            .post('/api/profesores')
            .send({
                nombre_profesor: 'Nuevo Profe',
                email_contacto: 'profe@test.com',
                id_usuario: 1
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(50);
    });

    test('DELETE /api/profesores/:id elimina correctamente', async () => {
        pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

        const res = await request(app).delete('/api/profesores/10');

        expect(res.statusCode).toBe(200);
    });
});