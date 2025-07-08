import React from 'react';
import { Card } from 'react-bootstrap';

function Horarios() {
  return (
    <div className="container mt-4">
      <Card className="shadow p-4">
        <h2 className="mb-4">Horarios Asignados</h2>
        <p>Aquí podrás visualizar los horarios establecidos para tu jornada laboral.</p>
        {/* Aquí podrías cargar dinámicamente los horarios desde el backend */}
        <p className="text-muted">(Próximamente funcionalidad real)</p>
      </Card>
    </div>
  );
}

export default Horarios;