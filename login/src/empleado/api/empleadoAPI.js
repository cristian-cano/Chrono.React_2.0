const BASE_URL = "http://localhost:5170/empleado";

// Enviar nueva solicitud
export const enviarSolicitud = async (solicitud) => {
  try {
    const res = await fetch(`${BASE_URL}/solicitud`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    return { error: "Error al conectar con el servidor." };
  }
};

// Obtener solicitudes del usuario
export const obtenerSolicitudes = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/solicitudes/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    return [];
  }
};

// Obtener turnos del usuario
export const obtenerTurnos = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/turnos/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    return [];
  }
};

// Obtener horario semanal del usuario
export const obtenerHorario = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/horario/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Error al obtener horario:", error);
    return [];
  }
};

// Obtener notificaciones del usuario
export const obtenerNotificaciones = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/notificaciones/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};
