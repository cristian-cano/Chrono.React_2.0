import React from 'react';
import { Card } from 'react-bootstrap';

function Turnos() {
  return (
    <div className="container mt-4">
      <Card className="shadow p-4">
        <h2 className="mb-4">Turnos Asignados</h2>
        <p>Aquí podrás ver los turnos asignados a tu perfil como empleado.</p>
        {/* Datos de ejemplo o tabla futura */}
        <p className="text-muted">(Se mostrará una tabla con tus turnos aquí)</p>
      </Card>
    </div>
  );
}

export default Turnos;