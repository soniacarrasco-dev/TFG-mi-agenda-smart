describe('Módulo de Autenticación', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Debe mostrar error con credenciales incorrectas', () => {
        cy.intercept('POST', '**/api/login', {
            statusCode: 401,
            body: { mensaje: 'Contraseña incorrecta' }
        }).as('loginFail');

        cy.get('input[type="email"]').clear().type('test@test.com');
        cy.get('input[type="password"]').clear().type('password_erronea');

        // Hacemos click en el botón de Acceder
        cy.get('.btn-access').click();

        // Esperamos a que la petición termine
        cy.wait('@loginFail');

        // Ahora buscará el texto exacto que devuelve el interceptor y que el estado 'mensaje' pintará
        cy.contains('Contraseña incorrecta', { timeout: 10000 })
            .should('be.visible');

        cy.url().should('not.include', '/home');
    });

    it('Debe acceder correctamente con el usuario de la base de datos', () => {
        // Simulamos éxito. El código espera data.user y data.token
        cy.intercept('POST', '**/api/login', {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                user: { nombre: 'Sonia', email: 'test@test.com', id: 1 }
            }
        }).as('loginSuccess');

        cy.get('input[type="email"]').clear().type('test@test.com');
        cy.get('input[type="password"]').clear().type('1234');

        cy.get('.btn-access').click();

        // Esperamos a que se procese el login y la redirección
        cy.url({ timeout: 10000 }).should('include', '/home');
    });
});