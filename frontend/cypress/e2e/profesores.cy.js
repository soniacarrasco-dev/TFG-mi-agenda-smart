describe('Gestión de Profesores - Flujo Completo', () => {

    // Lista dinámica para simular el backend
    let listaProfesores = [
        {
            id: 10,
            nombre_profesor: 'Alejandro García Pérez',
            email_contacto: 'alejandro@test.com',
            horario_tutorias: 'Lunes 10:00 - 12:00'
        }
    ];

    beforeEach(() => {
        Cypress.on('uncaught:exception', () => false);

        // 1. MOCK DE LOGIN (Estructura data.user)
        cy.intercept('POST', '**/api/login', {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                user: { nombre: 'Sonia', id: 1 }
            }
        });

        // 2. MOCK DE LECTURA (GET)
        cy.intercept('GET', '**/api/profesores/*', (req) => {
            req.reply(listaProfesores);
        }).as('getProfesores');

        cy.visit('http://localhost:3000');
        cy.get('input[type="email"]').type('test@test.com');
        cy.get('input[type="password"]').type('1234');
        cy.get('.btn-access').click();

        // Navegación
        cy.contains('Profesores', { timeout: 10000 }).click();
        cy.wait('@getProfesores');
    });

    it('Debe crear un profesor y luego eliminarlo', () => {
        const nuevoProf = {
            id: 11,
            nombre_profesor: 'Juan Programador',
            email_contacto: 'juan@test.com',
            horario_tutorias: 'Martes 16:00'
        };

        // --- PARTE 1: CREACIÓN ---
        cy.intercept('POST', '**/api/profesores', (req) => {
            listaProfesores.push(nuevoProf);
            req.reply({ statusCode: 201, body: { mensaje: 'Profesor añadido correctamente' } });
        }).as('postProfesor');

        cy.get('[data-testid="btn-add-profesor"]').click();

        // Usamos los nombres reales de tus inputs en GestionProfesores.js
        cy.get('input[name="nombre_profesor"]').type('Juan Programador');
        cy.get('input[name="email_contacto"]').type('juan@test.com');
        cy.get('input[name="horario_tutorias"]').type('Martes 16:00');

        // El nuevo testid que hemos acordado añadir
        cy.get('[data-testid="btn-guardar-profesor"]').click();

        cy.wait('@postProfesor');
        cy.contains('Juan Programador').should('be.visible');

        // --- PARTE 2: ELIMINACIÓN ---
        cy.intercept('DELETE', '**/api/profesores/*', (req) => {
            listaProfesores = listaProfesores.filter(p => p.id !== 11);
            req.reply({ statusCode: 200 });
        }).as('deleteReq');

        // Usamos el testid dinámico que añadimos al botón de la papelera
        cy.get('[data-testid="btn-delete-11"]').click();

        // Confirmamos en el modal (usando el testid del botón "Eliminar")
        cy.get('[data-testid="btn-confirmar-eliminar"]')
            .should('be.visible')
            .click();

        cy.wait('@deleteReq');
        cy.contains('Juan Programador').should('not.exist');
    });
});