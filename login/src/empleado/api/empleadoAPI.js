const BASE_URL = "http://localhost:5000/empleado";

export const enviarSolicitud = async (solicitud) => {
  const res = await fetch(`${BASE_URL}/solicitud`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitud),
  });
  return res.json();
};

export const obtenerSolicitudes = async (id) => {
  const res = await fetch(`${BASE_URL}/solicitudes/${id}`);
  return res.json();
};

export const obtenerTurnos = async (id) => {
  const res = await fetch(`${BASE_URL}/turnos/${id}`);
  return res.json();
};

export const obtenerHorario = async (id) => {
  const res = await fetch(`${BASE_URL}/horario/${id}`);
  return res.json();
};

export const obtenerNotificaciones = async (id) => {
  const res = await fetch(`${BASE_URL}/notificaciones/${id}`);
  return res.json();
};
