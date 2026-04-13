import React from 'react';
import RowEvento from './RowEvento';

const VencimientosCard = ({ proximos }) => {

    const obtenerEventosAMostrar = () => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const limiteSieteDias = new Date();
        limiteSieteDias.setHours(0, 0, 0, 0);
        limiteSieteDias.setDate(hoy.getDate() + 7);

        const futuros = proximos
            .filter(ev => {
                const f = new Date(ev.fecha_vencimiento);
                f.setHours(0, 0, 0, 0);
                return f >= hoy;
            })
            .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));

        const deLaSemana = futuros.filter(ev => {
            const f = new Date(ev.fecha_vencimiento);
            f.setHours(0, 0, 0, 0);
            return f <= limiteSieteDias;
        });

        const LIMITE = 5;

        if (deLaSemana.length >= LIMITE) {
            return deLaSemana; // todos los urgentes (aunque sean más de 5)
        }

        // completar con futuros sin repetir
        const restantes = futuros.filter(
            ev => !deLaSemana.some(d => d.id === ev.id)
        );

        return [...deLaSemana, ...restantes].slice(0, LIMITE);
    };

    const eventosAMostrar = obtenerEventosAMostrar();

    return (
        <section className="vencimientos-section">
            <h3>PRÓXIMOS VENCIMIENTOS</h3>
            <div className="card-lista">
                {eventosAMostrar.length > 0 ? (
                    eventosAMostrar.map(ev => (
                        <RowEvento key={ev.id} ev={ev} />
                    ))
                ) : (
                    <p className="empty-text">No hay tareas pendientes</p>
                )}
            </div>
        </section>
    );
};

export default VencimientosCard;