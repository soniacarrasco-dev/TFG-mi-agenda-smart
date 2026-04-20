import { render, screen, fireEvent } from '@testing-library/react';
import FormularioAutenticacion from './FormularioAutenticacion';

test('muestra formulario de login', () => {
    render(<FormularioAutenticacion tipo="login" />);

    expect(screen.getByText(/INICIAR SESIÓN/i)).toBeInTheDocument();
});

test('error si contraseñas no coinciden en registro', () => {
    render(<FormularioAutenticacion tipo="registro" />);

    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
        target: { value: '1234' }
    });

    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), {
        target: { value: '5678' }
    });

    fireEvent.click(screen.getByText(/Enviar datos/i));

    expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
});