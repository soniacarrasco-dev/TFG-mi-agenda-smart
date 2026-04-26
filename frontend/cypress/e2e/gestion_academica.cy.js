describe('Gestión Académica - Flujo de Eventos', () => {

    // Lista dinámica para simular el comportamiento del backend
    let listaEventos = [
        {
            id: 1,
            titulo: 'Examen de Redes',
            tipo: 'Examen',
            nombre_asignatura: 'Desarrollo Web Entorno Servidor',
            fecha_vencimiento: '2026-05-15T00:00:00.000Z',
            id_asignatura: 1,
            completado: 0
        }
    ];

    beforeEach(() => {
        // Evitar que errores menores de la web detengan el test
        Cypress.on('uncaught:exception', () => false);

        // 1. REQUISITOS PREVIOS: Profesores y Asignaturas
        cy.intercept('GET', '**/api/profesores/*', [
            { id: 10, nombre_profesor: 'Alejandro García', email_contacto: 'alejandro@test.com' }
        ]).as('getProfesores');

        cy.intercept('GET', '**/api/asignaturas/*', [
            { id: 1, nombre_asignatura: 'Desarrollo Web Entorno Servidor', id_profesor: 10 }
        ]).as('getAsignaturas');

        // 2. MOCK DE EVENTOS (Lectura)
        cy.intercept('GET', '**/api/eventos/*', (req) => {
            req.reply(listaEventos);
        }).as('getEventos');

        // 3. LOGIN (Usando tu estructura data.user)
        cy.intercept('POST', '**/api/login', {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                user: { nombre: 'Sonia', id: 1 }
            }
        });

        // Procedimiento de entrada
        cy.visit('http://localhost:3000');
        cy.get('input[type="email"]').clear().type('test@test.com');
        cy.get('input[type="password"]').clear().type('1234');
        cy.get('.btn-access').click();

        cy.contains('Gestión Académica', { timeout: 10000 }).click();

        // Esperamos a que los requisitos previos carguen en la interfaz
        cy.wait(['@getAsignaturas', '@getProfesores', '@getEventos']);
    });

    it('Debe crear un evento y luego eliminarlo (Ciclo CRUD)', () => {
        const nuevoEvento = {
            id: 2,
            titulo: 'Práctica Final Jest',
            tipo: 'Tarea',
            id_asignatura: 1,
            fecha_vencimiento: '2026-05-20T00:00:00.000Z'
        };

        // --- PARTE 1: CREACIÓN ---
        cy.intercept('POST', '**/api/eventos', (req) => {
            listaEventos.push({ ...nuevoEvento, completado: 0, nombre_asignatura: 'Desarrollo Web Entorno Servidor' });
            req.reply({ statusCode: 201, body: nuevoEvento });
        }).as('saveEvento');

        cy.get('[data-testid="btn-nuevo-evento"]').click();

        cy.get('input[type="text"]').first().clear().type('Práctica Final Jest');
        cy.get('select').first().select('Tarea');

        // Seleccionamos la asignatura que creamos en el mock
        cy.get('select').last().select('Desarrollo Web Entorno Servidor');

        cy.get('input[type="date"]').type('2026-05-20');
        cy.get('[data-testid="btn-guardar-evento"]').click();

        cy.wait('@saveEvento');
        cy.contains('Práctica Final Jest').should('be.visible');

        // --- PARTE 2: ELIMINACIÓN ---
        // Simulamos que al borrar, la lista se actualiza
        cy.intercept('DELETE', '**/api/eventos/*', (req) => {
            listaEventos = listaEventos.filter(e => e.titulo !== 'Práctica Final Jest');
            req.reply({ statusCode: 200 });
        }).as('deleteReq');

        // 1. Pulsamos el botón de la papelera que creamos antes
        cy.get('[data-testid="btn-delete-2"]').click();

        // 2. Pulsamos el botón "Eliminar" del modal usando su nuevo testid
        // Añadimos be.visible para asegurar que el modal ha terminado de cargar
        cy.get('[data-testid="btn-confirmar-eliminar"]')
            .should('be.visible')
            .click();

        // 3. Verificaciones finales
        cy.wait('@deleteReq');
        cy.contains('Práctica Final Jest').should('not.exist');
    });
});