describe('Flujo completo agenda académica', () => {

    it('Login + crear evento', () => {

        // =========================
        // MOCKS DINÁMICOS
        // =========================

        let eventosMock = [];

        // Mock asignaturas
        cy.intercept('GET', '/api/asignaturas/*', [
            { id: 1, nombre_asignatura: 'DAW' }
        ]);

        // Mock eventos (dinámico)
        cy.intercept('GET', '/api/eventos/*', (req) => {
            req.reply(eventosMock);
        });

        // Mock crear evento
        cy.intercept('POST', '/api/eventos', (req) => {
            const nuevoEvento = {
                id: 999,
                titulo: 'Evento Cypress',
                tipo: 'Tarea',
                nombre_asignatura: 'DAW',
                fecha: '2026-05-01',
                completado: false,
                id_asignatura: 1
            };

            eventosMock.push(nuevoEvento);

            req.reply({
                statusCode: 201,
                body: nuevoEvento
            });
        });

        // =========================
        // FLUJO DE USUARIO
        // =========================

        // 1. Ir a login
        cy.visit('http://localhost:3000');

        // 2. Login
        cy.get('input[type="email"]').type('test@test.com');
        cy.get('input[type="password"]').type('1234');
        cy.contains('Acceder').click();

        // 3. Verificar redirección
        cy.url().should('include', '/home');

        // 4. Ir a gestión académica
        cy.contains('Gestión Académica').click();

        // 5. Esperar a que cargue la vista
        cy.contains('MIS ASIGNATURAS');

        // =========================
        // CREAR EVENTO
        // =========================

        cy.get('[data-testid="btn-nuevo-evento"]')
            .should('be.visible')
            .click();

        cy.get('input[type="text"]').type('Evento Cypress');

        cy.get('select').first().select('Tarea');
        cy.get('select').eq(1).select('DAW');

        cy.get('input[type="date"]').type('2026-05-01');

        // Guardar
        cy.get('[data-testid="btn-guardar-evento"]').click();

        // =========================
        // VALIDACIÓN FINAL
        // =========================

        cy.contains('Evento Cypress', { timeout: 10000 })
            .should('be.visible');

    });

});