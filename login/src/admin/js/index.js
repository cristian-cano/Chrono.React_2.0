import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

document.addEventListener("DOMContentLoaded", () => {
    const agregarEmpleadoBtn = document.querySelector("#empleados .btn-primary");
    const empleadosTable = document.querySelector("#empleados tbody");

    // Modales y formularios
    const modalAgregarEmpleado = new Modal(document.getElementById("modalAgregarEmpleado"));
    const modalEditarEmpleado = new Modal(document.getElementById("modalEditarEmpleado"));
    const formAgregarEmpleado = document.getElementById("formAgregarEmpleado");
    const formEditarEmpleado = document.getElementById("formEditarEmpleado");

    // Variables para almacenar la fila seleccionada
    let filaSeleccionada = null;

    // Abrir el modal al hacer clic en "Agregar Empleado"
    agregarEmpleadoBtn.addEventListener("click", () => {
        modalAgregarEmpleado.show();
    });

    // Manejar el envío del formulario para agregar un empleado
    formAgregarEmpleado.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = document.getElementById("inputIdEmpleado").value.trim();
        const nombre = document.getElementById("inputNombreEmpleado").value.trim();
        const departamento = document.getElementById("inputDepartamentoEmpleado").value.trim();

        // Crear una nueva fila
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${departamento}</td>
            <td>
                <button class="btn btn-warning btn-sm">Editar</button>
                <button class="btn btn-danger btn-sm">Eliminar</button>
            </td>
        `;
        empleadosTable.appendChild(fila);

        // Asignar eventos a los botones
        asignarEventosAcciones(fila);

        // Cerrar el modal y limpiar el formulario
        modalAgregarEmpleado.hide();
        formAgregarEmpleado.reset();
    });

    // Manejar el envío del formulario para editar un empleado
    formEditarEmpleado.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = document.getElementById("editIdEmpleado").value.trim();
        const nombre = document.getElementById("editNombreEmpleado").value.trim();
        const departamento = document.getElementById("editDepartamentoEmpleado").value.trim();

        // Actualizar los valores en la fila seleccionada
        filaSeleccionada.children[0].textContent = id;
        filaSeleccionada.children[1].textContent = nombre;
        filaSeleccionada.children[2].textContent = departamento;

        // Cerrar el modal
        modalEditarEmpleado.hide();
    });

    // Asignar eventos a los botones de la tabla
    function asignarEventosAcciones(fila) {
        const editarBtn = fila.querySelector(".btn-warning");
        const eliminarBtn = fila.querySelector(".btn-danger");

        editarBtn.addEventListener("click", () => {
            filaSeleccionada = fila;

            // Cargar los datos actuales en el modal de edición
            document.getElementById("editIdEmpleado").value = fila.children[0].textContent;
            document.getElementById("editNombreEmpleado").value = fila.children[1].textContent;
            document.getElementById("editDepartamentoEmpleado").value = fila.children[2].textContent;

            // Mostrar el modal de edición
            modalEditarEmpleado.show();
        });

        eliminarBtn.addEventListener("click", () => {
            if (confirm("¿Está seguro de eliminar este empleado?")) {
                fila.remove();
            }
        });
    }
});

// registro de asistencia
document.addEventListener("DOMContentLoaded", () => {
    const registrarAsistenciaBtn = document.querySelector("#asistencia .btn-success");
    const asistenciaTable = document.querySelector("#asistencia tbody");

    // Modal y formulario para registrar asistencia
    const modalRegistrarAsistencia = new Modal(document.getElementById("modalRegistrarAsistencia"));
    const formRegistrarAsistencia = document.getElementById("formRegistrarAsistencia");

    // Abrir el modal al hacer clic en "Registrar Asistencia"
    registrarAsistenciaBtn.addEventListener("click", () => {
        modalRegistrarAsistencia.show();
    });

    // Manejar el envío del formulario para registrar asistencia
    formRegistrarAsistencia.addEventListener("submit", (event) => {
        event.preventDefault();

        // Obtener valores del formulario
        const id = document.getElementById("inputIdAsistencia").value.trim();
        const nombre = document.getElementById("inputNombreAsistencia").value.trim();
        const entrada = document.getElementById("inputEntradaAsistencia").value.trim();
        const salida = document.getElementById("inputSalidaAsistencia").value.trim();
        const estado = document.getElementById("inputEstadoAsistencia").value.trim();

        // Crear una nueva fila en la tabla
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${entrada}</td>
            <td>${salida}</td>
            <td>${estado}</td>
        `;
        asistenciaTable.appendChild(fila);

        // Cerrar el modal y limpiar el formulario
        modalRegistrarAsistencia.hide();
        formRegistrarAsistencia.reset();
    });
});

//generacion de reportes
document.addEventListener("DOMContentLoaded", () => {
    const generarReporteBtn = document.querySelector("#reportes .btn-info");

    // Modal y formulario para generar reportes
    const modalGenerarReporte = new Modal(document.getElementById("modalGenerarReporte"));
    const formGenerarReporte = document.getElementById("formGenerarReporte");

    // Abrir el modal al hacer clic en "Generar Reporte"
    generarReporteBtn.addEventListener("click", () => {
        modalGenerarReporte.show();
    });

    // Manejar el envío del formulario para generar reporte
    formGenerarReporte.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Obtener valores del formulario
        const fechaInicio = document.getElementById("inputFechaInicio").value;
        const fechaFin = document.getElementById("inputFechaFin").value;
        const empleado = document.getElementById("inputEmpleado").value.trim();
        const estado = document.getElementById("inputEstado").value;

        // Parámetros del reporte
        const parametrosReporte = {
            fechaInicio,
            fechaFin,
            empleado: empleado || "Todos los empleados",
            estado: estado || "Todos los estados",
        };

        // Generar el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Agregar contenido al PDF
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Reporte de Asistencia CHRONOGUARD", 20, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Fecha de Inicio: ${parametrosReporte.fechaInicio}`, 20, 40);
        doc.text(`Fecha de Fin: ${parametrosReporte.fechaFin}`, 20, 50);
        doc.text(`Empleado: ${parametrosReporte.empleado}`, 20, 60);
        doc.text(`Estado: ${parametrosReporte.estado}`, 20, 70);

        // Guardar el archivo
        doc.save(`Reporte_Asistencia_${parametrosReporte.fechaInicio}_${parametrosReporte.fechaFin}.pdf`);

        // Cerrar el modal y limpiar el formulario
        modalGenerarReporte.hide();
        formGenerarReporte.reset();
    });
});
//configuraciones

