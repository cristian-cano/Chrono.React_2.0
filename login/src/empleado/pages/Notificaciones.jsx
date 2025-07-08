import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function Notificaciones() {
  return (
    <div className="container mt-4">
      <Card className="shadow p-4">
        <h2 className="mb-4">Notificaciones</h2>
        <p>Consulta las actualizaciones sobre tus solicitudes, aprobaciones o cambios en tus turnos.</p>
        <ListGroup>
          <ListGroup.Item>🔔 Aprobación de permiso del 5 de julio.</ListGroup.Item>
          <ListGroup.Item>📅 Nuevo horario asignado: 7:00am - 3:00pm.</ListGroup.Item>
          <ListGroup.Item>🕒 Recordatorio: Turno especial este domingo.</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}

export default Notificaciones;