const request = require('supertest');
const express = require('express');

// Mock de la BD
jest.mock('../config/db', () => ({
    pool: {
        execute: jest.fn()
    }
}));

const { pool } = require('../config/db');
const eventosRouter = require('../routes/eventos'); // ajusta ruta

const app = express();
app.use(express.json());
app.use('/api/eventos', eventosRouter);

describe('API Eventos', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/eventos/:id_usuario devuelve eventos', async () => {
        pool.execute.mockResolvedValue([
            [{ id: 1, titulo: 'Examen', nombre_asignatura: 'DAW' }]
        ]);

        const res = await request(app).get('/api/eventos/1');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].titulo).toBe('Examen');
    });

    test('POST /api/eventos falla si faltan campos', async () => {
        const res = await request(app)
            .post('/api/eventos')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    test('POST /api/eventos crea evento correctamente', async () => {
        pool.execute.mockResolvedValue([{ insertId: 10 }]);

        const res = await request(app)
            .post('/api/eventos')
            .field('titulo', 'Tarea')
            .field('id_asignatura', 1)
            .field('id_usuario', 1)
            .field('fecha', '2026-04-20');

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(10);
    });

});